import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, cancelMyOder } from '../container/services/userService';
import { toast } from 'react-toastify';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import './OrderTrackingPage.scss';

const OrderTimeline = ({ statusHistory, currentStatus }) => {
    const milestones = [
        { status: 'pending', label: 'Đơn hàng đã đặt', icon: 'fa-receipt' },
        { status: 'processing', label: 'Đã xác nhận', icon: 'fa-box-open' },
        { status: 'shipped', label: 'Đã giao cho ĐVVC', icon: 'fa-truck' },
        { status: 'delivered', label: 'Giao hàng thành công', icon: 'fa-check-circle' }
    ];

    const historyMap = new Map();
    statusHistory.forEach(history => {
        historyMap.set(history.status, new Date(history.updatedAt));
    });

    const currentStatusIndex = milestones.findIndex(m => m.status === currentStatus);

    if (currentStatus === 'cancelled') {
        const cancelledTime = historyMap.get('cancelled');
        return (
            <div className="order-tracking-cancelled">
                <h4>Đơn hàng đã bị hủy</h4>
                {cancelledTime && <p>vào lúc {cancelledTime.toLocaleString('vi-VN')}</p>}
            </div>
        );
    }

    return (
        <div className="order-tracking-timeline">
            {milestones.map((milestone, index) => {
                const isActive = index <= currentStatusIndex;
                const timestamp = historyMap.get(milestone.status);

                return (
                    <div key={milestone.status} className={`order-tracking-timeline-step ${isActive ? 'active' : ''}`}>
                        <div className="order-tracking-timeline-step__icon-wrapper">
                            <i className={`fas ${milestone.icon}`}></i>
                        </div>
                        <div className="order-tracking-timeline-step__content">
                            <h5 className="order-tracking-timeline-step__label">{milestone.label}</h5>
                            {timestamp && (
                                <p className="order-tracking-timeline-step__timestamp">
                                    {timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {timestamp.toLocaleDateString('vi-VN')}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

function OrderTrackingPage() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        if (!orderId) {
            toast.error("ID đơn hàng không hợp lệ.");
            setIsLoading(false);
            return;
        }
        const fetchOrderDetails = async () => {
            setIsLoading(true);
            try {
                const res = await getOrderById(orderId);
                setOrder(res.data.order);
            } catch (error) {
                toast.error(error.response?.data?.message || "Không thể tải thông tin đơn hàng.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    const handleCancelOrder = async () => {
        const confirmCancel = window.confirm(
            'Bạn có chắc muốn hủy đơn hàng này không !'
        );
        if (confirmCancel) {
            setIsCancelling(true);
            try {
                const res = await cancelMyOder(orderId);
                setOrder(res.data.order);
                toast.success('Đã hủy đơn hàng thành công !');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Hủy đơn hàng thất bại !');
            } finally {
                setIsCancelling(false);
            }
        }
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="order-tracking-loading">
                    <h3>Đang tải thông tin đơn hàng...</h3>
                </div>
                <Footer />
            </>
        );
    }

    if (!order) {
        return (
            <>
                <Header />
                <div className="order-tracking-container">
                    <div className="order-tracking-content">
                        <div className="order-tracking-not-found">
                            <h4>Không tìm thấy đơn hàng</h4>
                            <p>Vui lòng kiểm tra lại đường dẫn hoặc mã đơn hàng của bạn.</p>
                            <Link to="/" className="order-tracking-home-btn">Quay về trang chủ</Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="order-tracking-container">
                <div className="order-tracking-content">
                    <nav className="order-tracking-breadcrumb">
                        <ol>
                            <li><Link to="/">Trang chủ</Link></li>
                            <li className="active">Theo dõi đơn hàng</li>
                        </ol>
                    </nav>

                    <div className="order-tracking-row">
                        {/* Main Content - Order Timeline */}
                        <div className="order-tracking-card">
                            <div className="order-tracking-card-header">
                                <h3>Đơn hàng #{order.orderCode}</h3>
                                <p>Đặt ngày: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                            </div>
                            <div className="order-tracking-card-body">
                                <h4 className="order-tracking-title">Hành trình đơn hàng</h4>
                                {order.status === 'pending' && (
                                    <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                                        <button
                                            onClick={handleCancelOrder}
                                            className="order-tracking-cancel-btn"
                                            disabled={isCancelling}
                                        >
                                            {isCancelling ? 'Đang xử lý...' : 'Hủy đơn hàng'}
                                        </button>
                                    </div>
                                )}
                                <OrderTimeline statusHistory={order.statusHistory} currentStatus={order.status} />
                            </div>
                        </div>

                        {/* Sidebar - Order Info */}
                        <div className="order-tracking-sidebar">
                            <div className="order-tracking-info-card">
                                <div className="order-tracking-info-card-body">
                                    <h5 className="order-tracking-info-title">Thông tin giao hàng</h5>
                                    <div className="order-tracking-info-item">
                                        <strong>{order.shippingInfo.fullName}</strong>
                                    </div>
                                    <div className="order-tracking-info-item">
                                        {order.shippingInfo.phoneNumber}
                                    </div>
                                    <div className="order-tracking-info-item">
                                        {order.shippingInfo.address}, {order.shippingInfo.city}
                                    </div>
                                </div>
                            </div>

                            <div className="order-tracking-info-card">
                                <div className="order-tracking-info-card-body">
                                    <h5 className="order-tracking-info-title">Tóm tắt đơn hàng</h5>
                                    {order.items.map(item => (
                                        <div key={item._id} className="order-tracking-summary-item">
                                            <span>{item.name} x{item.quantity}</span>
                                            <strong>{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</strong>
                                        </div>
                                    ))}
                                    <hr className="order-tracking-summary-divider" />
                                    <div className="order-tracking-summary-item">
                                        <span>Tạm tính:</span>
                                        <span>{order.itemsPrice.toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                    <div className="order-tracking-summary-item">
                                        <span>Phí vận chuyển:</span>
                                        <span>{order.shippingPrice.toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                    <div className="order-tracking-summary-total">
                                        <span>Tổng cộng:</span>
                                        <span>{order.totalPrice.toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default OrderTrackingPage;
