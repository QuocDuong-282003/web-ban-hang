import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchTodayStats } from '../services/userService';

ChartJS.register(ArcElement, Tooltip, Legend);

const LoginPieChart = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchTodayStats().then((res) => {
            const stats = res.data;
            const adminCount = stats.find(i => i.type === 'admin')?.count || 0;
            const userCount = stats.find(i => i.type === 'user')?.count || 0;

            setData({
                labels: ['Admin', 'User'],
                datasets: [
                    {
                        data: [adminCount, userCount],
                        backgroundColor: ['#36A2EB', '#FF6384'],
                        hoverBackgroundColor: ['#36A2EBaa', '#FF6384aa'],
                    },
                ],
            });
        });
    }, []);

    if (!data) return <p>Đang tải biểu đồ Pie...</p>;

    return (
        <div style={{ width: 300 }}>
            <h4>Biểu đồ đăng nhập trong ngày</h4>
            <Pie data={data} />
        </div>
    );
};

export default LoginPieChart;
