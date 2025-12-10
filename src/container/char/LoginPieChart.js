import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchTodayStats } from '../services/userService';

ChartJS.register(ArcElement, Tooltip, Legend);

const LoginPieChart = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchTodayStats()
            .then((res) => {
                const stats = res?.data;

                // Validate data
                if (!stats || !Array.isArray(stats)) {
                    console.warn('LoginPieChart: Không có dữ liệu hoặc dữ liệu không đúng định dạng');
                    setData(null);
                    return;
                }

                const adminCount = stats.find(i => i && i.type === 'admin')?.count || 0;
                const userCount = stats.find(i => i && i.type === 'user')?.count || 0;

                if (adminCount === 0 && userCount === 0) {
                    setData(null);
                    return;
                }

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
            })
            .catch((error) => {
                console.error('LoginPieChart: Lỗi tải dữ liệu', error);
                setData(null);
            });
    }, []);

    if (!data || !data.labels || !data.datasets) {
        return <p>Đang tải biểu đồ Pie...</p>;
    }

    return (
        <div style={{ width: '100%', maxWidth: '100%' }}>
            <h4>Biểu đồ đăng nhập trong ngày</h4>
            {data.labels.length > 0 && data.datasets.length > 0 && 
             Array.isArray(data.datasets[0]?.data) && 
             data.datasets[0].data.length > 0 ? (
                <Pie data={data} />
            ) : (
                <p>Không có dữ liệu để hiển thị.</p>
            )}
        </div>
    );
};

export default LoginPieChart;
