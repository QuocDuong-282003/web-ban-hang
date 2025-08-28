
import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

import { getOverviewStats, getSalesStats, getOrderStatusStats } from '../services/dashboardService';

// Component con để hiển thị các thẻ thống kê
const StatCard = ({ title, value, className = '' }) => (
    <div className={`stat-card ${className}`}>
        <h3>{title}</h3>
        <p>{value}</p>
    </div>
);

const DashboardPage = () => {
    const [overview, setOverview] = useState(null);
    const [salesData, setSalesData] = useState(null);
    const [statusData, setStatusData] = useState(null);
    const [salesPeriod, setSalesPeriod] = useState('day');

    // Hook để tải dữ liệu tổng quan và biểu đồ tròn (chỉ chạy 1 lần)
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [overviewRes, statusRes] = await Promise.all([
                    getOverviewStats(),
                    getOrderStatusStats()
                ]);
                setOverview(overviewRes.data);
                setStatusData(statusRes.data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu dashboard:", error);
            }
        };
        fetchInitialData();
    }, []);

    // Hook để tải dữ liệu cho biểu đồ doanh thu (chạy lại khi người dùng đổi chế độ xem)
    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const salesRes = await getSalesStats(salesPeriod);
                setSalesData(salesRes.data);
            } catch (error) {
                console.error(`Lỗi khi tải dữ liệu doanh thu:`, error);
            }
        };
        fetchSalesData();
    }, [salesPeriod]);

    // Tùy chọn cho biểu đồ cột
    const salesChartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `Thống kê theo ${salesPeriod === 'day' ? 'Ngày (30 ngày gần nhất)' : 'Tháng'}` },
        },
    };

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>

            {overview ? (
                <div className="overview-grid">
                    <StatCard
                        title="Tổng Doanh thu"
                        value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(overview.totalRevenue)}
                        className="revenue"
                    />
                    <StatCard title="Tổng Đơn hàng" value={overview.totalOrders} />
                    <StatCard title="Đơn đã hủy" value={overview.totalCancelledOrders} className="cancelled" />
                    <StatCard title="Khách hàng" value={overview.totalUsers} />
                </div>
            ) : <p>Đang tải thống kê...</p>}

            <div className="charts-grid">
                <div className="chart-section main-chart">
                    <div className="chart-header">
                        <h2>Doanh thu & Đơn hàng</h2>
                        <div className="view-options">
                            <button onClick={() => setSalesPeriod('day')} className={salesPeriod === 'day' ? 'active' : ''}>Theo Ngày</button>
                            <button onClick={() => setSalesPeriod('month')} className={salesPeriod === 'month' ? 'active' : ''}>Theo Tháng</button>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        {salesData ? <Bar data={salesData} options={salesChartOptions} /> : <p>Đang tải biểu đồ...</p>}
                    </div>
                </div>

                <div className="chart-section side-chart">
                    <h2>Tình hình Đơn hàng</h2>
                    <div className="chart-wrapper pie-chart">
                        {statusData ? <Pie data={statusData} /> : <p>Đang tải biểu đồ...</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;