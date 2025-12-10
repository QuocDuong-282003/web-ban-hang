import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { fetchMonthStats } from '../services/userService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const LoginBarChart = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchMonthStats()
            .then((res) => {
                const raw = res?.data;

                // Validate data
                if (!raw || !Array.isArray(raw) || raw.length === 0) {
                    console.warn('LoginBarChart: Không có dữ liệu hoặc dữ liệu không đúng định dạng');
                    setData(null);
                    return;
                }

                const grouped = {};

                raw.forEach((item) => {
                    if (item && item.date && item.type && typeof item.count === 'number') {
                        const day = new Date(item.date).getDate();
                        if (!grouped[day]) grouped[day] = { admin: 0, user: 0 };
                        grouped[day][item.type] += item.count;
                    }
                });

                const labels = Object.keys(grouped).map(d => `Ngày ${d}`);
                const adminData = Object.values(grouped).map(d => d.admin || 0);
                const userData = Object.values(grouped).map(d => d.user || 0);

                if (labels.length === 0) {
                    setData(null);
                    return;
                }

                setData({
                    labels,
                    datasets: [
                        {
                            label: 'Admin',
                            data: adminData,
                            backgroundColor: '#36A2EB',
                        },
                        {
                            label: 'User',
                            data: userData,
                            backgroundColor: '#FF6384',
                        }
                    ]
                });
            })
            .catch((error) => {
                console.error('LoginBarChart: Lỗi tải dữ liệu', error);
                setData(null);
            });
    }, []);

    if (!data || !data.labels || !data.datasets) {
        return <p>Đang tải biểu đồ Bar...</p>;
    }

    return (
        <div style={{ width: '100%', maxWidth: '100%' }}>
            <h4>Thống kê đăng nhập theo ngày trong tháng</h4>
            {data.labels.length > 0 && data.datasets.length > 0 ? (
                <Bar data={data} />
            ) : (
                <p>Không có dữ liệu để hiển thị.</p>
            )}
        </div>
    );
};

export default LoginBarChart;
