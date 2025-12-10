import React, { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    PointElement,
    LineElement,
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';
import { getSalesStats } from '../../services/dashboardService';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    PointElement,
    LineElement,
    Title, 
    Tooltip, 
    Legend
);

const SalesChart = ({ 
    filterBy, 
    selectedYear, 
    selectedMonth, 
    fromDate, 
    toDate, 
    groupBy,
    compareWithPrevious,
    fromDatePrevious,
    toDatePrevious
}) => {
    const [chartData, setChartData] = useState(null);
    const [period, setPeriod] = useState('day');
    const [isLoading, setIsLoading] = useState(true);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        const fetchChartData = async () => {
            setIsLoading(true);
            setHasData(false);
            
            try {
                // Determine period based on filterBy
                let periodToFetch = period;
                if (filterBy === 'custom') {
                    periodToFetch = groupBy || 'day';
                } else if (filterBy === 'month') {
                    periodToFetch = 'day'; // Show daily data for selected month
                } else if (filterBy === 'quarter') {
                    periodToFetch = 'quarter'; // Show quarterly data
                } else if (filterBy === 'year') {
                    periodToFetch = 'month'; // Show monthly data for year
                }

                // Build params for current period
                const currentParams = {};
                if (filterBy === 'custom' && fromDate && toDate) {
                    currentParams.fromDate = fromDate;
                    currentParams.toDate = toDate;
                } else if (filterBy === 'month' && selectedMonth && selectedYear) {
                    currentParams.month = selectedMonth;
                    currentParams.year = selectedYear;
                } else if (filterBy === 'year' && selectedYear) {
                    currentParams.year = selectedYear;
                }

                // Fetch current period data
                const currentResponse = await getSalesStats(periodToFetch, currentParams);
                const currentData = currentResponse?.data;

                // CHỈ fetch previous period data KHI compareWithPrevious = true
                let previousData = null;
                if (compareWithPrevious) {
                    // Nếu có fromDatePrevious và toDatePrevious, dùng chúng
                    if (fromDatePrevious && toDatePrevious) {
                        try {
                            const prevParams = {
                                fromDate: fromDatePrevious,
                                toDate: toDatePrevious
                            };
                            const prevResponse = await getSalesStats(periodToFetch, prevParams);
                            previousData = prevResponse?.data;
                        } catch (error) {
                            console.warn('Không thể tải dữ liệu kỳ trước:', error);
                        }
                    }
                }

                // Validate and combine data
                if (currentData && currentData.labels && Array.isArray(currentData.labels) && 
                    currentData.datasets && Array.isArray(currentData.datasets) && currentData.datasets.length > 0) {
                    
                    const datasets = [];
                    
                    // Add current period dataset (LUÔN hiển thị)
                    if (currentData.datasets[0]) {
                        datasets.push({
                            ...currentData.datasets[0],
                            label: 'Kỳ hiện tại',
                            backgroundColor: 'rgba(102, 126, 234, 0.8)',
                            borderColor: 'rgba(102, 126, 234, 1)',
                            borderWidth: 1
                        });
                    }
                    
                    // CHỈ thêm previous period dataset KHI compareWithPrevious = true VÀ có data
                    if (compareWithPrevious && previousData && previousData.datasets && previousData.datasets[0]) {
                        datasets.push({
                            ...previousData.datasets[0],
                            label: 'Kỳ trước',
                            backgroundColor: 'rgba(16, 185, 129, 0.8)',
                            borderColor: 'rgba(16, 185, 129, 1)',
                            borderWidth: 1
                        });
                    }

                    // Check if there's actual data (not all zeros)
                    const hasActualData = datasets.some(dataset => 
                        dataset.data && dataset.data.some(value => value > 0)
                    );

                    if (hasActualData && datasets.length > 0) {
                        setChartData({
                            labels: currentData.labels,
                            datasets: datasets
                        });
                        setHasData(true);
                    } else {
                        setChartData(null);
                        setHasData(false);
                    }
                } else {
                    setChartData(null);
                    setHasData(false);
                }
            } catch (error) {
                console.error(`Lỗi tải dữ liệu doanh thu:`, error);
                setChartData(null);
                setHasData(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChartData();
    }, [filterBy, selectedYear, selectedMonth, fromDate, toDate, groupBy, period, compareWithPrevious, fromDatePrevious, toDatePrevious]);

    const options = {
        // BỎ indexAxis để biểu đồ dọc (vertical bar chart)
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        },
        plugins: {
            legend: { 
                position: 'top',
                display: true
            },
            title: {
                display: true,
                text: 'Biểu đồ doanh thu tổng hợp'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.parsed.y || 0; // Với vertical bar, giá trị ở trục y
                        return `${context.dataset.label}: ${new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            notation: 'compact',
                            maximumFractionDigits: 1
                        }).format(value)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'category', // X-axis là category cho thời gian (ngang)
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Thời gian'
                },
                grid: {
                    display: false
                }
            },
            y: {
                type: 'linear', // Y-axis là linear cho doanh thu (dọc)
                position: 'left',
                beginAtZero: true,
                title: { 
                    display: true, 
                    text: 'Doanh thu (VND)' 
                },
                ticks: {
                    callback: function(value) {
                        if (value >= 1000000) {
                            return (value / 1000000).toFixed(1) + ' triệu';
                        }
                        return value.toLocaleString('vi-VN');
                    }
                },
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        }
    };

    return (
        <div className="chart-container">
            <div className="chart-filters">
                <button 
                    onClick={() => setPeriod('day')} 
                    className={period === 'day' ? 'active' : ''}
                >
                    Theo Ngày
                </button>
                <button 
                    onClick={() => setPeriod('month')} 
                    className={period === 'month' ? 'active' : ''}
                >
                    Theo Tháng
                </button>
            </div>
            <div className="chart-wrapper">
                {isLoading && <p>Đang tải biểu đồ...</p>}

                {!isLoading && hasData && chartData && chartData.labels && chartData.datasets && 
                 Array.isArray(chartData.labels) && Array.isArray(chartData.datasets) && 
                 chartData.datasets.length > 0 ? (
                    <Chart type='bar' data={chartData} options={options} />
                ) : !isLoading && (
                    <p>Không có dữ liệu để hiển thị cho khoảng thời gian đã chọn.</p>
                )}
            </div>
        </div>
    );
};

export default SalesChart;
