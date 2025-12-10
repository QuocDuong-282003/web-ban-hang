import React, { useState, useEffect } from 'react';
import SalesChart from '../char/orderChar/SalesChart';
import OrderStatusChart from '../char/orderChar/OrderStatusChart';
import LoginBarChart from '../char/LoginBarChart';
import LoginPieChart from '../char/LoginPieChart';
import {
    getOverviewStats,
    getSalesStats,
    getOrderStatusStats,
    getTopProducts,
    getMonthlyComparison,
    getQuarterlyComparison,
    getQuarterlyStats,
    getMonthlyPerformance
} from '../services/dashboardService';
import './Dashboard.scss';

const Dashboard = () => {
    const [filterBy, setFilterBy] = useState('month'); // custom, month, quarter, year
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [groupBy, setGroupBy] = useState('day'); // day, week, month

    // Date range for custom filter
    const getDefaultFromDate = () => {
        const date = new Date();
        date.setDate(1); // First day of current month
        return date.toISOString().split('T')[0];
    };
    const getDefaultToDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const [fromDate, setFromDate] = useState(getDefaultFromDate());
    const [toDate, setToDate] = useState(getDefaultToDate());

    // Previous period dates for comparison
    const [fromDatePrevious, setFromDatePrevious] = useState('');
    const [toDatePrevious, setToDatePrevious] = useState('');

    const [compareWithPrevious, setCompareWithPrevious] = useState(false);
    const [overviewStats, setOverviewStats] = useState(null);
    const [comparisonData, setComparisonData] = useState(null);
    const [quarterlyData, setQuarterlyData] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [monthlyPerf, setMonthlyPerf] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentDate] = useState(new Date());

    // Calculate previous period dates when fromDate/toDate change
    useEffect(() => {
        if (compareWithPrevious && fromDate && toDate) {
            const from = new Date(fromDate);
            const to = new Date(toDate);
            const diffTime = to - from;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Calculate previous period (same duration before fromDate)
            const prevTo = new Date(from);
            prevTo.setDate(prevTo.getDate() - 1);
            const prevFrom = new Date(prevTo);
            prevFrom.setDate(prevFrom.getDate() - diffDays);

            setFromDatePrevious(prevFrom.toISOString().split('T')[0]);
            setToDatePrevious(prevTo.toISOString().split('T')[0]);
        }
    }, [fromDate, toDate, compareWithPrevious]);

    // Fetch all dashboard data
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Determine period based on filterBy
                const period = filterBy === 'month' ? 'month' : filterBy === 'quarter' ? 'quarter' : filterBy === 'year' ? 'year' : 'custom';

                // Build API params based on filter
                const apiParams = {};
                if (filterBy === 'custom') {
                    apiParams.fromDate = fromDate;
                    apiParams.toDate = toDate;
                } else if (filterBy === 'month') {
                    apiParams.month = selectedMonth;
                    apiParams.year = selectedYear;
                } else if (filterBy === 'year') {
                    apiParams.year = selectedYear;
                }

                // Fetch data based on filterBy - chỉ fetch khi có params hợp lệ
                const promises = [];

                // Overview stats - luôn fetch (không filter theo năm)
                promises.push(getOverviewStats().catch(e => ({ data: null })));

                // Quarterly stats - chỉ fetch khi không phải custom
                if (filterBy !== 'custom') {
                    promises.push(getQuarterlyStats().catch(e => ({ data: null })));
                } else {
                    promises.push(Promise.resolve({ data: null }));
                }

                // Top products - chỉ fetch khi có period hợp lệ
                if (period !== 'custom') {
                    promises.push(getTopProducts(10, period).catch(e => ({ data: [] })));
                } else {
                    promises.push(Promise.resolve({ data: [] }));
                }

                // Monthly performance - chỉ fetch khi filterBy === 'month'
                if (filterBy === 'month') {
                    promises.push(getMonthlyPerformance(selectedMonth, selectedYear).catch(e => ({ data: null })));
                } else {
                    promises.push(Promise.resolve({ data: null }));
                }

                // Add comparison if checkbox is checked
                if (compareWithPrevious) {
                    if (filterBy === 'month') {
                        promises.push(getMonthlyComparison().catch(e => ({ data: null })));
                    } else if (filterBy === 'quarter') {
                        promises.push(getQuarterlyComparison().catch(e => ({ data: null })));
                    } else {
                        promises.push(Promise.resolve({ data: null }));
                    }
                } else {
                    promises.push(Promise.resolve({ data: null }));
                }

                const [overview, quarterly, products, monthly, comparison] = await Promise.all(promises);

                // Chỉ set data nếu thực sự có data (không phải null/empty)
                if (overview.data) {
                    setOverviewStats(overview.data);
                } else {
                    setOverviewStats(null);
                }

                if (comparison.data) {
                    setComparisonData(comparison.data);
                } else {
                    setComparisonData(null);
                }

                if (quarterly.data) {
                    setQuarterlyData(quarterly.data);
                } else {
                    setQuarterlyData(null);
                }

                if (products.data && Array.isArray(products.data) && products.data.length > 0) {
                    setTopProducts(products.data);
                } else {
                    setTopProducts([]);
                }

                if (monthly.data) {
                    setMonthlyPerf(monthly.data);
                } else {
                    setMonthlyPerf(null);
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu dashboard:", error);
                // Reset all data khi có lỗi
                setOverviewStats(null);
                setComparisonData(null);
                setQuarterlyData(null);
                setTopProducts([]);
                setMonthlyPerf(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [filterBy, selectedMonth, selectedYear, fromDate, toDate, compareWithPrevious]);

    // Calculate percentage change
    const calculateChange = (current, previous) => {
        if (!previous || previous === 0) return { value: 0, isPositive: true };
        const change = ((current - previous) / previous) * 100;
        return {
            value: Math.abs(change).toFixed(1),
            isPositive: change >= 0
        };
    };

    // Format currency
    const formatCurrency = (value) => {
        if (!value && value !== 0) return '—';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(value);
    };

    // Format full currency
    const formatFullCurrency = (value) => {
        if (!value && value !== 0) return '—';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    // Calculate success rate
    const successRate = overviewStats && overviewStats.totalOrders > 0
        ? (((overviewStats.totalOrders - (overviewStats.totalCancelledOrders || 0)) / overviewStats.totalOrders) * 100).toFixed(1)
        : 0;

    // Revenue comparison
    const revenueChange = comparisonData && compareWithPrevious
        ? calculateChange(comparisonData.current || 0, comparisonData.previous || 0)
        : { value: 0, isPositive: true };

    // Get filter label
    const getFilterLabel = () => {
        const labels = {
            custom: 'kỳ',
            month: 'tháng',
            quarter: 'quý',
            year: 'năm'
        };
        return labels[filterBy] || 'kỳ';
    };

    // Format date for display (DD/MM/YYYY)
    const formatDateDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Generate month options
    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: `Tháng ${i + 1}`
    }));

    // Generate year options (current year and 5 years back)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 6 }, (_, i) => ({
        value: currentYear - i,
        label: `${currentYear - i}`
    }));

    // Get period display text
    const getPeriodDisplay = () => {
        if (filterBy === 'custom' && fromDate && toDate) {
            return `${formatDateDisplay(fromDate)} đến ${formatDateDisplay(toDate)}`;
        } else if (filterBy === 'month' && selectedMonth && selectedYear) {
            return `Tháng ${selectedMonth}/${selectedYear}`;
        } else if (filterBy === 'quarter' && selectedYear) {
            return `Quý ${Math.ceil(selectedMonth / 3)}/${selectedYear}`;
        } else if (filterBy === 'year' && selectedYear) {
            return `Năm ${selectedYear}`;
        }
        return 'Khoảng thời gian đã chọn';
    };

    // Calculate total revenue from overviewStats
    const totalRevenue = overviewStats?.totalRevenue || 0;
    const previousRevenue = comparisonData?.previous || 0;
    const currentRevenue = comparisonData?.current || overviewStats?.totalRevenue || 0;
    const revenueChangePercent = compareWithPrevious && previousRevenue > 0
        ? (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(2)
        : null;

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <div className="dashboard-breadcrumb">
                    <h1 className="dashboard-title">Báo cáo hệ thống</h1>
                </div>
                <button className="dashboard-export-btn" title="Xuất Excel">
                    <i className="fas fa-file-excel"></i>
                    <span>Xuất Excel</span>
                </button>
            </div>

            {/* Filter Section */}
            <div className="dashboard-filter-section">
                <h3 className="dashboard-filter-title">Bộ lọc</h3>

                <div className="dashboard-filter-row">
                    <div className="dashboard-filter-group">
                        <label className="dashboard-filter-label">Lọc theo</label>
                        <select
                            className="dashboard-filter-select"
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                        >
                            <option value="custom">Tùy chọn</option>
                            <option value="month">Theo tháng</option>
                            <option value="quarter">Theo quý</option>
                            <option value="year">Theo năm</option>
                        </select>
                    </div>

                    {filterBy === 'custom' && (
                        <>
                            <div className="dashboard-filter-group">
                                <label className="dashboard-filter-label">Từ ngày</label>
                                <div className="dashboard-date-input-wrapper">
                                    <input
                                        type="date"
                                        className="dashboard-filter-date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                    <i className="fas fa-calendar-alt dashboard-date-icon"></i>
                                </div>
                            </div>

                            <div className="dashboard-filter-group">
                                <label className="dashboard-filter-label">Đến ngày</label>
                                <div className="dashboard-date-input-wrapper">
                                    <input
                                        type="date"
                                        className="dashboard-filter-date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                    <i className="fas fa-calendar-alt dashboard-date-icon"></i>
                                </div>
                            </div>
                        </>
                    )}

                    {filterBy === 'month' && (
                        <div className="dashboard-filter-group">
                            <label className="dashboard-filter-label">Tháng</label>
                            <select
                                className="dashboard-filter-select"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            >
                                {monthOptions.map(month => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="dashboard-filter-group">
                        <label className="dashboard-filter-label">Năm</label>
                        <select
                            className="dashboard-filter-select"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                        >
                            {yearOptions.map(year => (
                                <option key={year.value} value={year.value}>
                                    {year.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="dashboard-filter-group">
                        <label className="dashboard-filter-label">Nhóm theo</label>
                        <select
                            className="dashboard-filter-select"
                            value={groupBy}
                            onChange={(e) => setGroupBy(e.target.value)}
                        >
                            <option value="day">Ngày</option>
                            <option value="week">Tuần</option>
                            <option value="month">Tháng</option>
                        </select>
                    </div>
                </div>

                <div className="dashboard-filter-row dashboard-filter-row-compare">
                    <div className="dashboard-filter-checkbox">
                        <input
                            type="checkbox"
                            id="compare-previous"
                            checked={compareWithPrevious}
                            onChange={(e) => setCompareWithPrevious(e.target.checked)}
                        />
                        <label htmlFor="compare-previous">So sánh với kỳ trước</label>
                    </div>

                    {compareWithPrevious && (
                        <>
                            <div className="dashboard-filter-group">
                                <label className="dashboard-filter-label">Từ ngày (kỳ trước)</label>
                                <div className="dashboard-date-input-wrapper">
                                    <input
                                        type="date"
                                        className="dashboard-filter-date"
                                        value={fromDatePrevious}
                                        onChange={(e) => setFromDatePrevious(e.target.value)}
                                    />
                                    <i className="fas fa-calendar-alt dashboard-date-icon"></i>
                                </div>
                            </div>

                            <div className="dashboard-filter-group">
                                <label className="dashboard-filter-label">Đến ngày (kỳ trước)</label>
                                <div className="dashboard-date-input-wrapper">
                                    <input
                                        type="date"
                                        className="dashboard-filter-date"
                                        value={toDatePrevious}
                                        onChange={(e) => setToDatePrevious(e.target.value)}
                                    />
                                    <i className="fas fa-calendar-alt dashboard-date-icon"></i>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <p>Đang tải dữ liệu...</p>
                </div>
            ) : (
                <>
                    {/* Navigation Tabs */}
                    <div className="dashboard-tabs">
                        <button className="dashboard-tab active">Doanh thu tổng hợp</button>
                        <button className="dashboard-tab">Hiệu suất khách sạn</button>
                        <button className="dashboard-tab">Thống kê người dùng</button>
                        <button className="dashboard-tab">Phân tích mùa vụ</button>
                        <button className="dashboard-tab">Địa điểm phổ biến</button>
                        <button className="dashboard-tab">Loại phòng phổ biến</button>
                        <button className="dashboard-tab">Báo cáo tài chính</button>
                    </div>

                    {/* Revenue Summary Banner */}
                    {overviewStats && (
                        <div className="dashboard-revenue-banner">
                            <div className="revenue-banner-left">
                                <div className="revenue-banner-title">Tổng doanh thu (Tất cả khách sạn)</div>
                                <div className="revenue-banner-value">{formatCurrency(totalRevenue)}</div>
                                <div className="revenue-banner-period">Khoảng thời gian: {getPeriodDisplay()}</div>
                            </div>
                            {compareWithPrevious && revenueChangePercent !== null && (
                                <div className="revenue-banner-right">
                                    <div className="revenue-banner-title">Thay đổi so với kỳ trước</div>
                                    <div className={`revenue-banner-change ${revenueChangePercent >= 0 ? 'positive' : 'negative'}`}>
                                        {revenueChangePercent >= 0 ? '+' : ''}{revenueChangePercent}%
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Main Summary Cards */}
                    {overviewStats && (
                        <div className="dashboard-summary-cards">
                            <div className="summary-card revenue-card">
                                <div className="card-icon">
                                    <i className="fas fa-dollar-sign"></i>
                                </div>
                                <div className="card-content">
                                    <div className="card-title">Tổng Doanh thu</div>
                                    <div className="card-value">
                                        {overviewStats.totalRevenue ? formatCurrency(overviewStats.totalRevenue) : '—'}
                                    </div>
                                    {compareWithPrevious && comparisonData && (
                                        <div className={`card-change ${revenueChange.isPositive ? 'positive' : 'negative'}`}>
                                            <span className="change-icon">{revenueChange.isPositive ? '▲' : '▼'}</span>
                                            <span>{revenueChange.value}% so với {getFilterLabel()} trước</span>
                                        </div>
                                    )}
                                    {!compareWithPrevious && (
                                        <div className="card-change neutral">
                                            <span>Doanh thu</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="summary-card orders-card">
                                <div className="card-icon">
                                    <i className="fas fa-shopping-cart"></i>
                                </div>
                                <div className="card-content">
                                    <div className="card-title">Tổng Đơn hàng</div>
                                    <div className="card-value">
                                        {overviewStats.totalOrders || 0}
                                    </div>
                                    <div className="card-change positive">
                                        <span className="change-icon">▲</span>
                                        <span>Đơn hàng</span>
                                    </div>
                                </div>
                            </div>

                            <div className="summary-card success-card">
                                <div className="card-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="card-content">
                                    <div className="card-title">Đơn thành công</div>
                                    <div className="card-value">
                                        {overviewStats.totalOrders - (overviewStats.totalCancelledOrders || 0)}
                                    </div>
                                    <div className="card-change positive">
                                        <span className="change-icon">✓</span>
                                        <span>{successRate}% tỉ lệ thành công</span>
                                    </div>
                                </div>
                            </div>

                            <div className="summary-card cancelled-card">
                                <div className="card-icon">
                                    <i className="fas fa-times-circle"></i>
                                </div>
                                <div className="card-content">
                                    <div className="card-title">Đơn đã hủy</div>
                                    <div className="card-value">
                                        {overviewStats.totalCancelledOrders || 0}
                                    </div>
                                    <div className="card-change negative">
                                        <span className="change-icon">▼</span>
                                        <span>Đơn hủy</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!overviewStats && !loading && (
                        <div className="dashboard-no-data">
                            <p>Không có dữ liệu cho khoảng thời gian đã chọn. Vui lòng chọn khoảng thời gian khác.</p>
                        </div>
                    )}

                    {/* Revenue Chart - Full Width */}
                    <div className="dashboard-revenue-chart-section">
                        <div className="chart-widget revenue-chart-full">
                            <div className="chart-widget-header">
                                <h3 className="chart-title">Doanh thu & Đơn hàng</h3>
                                <div className="chart-actions">
                                    <button title="Menu">
                                        <i className="fas fa-ellipsis-v"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="chart-widget-body">
                                <SalesChart
                                    filterBy={filterBy}
                                    selectedYear={selectedYear}
                                    selectedMonth={selectedMonth}
                                    fromDate={fromDate}
                                    toDate={toDate}
                                    groupBy={groupBy}
                                    compareWithPrevious={compareWithPrevious}
                                    fromDatePrevious={fromDatePrevious}
                                    toDatePrevious={toDatePrevious}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Charts Row - Order Status & Other Charts */}
                    <div className="dashboard-charts-section">
                        <div className="chart-widget donut-chart-widget">
                            <div className="chart-widget-header">
                                <h3 className="chart-title">Tình trạng Đơn hàng</h3>
                                <div className="chart-actions">
                                    <button title="Cài đặt">
                                        <i className="fas fa-cog"></i>
                                    </button>
                                    <button title="Danh sách">
                                        <i className="fas fa-list"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="chart-widget-body">
                                <OrderStatusChart />
                            </div>
                        </div>
                    </div>

                    {/* Secondary Stats Row */}
                    <div className="dashboard-secondary-stats">
                        <div className="secondary-stat-card">
                            <div className="stat-label">Hiệu suất tháng này</div>
                            <div className="stat-value">
                                {monthlyPerf?.performance || monthlyPerf?.percentage || '—'}
                            </div>
                            <div className="stat-description">
                                {monthlyPerf?.description || 'So với tháng trước'}
                            </div>
                        </div>

                        <div className="secondary-stat-card">
                            <div className="stat-label">Tỉ lệ thành công</div>
                            <div className="stat-value">{successRate}%</div>
                            <div className="stat-description">
                                {overviewStats?.totalOrders || 0} đơn hàng
                            </div>
                        </div>

                        <div className="secondary-stat-card">
                            <div className="stat-label">Doanh thu trung bình/đơn</div>
                            <div className="stat-value">
                                {overviewStats?.totalOrders > 0 && overviewStats?.totalRevenue
                                    ? formatCurrency(overviewStats.totalRevenue / overviewStats.totalOrders)
                                    : '—'}
                            </div>
                            <div className="stat-description">Giá trị trung bình</div>
                        </div>

                        {compareWithPrevious && (
                            <div className="secondary-stat-card">
                                <div className="stat-label">So sánh {getFilterLabel()} trước</div>
                                <div className={`stat-value ${revenueChange.isPositive ? 'positive' : 'negative'}`}>
                                    {revenueChange.isPositive ? '+' : '-'}{revenueChange.value}%
                                </div>
                                <div className="stat-description">
                                    {comparisonData
                                        ? `${formatCurrency(comparisonData.current || 0)} vs ${formatCurrency(comparisonData.previous || 0)}`
                                        : 'Không có dữ liệu'}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quarterly Stats */}
                    {quarterlyData && (
                        <div className="dashboard-quarterly-section">
                            <h3 className="section-title">Thống kê theo Quý (4 Quý)</h3>
                            <div className="quarterly-grid">
                                {[1, 2, 3, 4].map((quarter) => {
                                    const quarterData = quarterlyData[`Q${quarter}`] || quarterlyData[`quarter${quarter}`] || {};
                                    const maxRevenue = Math.max(
                                        ...Object.values(quarterlyData || {}).map(q => q?.revenue || 0)
                                    );
                                    const percentage = maxRevenue > 0
                                        ? ((quarterData.revenue || 0) / maxRevenue * 100).toFixed(0)
                                        : 0;

                                    return (
                                        <div key={quarter} className="quarter-card">
                                            <div className="quarter-header">
                                                <span className="quarter-label">Quý {quarter}</span>
                                                <span className="quarter-badge">4 tháng</span>
                                            </div>
                                            <div className="quarter-revenue">
                                                {formatCurrency(quarterData.revenue || 0)}
                                            </div>
                                            <div className="quarter-orders">
                                                {quarterData.orders || 0} đơn hàng
                                            </div>
                                            <div className="quarter-progress">
                                                <div
                                                    className="quarter-progress-bar"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Top Products Section */}
                    {topProducts.length > 0 && (
                        <div className="dashboard-top-products">
                            <div className="section-header">
                                <h3 className="section-title">Sản phẩm bán chạy</h3>
                                <a href="#products" className="view-all-link">Xem tất cả</a>
                            </div>
                            <div className="top-products-grid">
                                {topProducts.slice(0, 8).map((product, index) => (
                                    <div key={product._id || product.id || index} className="product-item">
                                        <div className="product-rank">#{index + 1}</div>
                                        <div className="product-info">
                                            <div className="product-name">{product.name || product.productName || 'N/A'}</div>
                                            <div className="product-stats">
                                                <span className="product-sold">{product.quantitySold || product.sold || 0} đã bán</span>
                                                <span className="product-revenue">{formatCurrency(product.revenue || product.totalRevenue || 0)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Charts Row 2 - Access Stats */}
                    <div className="dashboard-charts-section">
                        <div className="chart-widget">
                            <div className="chart-widget-header">
                                <h3 className="chart-title">Thống kê truy cập theo ngày</h3>
                                <div className="chart-actions">
                                    <button title="Cài đặt">
                                        <i className="fas fa-cog"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="chart-widget-body">
                                <LoginBarChart />
                            </div>
                        </div>

                        <div className="chart-widget">
                            <div className="chart-widget-header">
                                <h3 className="chart-title">Phân loại người dùng</h3>
                                <div className="chart-actions">
                                    <button title="Cài đặt">
                                        <i className="fas fa-cog"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="chart-widget-body">
                                <LoginPieChart />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
