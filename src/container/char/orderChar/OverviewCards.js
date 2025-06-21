import React, { useState, useEffect } from 'react';
import { getOverviewStats } from '../../services/dashboardService';
import './OverviewCards.css'
const StatCard = ({ title, value, className = '' }) => (
    <div className={`stat-card ${className}`}>
        <h3>{title}</h3>
        <p className='price-number'>{value}</p>
    </div>
);

const OverviewCards = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        getOverviewStats()
            .then(response => setStats(response.data))
            .catch(error => console.error("Lỗi tải thống kê tổng quan:", error));
    }, []);

    if (!stats) return <p>Đang tải thống kê đơn hàng...</p>;

    return (
        <div className="overview-grid">
            <StatCard
                title="Tổng Doanh thu"
                value={
                    typeof stats.totalRevenue === 'number'
                        ? new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(stats.totalRevenue)
                        : 'N/A'
                }
                className="revenue"
            />


            <StatCard title="Tổng Đơn hàng" value={stats.totalOrders} />
            <StatCard title="Đơn đã hủy" value={stats.totalCancelledOrders} className="cancelled" />
        </div>
    );
};

export default OverviewCards;