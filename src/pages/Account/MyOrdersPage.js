
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyOrders } from '../../container/services/userService';
import { toast } from 'react-toastify';

// Component con để hiển thị một đơn hàng trong danh sách
const OrderRow = ({ order }) => {
    const navigate = useNavigate();
    const statusLabels = {
        pending: { text: 'Chờ xác nhận', class: 'secondary' },
        processing: { text: 'Đang xử lý', class: 'info' },
        shipped: { text: 'Đang vận chuyển', class: 'primary' },
        delivered: { text: 'Đã giao hàng', class: 'success' },
        cancelled: { text: 'Đã hủy', class: 'danger' },
        default: { text: 'Không xác định', class: 'dark' },
    };
    const statusInfo = statusLabels[order.status] || statusLabels.default;

    return (
        <div className="card mb-3 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center bg-light flex-wrap">
                <div>
                    <strong className="mr-3">Mã đơn hàng: #{order.orderCode}</strong>
                    <small className="text-muted">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</small>
                </div>
                <span className={`badge badge-pill badge-${statusInfo.class} p-2 mt-2 mt-md-0`}>{statusInfo.text}</span>
            </div>
            <div className="card-body py-2 px-3">
                {order.items.slice(0, 2).map(item => ( // Chỉ hiển thị tối đa 2 sản phẩm đầu
                    <div key={item._id} className="d-flex align-items-center mb-2">
                        <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} className="rounded" />
                        <div className="flex-grow-1">
                            <p className="mb-0 small">{item.name}</p>
                            <small className="text-muted">Số lượng: {item.quantity}</small>
                        </div>
                    </div>
                ))}
                {order.items.length > 2 && <small className="text-muted">và {order.items.length - 2} sản phẩm khác...</small>}
            </div>
            <div className="card-footer d-flex justify-content-between align-items-center">
                <span>Tổng tiền: <strong className="text-danger">{order.totalPrice.toLocaleString('vi-VN')} ₫</strong></span>
                {/* Nút này sẽ điều hướng đến trang theo dõi chi tiết */}
                <button onClick={() => navigate(`/order-tracking/${order._id}`)} className="btn btn-primary btn-sm">Xem chi tiết</button>
            </div>
        </div>
    );
};


function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = "Đơn hàng của tôi";
        const fetchMyOrders = async () => {
            setIsLoading(true);
            try {
                const res = await getMyOrders();
                setOrders(res.data.orders);
            } catch (error) {
                toast.error(error.response?.data?.message || "Không thể tải danh sách đơn hàng.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyOrders();
    }, []);

    if (isLoading) {
        return <div className="text-center p-5">Đang tải...</div>;
    }

    return (
        // Component này giờ chỉ trả về phần nội dung, không có Header, Footer
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Đơn hàng của tôi</h2>
                {/* Có thể thêm bộ lọc ở đây sau */}
            </div>

            {orders.length > 0 ? (
                orders.map(order => <OrderRow key={order._id} order={order} />)
            ) : (
                <div className="text-center p-5 border rounded bg-light">
                    <p>Bạn chưa có đơn hàng nào.</p>
                    <Link to="/products" className="btn btn-primary">Bắt đầu mua sắm</Link>
                </div>
            )}
        </div>
    );
}

export default MyOrdersPage;