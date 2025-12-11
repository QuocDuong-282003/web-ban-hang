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
    toDatePrevious,
    salesData // Data from new API
}) => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setHasData(false);
        
        try {
            // Use data from new API if available
            if (salesData && salesData.currentPeriod) {
                const currentPeriod = salesData.currentPeriod;
                const previousPeriod = salesData.previousPeriod;
                
                // Check if we have valid data
                if (currentPeriod.labels && Array.isArray(currentPeriod.labels) && 
                    currentPeriod.datasets && Array.isArray(currentPeriod.datasets) && 
                    currentPeriod.datasets.length > 0) {
                    
                    const datasets = [];
                    
                    // Process chartData to filter out points with no data
                    // Khi so sánh: hiển thị tất cả labels từ cả 2 kỳ, map theo ngày trong tháng
                    let validDataPoints = [];
                    let filteredLabels = [];
                    
                    if (compareWithPrevious && previousPeriod && previousPeriod.chartData && previousPeriod.chartData.length > 0) {
                        // So sánh: API đã align data theo index, chỉ cần map theo index
                        const chartDataWithValues = currentPeriod.chartData || [];
                        const prevChartDataWithValues = previousPeriod.chartData || [];
                        const currentLabels = currentPeriod.labels || [];
                        const prevLabels = previousPeriod.labels || [];
                        
                        // Lấy max length để cover cả 2 kỳ
                        const maxLength = Math.max(chartDataWithValues.length, prevChartDataWithValues.length, currentLabels.length, prevLabels.length);
                        
                        for (let i = 0; i < maxLength; i++) {
                            const currentItem = chartDataWithValues[i];
                            const prevItem = prevChartDataWithValues[i];
                            
                            const currentHasData = currentItem && (
                                (currentItem.revenue && currentItem.revenue > 0) || 
                                (currentItem.orders && currentItem.orders > 0)
                            );
                            
                            const prevHasData = prevItem && (
                                (prevItem.revenue && prevItem.revenue > 0) || 
                                (prevItem.orders && prevItem.orders > 0)
                            );
                            
                            // Include if either period has data
                            if (currentHasData || prevHasData) {
                                // Use current label if available, otherwise use previous label
                                const label = currentLabels[i] || prevLabels[i] || (currentItem?.label || currentItem?.date) || (prevItem?.label || prevItem?.date) || `Day ${i + 1}`;
                                
                                validDataPoints.push({
                                    currentIndex: i < chartDataWithValues.length ? i : -1,
                                    previousIndex: i < prevChartDataWithValues.length ? i : -1,
                                    label: label
                                });
                            }
                        }
                        
                        filteredLabels = validDataPoints.map(dp => dp.label).filter(Boolean);
                    } else {
                        // Không so sánh: Chỉ lọc current period
                        const chartDataWithValues = currentPeriod.chartData || [];
                        chartDataWithValues.forEach((currentItem, currentIdx) => {
                            const currentHasData = currentItem && (
                                (currentItem.revenue && currentItem.revenue > 0) || 
                                (currentItem.orders && currentItem.orders > 0)
                            );
                            
                            if (currentHasData) {
                                validDataPoints.push({
                                    currentIndex: currentIdx,
                                    previousIndex: -1,
                                    label: currentPeriod.labels[currentIdx]
                                });
                            }
                        });
                        
                        filteredLabels = validDataPoints.map(dp => dp.label).filter(Boolean);
                    }
                    
                    // Khi so sánh: hiển thị bar chart cho cả 2 kỳ
                    // Khi không so sánh: hiển thị line + bar như cũ
                    if (compareWithPrevious && previousPeriod) {
                        // So sánh: Bar chart cho cả 2 kỳ (chỉ doanh thu)
                        // Current period - Bar màu xanh dương
                        const currentRevenueDataset = currentPeriod.datasets.find(d => d.yAxisID === 'y_revenue') || currentPeriod.datasets[0];
                        if (currentRevenueDataset) {
                            const filteredData = validDataPoints.map(dp => {
                                if (dp.currentIndex >= 0 && dp.currentIndex < currentRevenueDataset.data.length) {
                                    return currentRevenueDataset.data[dp.currentIndex] || 0;
                                }
                                return 0;
                            });
                            datasets.push({
                                type: 'bar',
                                label: 'Kỳ hiện tại',
                                data: filteredData,
                                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                                borderColor: 'rgb(75, 192, 192)',
                                borderWidth: 1,
                                yAxisID: 'y_revenue'
                            });
                        }
                        
                        // Previous period - Bar màu xanh lá
                        const prevRevenueDataset = previousPeriod.datasets.find(d => d.yAxisID === 'y_revenue') || previousPeriod.datasets[0];
                        if (prevRevenueDataset) {
                            const filteredData = validDataPoints.map(dp => {
                                if (dp.previousIndex >= 0 && dp.previousIndex < prevRevenueDataset.data.length) {
                                    return prevRevenueDataset.data[dp.previousIndex] || 0;
                                }
                                return 0;
                            });
                            datasets.push({
                                type: 'bar',
                                label: 'Kỳ trước',
                                data: filteredData,
                                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                                borderColor: 'rgb(34, 197, 94)',
                                borderWidth: 1,
                                yAxisID: 'y_revenue'
                            });
                        }
                    } else {
                        // Không so sánh: Giữ nguyên line + bar như cũ
                        currentPeriod.datasets.forEach((dataset, index) => {
                            // Filter data to only include valid data points
                            const filteredData = validDataPoints.map(dp => {
                                if (dp.currentIndex >= 0 && dp.currentIndex < dataset.data.length) {
                                    return dataset.data[dp.currentIndex] || 0;
                                }
                                return 0;
                            });
                            
                            datasets.push({
                                ...dataset,
                                data: filteredData,
                                // Keep original colors from API or use defaults
                                borderColor: dataset.borderColor || (index === 0 ? 'rgb(75, 192, 192)' : 'rgba(255, 159, 64, 0.7)'),
                                backgroundColor: dataset.backgroundColor || (index === 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 159, 64, 0.7)')
                            });
                        });
                    }

                    // Check if there's actual data (not all zeros)
                    const hasActualData = datasets.some(dataset => 
                        dataset.data && Array.isArray(dataset.data) && dataset.data.some(value => value > 0)
                    );

                    if (hasActualData && datasets.length > 0 && filteredLabels.length > 0) {
                        setChartData({
                            labels: filteredLabels,
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
            } else {
                setChartData(null);
                setHasData(false);
            }
        } catch (error) {
            console.error(`Lỗi xử lý dữ liệu biểu đồ:`, error);
            setChartData(null);
            setHasData(false);
        } finally {
            setIsLoading(false);
        }
    }, [salesData, compareWithPrevious]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
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
                text: salesData?.currentPeriod?.label || 'Biểu đồ doanh thu & đơn hàng'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            // Check if this is revenue (yAxisID === 'y_revenue') or orders
                            if (context.dataset.yAxisID === 'y_revenue') {
                                label += new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(context.parsed.y);
                            } else {
                                label += context.parsed.y + ' đơn';
                            }
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'category',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Thời gian'
                },
                grid: {
                    display: false
                }
            },
            y_revenue: {
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Doanh thu (VND)'
                },
                ticks: {
                    callback: function(value) {
                        return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
                    }
                },
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            y_orders: {
                type: 'linear',
                display: true,
                position: 'right',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Số đơn hàng'
                },
                grid: {
                    drawOnChartArea: false // Don't draw grid for right axis
                }
            }
        }
    };

    return (
        <div className="chart-container">
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
