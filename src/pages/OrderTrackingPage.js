import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, cancelMyOder, createReview } from '../container/services/userService';
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
            <div className=" my-4">
                <h4>Đơn hàng đã bị hủy</h4>
                {cancelledTime && <p>vào lúc {cancelledTime.toLocaleString('vi-VN')}</p>}
            </div>
        );
    }

    return (
        <div className="order-timeline">
            {milestones.map((milestone, index) => {
                const isActive = index <= currentStatusIndex;
                const timestamp = historyMap.get(milestone.status);

                return (
                    <div key={milestone.status} className={`timeline-step ${isActive ? 'active' : ''}`}>
                        <div className="timeline-step__icon-wrapper">
                            <i className={`fas ${milestone.icon}`}></i>
                        </div>
                        <div className="timeline-step__content">
                            <h5 className="timeline-step__label">{milestone.label}</h5>
                            {timestamp && (
                                <p className="timeline-step__timestamp">
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
    // cancel order
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

            }
            finally {
                setIsCancelling(false);
            }
        }
    }
    if (isLoading) {
        return <div className="d-flex justify-content-center align-items-center vh-100">Đang tải thông tin đơn hàng...</div>;
    }

    if (!order) {
        return (
            <>
                <Header />
                <div className="container text-center p-5">
                    <h4>Không tìm thấy đơn hàng</h4>
                    <p>Vui lòng kiểm tra lại đường dẫn hoặc mã đơn hàng của bạn.</p>
                    <Link to="/" className="btn btn-primary">Quay về trang chủ</Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="container my-5">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb bg-light p-2 rounded">
                        <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Theo dõi đơn hàng</li>
                    </ol>
                </nav>

                <div className="row">
                    <div className="col-lg-8">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white p-4">
                                <h3 className="mb-1">Đơn hàng #{order.orderCode}</h3>
                                <p className="text-muted mb-0">Đặt ngày: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                            </div>
                            <div className="card-body p-4">
                                <h4 className="mb-4">Hành trình đơn hàng</h4>
                                {order.status === 'pending' && (
                                    <div className="mb-4 text-end">
                                        <button
                                            onClick={handleCancelOrder}
                                            className="btn btn-danger"
                                            disabled={isCancelling} // Vô hiệu hóa nút khi đang xử lý
                                        >
                                            {isCancelling ? 'Đang xử lý...' : 'Hủy đơn hàng'}
                                        </button>
                                    </div>
                                )}
                                <OrderTimeline statusHistory={order.statusHistory} currentStatus={order.status} />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h5 className="card-title">Thông tin giao hàng</h5>
                                <p className="mb-1"><strong>{order.shippingInfo.fullName}</strong></p>
                                <p className="mb-1">{order.shippingInfo.phoneNumber}</p>
                                <p className="mb-0 text-muted">{order.shippingInfo.address}, {order.shippingInfo.city}</p>
                            </div>
                        </div>
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Tóm tắt đơn hàng</h5>
                                {order.items.map(item => (
                                    <div key={item._id} className="d-flex justify-content-between align-items-center mb-2">
                                        <span>{item.name} x{item.quantity}</span>
                                        <strong>{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</strong>
                                    </div>
                                ))}
                                <hr />
                                <p className="d-flex justify-content-between"><span>Tạm tính:</span> <span>{order.itemsPrice.toLocaleString('vi-VN')} ₫</span></p>
                                <p className="d-flex justify-content-between"><span>Phí vận chuyển:</span> <span>{order.shippingPrice.toLocaleString('vi-VN')} ₫</span></p>
                                <hr />
                                <h4 className="d-flex justify-content-between font-weight-bold"><span>Tổng cộng:</span> <span>{order.totalPrice.toLocaleString('vi-VN')} ₫</span></h4>
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
