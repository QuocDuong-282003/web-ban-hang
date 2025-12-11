import React, { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';
import { getTopOrders } from '../../services/dashboardService';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend
);

const TopOrdersChart = ({ filterBy, selectedMonth, selectedYear, fromDate, toDate }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState('value'); // 'value' or 'items'

    useEffect(() => {
        const fetchTopOrders = async () => {
            setIsLoading(true);
            try {
                // Build date range based on filter
                let from = null;
                let to = null;

                if (filterBy === 'custom' && fromDate && toDate) {
                    from = fromDate;
                    to = toDate;
                } else if (filterBy === 'month' && selectedMonth && selectedYear) {
                    // First day of selected month
                    from = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
                    // Last day of selected month
                    const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
                    to = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
                } else if (filterBy === 'year' && selectedYear) {
                    from = `${selectedYear}-01-01`;
                    to = `${selectedYear}-12-31`;
                }

                const response = await getTopOrders(10, sortBy, 'delivered', from, to);
                const ordersData = response?.data?.data || [];
                setOrders(ordersData);
            } catch (error) {
                console.error('Error fetching top orders:', error);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopOrders();
    }, [filterBy, selectedMonth, selectedYear, fromDate, toDate, sortBy]);

    // Calculate total for percentage
    const totalValue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const totalItems = orders.reduce((sum, order) => sum + (order.totalItemsQuantity || 0), 0);

    // Get order name (customer name or first product name)
    const getOrderName = (order) => {
        if (order.customer?.name) {
            return order.customer.name;
        }
        if (order.shippingInfo?.fullName) {
            return order.shippingInfo.fullName;
        }
        if (order.topItems && order.topItems.length > 0) {
            return order.topItems[0].productName || 'Đơn hàng';
        }
        return 'Đơn hàng';
    };

    // Prepare chart data
    const chartData = {
        labels: orders.map((order, index) => `#${index + 1} ${getOrderName(order)}`),
        datasets: [
            {
                label: sortBy === 'value' ? 'Doanh số (VND)' : 'Số lượng sản phẩm',
                data: orders.map(order => 
                    sortBy === 'value' ? (order.totalPrice || 0) : (order.totalItemsQuantity || 0)
                ),
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            title: {
                display: true,
                text: sortBy === 'value' ? 'Top 10 Đơn Hàng Có Giá Trị Cao Nhất' : 'Top 10 Đơn Hàng Có Nhiều Sản Phẩm Nhất'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (sortBy === 'value') {
                            return `Doanh số: ${new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(context.parsed.y)}`;
                        } else {
                            return `Số lượng: ${context.parsed.y} sản phẩm`;
                        }
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        if (sortBy === 'value') {
                            const formatted = new Intl.NumberFormat('vi-VN', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            }).format(value);
                            return formatted + ' VND';
                        }
                        return value;
                    }
                }
            }
        }
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

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return <div className="chart-loading">Đang tải dữ liệu...</div>;
    }

    if (orders.length === 0) {
        return <div className="chart-no-data">Không có dữ liệu đơn hàng.</div>;
    }

    return (
        <div className="top-orders-chart-container">
            {/* Sort Toggle */}
            <div className="chart-controls">
                <button
                    className={`sort-btn ${sortBy === 'value' ? 'active' : ''}`}
                    onClick={() => setSortBy('value')}
                >
                    Sắp xếp theo giá trị
                </button>
                <button
                    className={`sort-btn ${sortBy === 'items' ? 'active' : ''}`}
                    onClick={() => setSortBy('items')}
                >
                    Sắp xếp theo số lượng
                </button>
            </div>

            {/* Chart */}
            <div className="chart-wrapper" style={{ height: '400px', marginBottom: '20px' }}>
                <Chart type="bar" data={chartData} options={chartOptions} />
            </div>

            {/* Table */}
            <div className="top-orders-table">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên đơn hàng</th>
                            <th>Tên hàng hóa</th>
                            <th>Doanh số</th>
                            <th>Số sản phẩm</th>
                            <th>Tỉ lệ</th>
                            <th>Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => {
                            const percentage = sortBy === 'value' 
                                ? ((order.totalPrice || 0) / totalValue * 100).toFixed(2)
                                : ((order.totalItemsQuantity || 0) / totalItems * 100).toFixed(2);
                            
                            const orderName = getOrderName(order);
                            
                            // Lấy danh sách tên sản phẩm
                            const productNames = order.topItems && order.topItems.length > 0
                                ? order.topItems.map(item => item.productName).filter(Boolean)
                                : [];
                            
                            // Nếu có nhiều sản phẩm, hiển thị "và X sản phẩm khác"
                            const displayProducts = productNames.length > 0
                                ? productNames.slice(0, 2).join(', ') + (productNames.length > 2 ? ` và ${productNames.length - 2} sản phẩm khác` : '')
                                : '—';
                            
                            return (
                                <tr key={order.orderId || index}>
                                    <td>{index + 1}</td>
                                    <td style={{ fontWeight: 500, color: '#111827' }}>{orderName}</td>
                                    <td style={{ color: '#374151', fontSize: '14px', maxWidth: '300px' }}>
                                        <div style={{ 
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {displayProducts}
                                        </div>
                                    </td>
                                    <td>{formatCurrency(order.totalPrice)}</td>
                                    <td>{order.totalItemsQuantity || 0} sản phẩm</td>
                                    <td>
                                        <div className="percentage-cell">
                                            <span className="percentage-value">{percentage}%</span>
                                            <div className="percentage-bar">
                                                <div 
                                                    className="percentage-fill" 
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{formatDate(order.createdAt)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopOrdersChart;

