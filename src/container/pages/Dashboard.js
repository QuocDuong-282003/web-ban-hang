import React, { useState, useEffect } from 'react';
import SalesChart from '../char/orderChar/SalesChart';
import OrderStatusChart from '../char/orderChar/OrderStatusChart';
import TopOrdersChart from '../char/orderChar/TopOrdersChart';
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
    getMonthlyPerformance,
    getSalesByFilter
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
    const [activeTab, setActiveTab] = useState('revenue'); // revenue, orders, popular-orders, financial

    // New state for API response
    const [salesData, setSalesData] = useState(null); // { currentPeriod, previousPeriod, summary, detailedChangeRates }

    // Calculate previous period dates when fromDate/toDate change (for custom filter only)
    // Note: API tự động tính kỳ trước cho month/quarter/year, không cần tính thủ công
    useEffect(() => {
        if (compareWithPrevious && filterBy === 'custom' && fromDate && toDate) {
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
        } else {
            // Clear previous dates for non-custom filters (API will auto-calculate)
            setFromDatePrevious('');
            setToDatePrevious('');
        }
    }, [fromDate, toDate, compareWithPrevious, filterBy]);

    // Fetch all dashboard data using new API
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Build params for new API: /api/stats/sales-by-filter
                // Khi filterBy='year' và compareWithPrevious=true, groupBy sẽ là 'month' để so sánh theo tháng
                let effectiveGroupBy = groupBy;
                if (filterBy === 'year' && compareWithPrevious) {
                    effectiveGroupBy = 'month'; // So sánh năm theo tháng
                } else if (filterBy === 'year' && !compareWithPrevious) {
                    effectiveGroupBy = 'month'; // Hiển thị năm theo tháng
                } else if (filterBy === 'quarter' && compareWithPrevious) {
                    effectiveGroupBy = 'month'; // So sánh quý theo tháng
                }

                const apiParams = {
                    filterType: filterBy === 'custom' ? 'custom' : filterBy,
                    groupBy: effectiveGroupBy
                };

                // Add filter-specific params
                if (filterBy === 'custom') {
                    apiParams.fromDate = fromDate;
                    apiParams.toDate = toDate;
                } else if (filterBy === 'month') {
                    apiParams.month = selectedMonth;
                    apiParams.year = selectedYear;
                } else if (filterBy === 'quarter') {
                    apiParams.year = selectedYear;
                } else if (filterBy === 'year') {
                    apiParams.year = selectedYear;
                }

                // Add comparison flag
                if (compareWithPrevious) {
                    apiParams.compareWithPrevious = true;
                }

                // Fetch sales data from new API
                const salesResponse = await getSalesByFilter(apiParams).catch(e => {
                    console.error('Error fetching sales data:', e);
                    return { data: { data: null } };
                });

                const salesDataResult = salesResponse?.data?.data;

                if (salesDataResult) {
                    setSalesData(salesDataResult);

                    // Extract overview stats from currentPeriod
                    if (salesDataResult.currentPeriod) {
                        setOverviewStats({
                            totalRevenue: salesDataResult.currentPeriod.totalRevenue || 0,
                            totalOrders: salesDataResult.currentPeriod.totalOrders || 0,
                            totalCancelledOrders: 0 // API mới không có field này, có thể lấy từ OrderStatusChart
                        });
                    }

                    // Extract comparison data from summary
                    if (salesDataResult.summary && compareWithPrevious) {
                        setComparisonData({
                            current: salesDataResult.summary.currentRevenue || 0,
                            previous: salesDataResult.summary.previousRevenue || 0
                        });
                    } else {
                        setComparisonData(null);
                    }
                } else {
                    setSalesData(null);
                    setOverviewStats(null);
                    setComparisonData(null);
                }

                // Fetch other data (keep existing APIs for now)
                const promises = [
                    getOverviewStats().catch(e => ({ data: null })),
                    getQuarterlyStats().catch(e => ({ data: null })),
                    getTopProducts(10, filterBy === 'month' ? 'month' : filterBy === 'quarter' ? 'quarter' : 'year').catch(e => ({ data: [] })),
                    filterBy === 'month' ? getMonthlyPerformance(selectedMonth, selectedYear).catch(e => ({ data: null })) : Promise.resolve({ data: null })
                ];

                const [overview, quarterly, products, monthly] = await Promise.all(promises);

                // Set quarterly data
                if (quarterly.data) {
                    setQuarterlyData(quarterly.data);
                } else {
                    setQuarterlyData(null);
                }

                // Set top products
                if (products.data && Array.isArray(products.data) && products.data.length > 0) {
                    setTopProducts(products.data);
                } else {
                    setTopProducts([]);
                }

                // Set monthly performance
                if (monthly.data) {
                    setMonthlyPerf(monthly.data);
                } else {
                    setMonthlyPerf(null);
                }

            } catch (error) {
                console.error("Lỗi tải dữ liệu dashboard:", error);
                // Reset all data khi có lỗi
                setSalesData(null);
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
    }, [filterBy, selectedMonth, selectedYear, fromDate, toDate, compareWithPrevious, groupBy]);

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
        const formatted = new Intl.NumberFormat('vi-VN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
        return formatted + ' VND';
    };

    // Format full currency
    const formatFullCurrency = (value) => {
        if (!value && value !== 0) return '—';
        const formatted = new Intl.NumberFormat('vi-VN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
        return formatted + ' VND';
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

    // Calculate total revenue from salesData (new API) or overviewStats (fallback)
    const totalRevenue = salesData?.currentPeriod?.totalRevenue || overviewStats?.totalRevenue || 0;
    const previousRevenue = salesData?.summary?.previousRevenue || comparisonData?.previous || 0;
    const currentRevenue = salesData?.summary?.currentRevenue || salesData?.currentPeriod?.totalRevenue || comparisonData?.current || overviewStats?.totalRevenue || 0;

    // Use percentageChange from API summary if available
    const revenueChangePercent = salesData?.summary?.percentageChange !== null && salesData?.summary?.percentageChange !== undefined
        ? parseFloat(salesData.summary.percentageChange).toFixed(2)
        : (compareWithPrevious && previousRevenue > 0
            ? (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(2)
            : null);

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
                        <button
                            className={`dashboard-tab ${activeTab === 'revenue' ? 'active' : ''}`}
                            onClick={() => setActiveTab('revenue')}
                        >
                            Doanh thu tổng hợp
                        </button>
                        <button
                            className={`dashboard-tab ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            Đơn hàng
                        </button>
                        <button
                            className={`dashboard-tab ${activeTab === 'popular-orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('popular-orders')}
                        >
                            Đơn hàng phổ biến
                        </button>
                        <button
                            className={`dashboard-tab ${activeTab === 'financial' ? 'active' : ''}`}
                            onClick={() => setActiveTab('financial')}
                        >
                            Báo cáo tài chính
                        </button>
                    </div>

                    {/* Tab Content: Doanh thu tổng hợp */}
                    {activeTab === 'revenue' && (
                        <>
                            {/* Revenue Summary Banner - Hiển thị cả khi so sánh */}
                            {overviewStats && (
                                <div className="dashboard-revenue-banner">
                                    <div className="revenue-banner-left">
                                        <div className="revenue-banner-title">Tổng doanh thu</div>
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

                            {/* Revenue Chart - Luôn hiển thị, chuyển đổi khi so sánh */}
                            {salesData && (
                                <div className="dashboard-revenue-chart-section">
                                    <div className="chart-widget revenue-chart-full">
                                        <div className="chart-widget-header">
                                            <h3 className="chart-title">Biểu đồ doanh thu tổng hợp</h3>
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
                                                salesData={salesData}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Tab Content: Đơn hàng */}
                    {activeTab === 'orders' && (
                        <div className="dashboard-orders-section">
                            <div className="chart-widget">
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
                    )}

                    {/* Tab Content: Đơn hàng phổ biến */}
                    {activeTab === 'popular-orders' && (
                        <div className="dashboard-top-orders-section">
                            <div className="chart-widget revenue-chart-full">
                                <div className="chart-widget-header">
                                    <h3 className="chart-title">Đơn hàng phổ biến</h3>
                                    <div className="chart-actions">
                                        <button title="Menu">
                                            <i className="fas fa-ellipsis-v"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="chart-widget-body">
                                    <TopOrdersChart
                                        filterBy={filterBy}
                                        selectedMonth={selectedMonth}
                                        selectedYear={selectedYear}
                                        fromDate={fromDate}
                                        toDate={toDate}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab Content: Báo cáo tài chính */}
                    {activeTab === 'financial' && (
                        <div className="dashboard-financial-section">
                            {overviewStats && (
                                <>
                                    <div className="dashboard-revenue-banner">
                                        <div className="revenue-banner-left">
                                            <div className="revenue-banner-title">Tổng doanh thu</div>
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

                                    {/* Financial Summary Cards */}
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
                                </>
                            )}
                        </div>
                    )}


                    {!overviewStats && !loading && (
                        <div className="dashboard-no-data">
                            <p>Không có dữ liệu cho khoảng thời gian đã chọn. Vui lòng chọn khoảng thời gian khác.</p>
                        </div>
                    )}

                    {/* Charts Row - Order Status & Other Charts */}


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
