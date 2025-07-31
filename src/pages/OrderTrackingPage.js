// --- THAY THẾ TOÀN BỘ FILE: frontend/src/pages/OrderTrackingPage.js ---

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../container/services/userService'; // Đường dẫn có thể cần điều chỉnh
import { toast } from 'react-toastify';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

// ======================================================================
// COMPONENT MỚI: DÒNG THỜI GIAN THEO DÕI ĐƠN HÀNG
// ======================================================================
const OrderTimeline = ({ statusHistory, currentStatus }) => {
    // Định nghĩa tất cả các mốc quan trọng của đơn hàng
    const milestones = [
        { status: 'pending', label: 'Đơn hàng đã đặt', icon: 'fa-receipt' },
        { status: 'processing', label: 'Đã xác nhận', icon: 'fa-box-open' },
        { status: 'shipped', label: 'Đã giao cho ĐVVC', icon: 'fa-truck' },
        { status: 'delivered', label: 'Giao hàng thành công', icon: 'fa-check-circle' }
    ];

    // Tạo một map để lưu thời gian của mỗi trạng thái đã xảy ra
    const historyMap = new Map();
    statusHistory.forEach(history => {
        historyMap.set(history.status, new Date(history.updatedAt));
    });

    // Tìm vị trí của trạng thái hiện tại
    const currentStatusIndex = milestones.findIndex(m => m.status === currentStatus);

    // Xử lý trường hợp đơn hàng bị hủy
    if (currentStatus === 'cancelled') {
        const cancelledTime = historyMap.get('cancelled');
        return (
            <div className="alert alert-danger my-4">
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
            <style>{`
                .order-timeline {
                    display: flex;
                    flex-direction: column;
                }
                .timeline-step {
                    display: flex;
                    align-items: flex-start;
                    position: relative;
                    padding-bottom: 30px;
                }
                .timeline-step:not(:last-child)::before {
                    content: '';
                    position: absolute;
                    left: 20px;
                    top: 40px;
                    width: 2px;
                    height: calc(100% - 20px);
                    background-color: #e9ecef;
                }
                .timeline-step.active:not(:last-child)::before {
                    background-color: #28a745;
                }
                .timeline-step__icon-wrapper {
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    background-color: #e9ecef;
                    color: #adb5bd;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    margin-right: 20px;
                    flex-shrink: 0;
                    z-index: 1;
                    transition: all 0.3s ease;
                }
                .timeline-step.active .timeline-step__icon-wrapper {
                    background-color: #28a745;
                    color: white;
                }
                .timeline-step__content {
                    padding-top: 8px;
                }
                .timeline-step__label {
                    font-size: 1rem;
                    font-weight: 500;
                    margin-bottom: 4px;
                    color: #6c757d;
                }
                .timeline-step.active .timeline-step__label {
                    font-weight: bold;
                    color: #212529;
                }
                .timeline-step__timestamp {
                    font-size: 0.85rem;
                    color: #6c757d;
                    margin-bottom: 0;
                }
            `}</style>
        </div>
    );
};


function OrderTrackingPage() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
                    {/* Cột chính hiển thị thông tin */}
                    <div className="col-lg-8">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white p-4">
                                <h3 className="mb-1">Đơn hàng #{order.orderCode}</h3>
                                <p className="text-muted mb-0">Đặt ngày: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                            </div>
                            <div className="card-body p-4">
                                <h4 className="mb-4">Hành trình đơn hàng</h4>
                                <OrderTimeline statusHistory={order.statusHistory} currentStatus={order.status} />
                            </div>
                        </div>
                    </div>

                    {/* Cột phụ hiển thị tóm tắt */}
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