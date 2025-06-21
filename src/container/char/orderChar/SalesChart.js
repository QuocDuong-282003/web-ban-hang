import React, { useEffect, useState } from 'react';
// THAY ĐỔI 1: Import { Chart } thay vì { Bar }
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { getSalesStats } from '../../services/dashboardService';

// Các thành phần này đã được đăng ký đúng cho biểu đồ kết hợp
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const SalesChart = () => {
    const [chartData, setChartData] = useState(null);
    const [period, setPeriod] = useState('day');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            setIsLoading(true);
            try {
                // Thêm console.log để kiểm tra dữ liệu từ backend
                const response = await getSalesStats(period);
                console.log("Dữ liệu SalesChart từ API:", response.data);
                setChartData(response.data);
            } catch (error) {
                console.error(`Lỗi tải dữ liệu doanh thu theo ${period}:`, error);
                setChartData(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchChartData();
    }, [period]);
    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true, text: `Doanh thu & Đơn hàng theo ${period === 'day' ? 'Ngày (30 ngày gần nhất)'
                    : 'Tháng (12 tháng gần nhất)'}`
            },
        },
        scales: {
            y_revenue: {
                type: 'linear',
                position: 'left',
                title: { display: true, text: 'Doanh thu (VND)' },
                grid: { drawOnChartArea: false },
            },
            y_orders: {
                type: 'linear',
                position: 'right',
                title: { display: true, text: 'Số đơn hàng' },
            }
        }
    };

    return (
        <div className="chart-container">
            <div className="chart-filters">
                <button onClick={() => setPeriod('day')} className={period === 'day' ? 'active' : ''}>Theo Ngày</button>
                <button onClick={() => setPeriod('month')} className={period === 'month' ? 'active' : ''}>Theo Tháng</button>
            </div>
            <div className="chart-wrapper">
                {isLoading && <p>Đang tải biểu đồ...</p>}

                {/* THAY ĐỔI 2: Sử dụng component <Chart> */}
                {!isLoading && chartData && <Chart type='bar' data={chartData} options={options} />}

                {!isLoading && !chartData && <p>Không có dữ liệu để hiển thị.</p>}
            </div>
        </div>
    );
};

export default SalesChart;