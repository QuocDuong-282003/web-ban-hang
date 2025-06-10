import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { fetchMonthStats } from '../services/userService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const LoginBarChart = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchMonthStats().then((res) => {
            const raw = res.data;

            const grouped = {};

            raw.forEach((item) => {
                const day = new Date(item.date).getDate();
                if (!grouped[day]) grouped[day] = { admin: 0, user: 0 };
                grouped[day][item.type] += item.count;
            });

            const labels = Object.keys(grouped).map(d => `Ngày ${d}`);
            const adminData = Object.values(grouped).map(d => d.admin);
            const userData = Object.values(grouped).map(d => d.user);

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
        });
    }, []);

    if (!data) return <p>Đang tải biểu đồ Bar...</p>;

    return (
        <div style={{ width: '100%', maxWidth: 500 }}>
            <h4>Thống kê đăng nhập theo ngày trong tháng</h4>
            <Bar data={data} />
        </div>
    );
};

export default LoginBarChart;
