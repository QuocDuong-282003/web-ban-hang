import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';
import { toast } from 'react-toastify';
import { createOrder, getUserInfo } from '../container/services/userService';
import { createVnpayPaymentUrl, createMomoAioPaymentUrl } from '../container/services/payService';
import './PayPage.scss';

function PayPage() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '', phoneNumber: '', address: '', city: 'Hà Nội', notes: '' });
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [errors, setErrors] = useState({});
    const [orderSummary, setOrderSummary] = useState({ items: [], cartTotal: 0, shippingFee: 0, total: 0 });
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const checkoutItemsJSON = sessionStorage.getItem('checkout_items');
                if (!checkoutItemsJSON || checkoutItemsJSON === '[]') {
                    toast.error("Không có sản phẩm để thanh toán. Quay về giỏ hàng.");
                    navigate('/cart');
                    return;
                }
                const itemsToProcess = JSON.parse(checkoutItemsJSON);
                const cartTotal = itemsToProcess.reduce((total, item) => total + (item.itemTotal || 0), 0);
                const shippingFee = 30000;
                const total = cartTotal + shippingFee;
                setOrderSummary({ items: itemsToProcess, cartTotal, shippingFee, total });

                const profileRes = await getUserInfo();
                if (profileRes.data && profileRes.data.user) {
                    setFormData(prev => ({
                        ...prev,
                        fullName: profileRes.data.user.name || '',
                        email: profileRes.data.user.email || '',
                        phoneNumber: profileRes.data.user.phoneNumber || '',
                        address: profileRes.data.user.address || ''
                    }));
                }
            } catch (error) {
                console.error("Lỗi nghiêm trọng trong PayPage:", error);
                toast.error("Có lỗi xảy ra khi xử lý thanh toán.");
                navigate('/cart');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, [navigate]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên.";
        if (!formData.email.trim()) {
            newErrors.email = "Vui lòng nhập email.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = "Địa chỉ email không hợp lệ.";
        }
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Vui lòng nhập số điện thoại.";
        } else if (!/^(0\d{9})$/.test(formData.phoneNumber.trim())) {
            newErrors.phoneNumber = "Số điện thoại không hợp lệ.";
        }
        if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ giao hàng.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || isPlacingOrder) {
            if (Object.keys(errors).length > 0 || !validateForm()) {
                toast.warn("Vui lòng kiểm tra lại các thông tin bắt buộc.");
            }
            return;
        }
        setIsPlacingOrder(true);

        const orderData = {
            shippingInfo: { ...formData },
            items: orderSummary.items,
            paymentMethod: paymentMethod,
            notes: formData.notes
        };

        if (paymentMethod === 'COD') {
            try {
                const res = await createOrder(orderData);
                sessionStorage.removeItem('checkout_items');
                toast.success("Đặt hàng thành công!");
                navigate(`/order-success?orderCode=${res.data.order.orderCode}&orderId=${res.data.order._id}`);
            } catch (error) {
                toast.error(error.response?.data?.message || "Đặt hàng thất bại.");
                setIsPlacingOrder(false);
            }
        } else if (paymentMethod === 'VNPAY') {
            const paymentData = {
                amount: orderSummary.total,
                orderDescription: `P&T Shop - Thanh toan don hang`,
                language: 'vn',
            };
            try {
                const response = await createVnpayPaymentUrl(paymentData);
                const data = response.data;
                if (data.code === '00' && data.url) {
                    sessionStorage.removeItem('checkout_items');
                    window.location.href = data.url;
                } else {
                    toast.error(data.message || "Lỗi: Không thể tạo yêu cầu thanh toán.");
                    setIsPlacingOrder(false);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Không thể kết nối đến máy chủ thanh toán.");
                setIsPlacingOrder(false);
            }
        } else if (paymentMethod === 'MOMO_AIO') {
            const paymentData = {
                amount: orderSummary.total,
                orderInfo: `P&T Shop - Thanh toan don hang`,
            };
            try {
                const response = await createMomoAioPaymentUrl(paymentData);
                const data = response.data;
                if (data && data.payUrl) {
                    sessionStorage.removeItem('checkout_items');
                    window.location.href = data.payUrl;
                } else {
                    toast.error(data.message || "Lỗi: Không thể tạo yêu cầu thanh toán MoMo.");
                    setIsPlacingOrder(false);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Không thể kết nối đến máy chủ thanh toán.");
                setIsPlacingOrder(false);
            }
        }
    };

    const renderSummaryItems = () => {
        if (!orderSummary.items || orderSummary.items.length === 0) return null;
        return orderSummary.items.map((item, index) => {
            const total = item.itemTotal || 0;
            return (
                <div key={item.cartItemId || `summary-item-${index}`} className="pay-page-summary-item">
                    <div className="pay-page-item-image">
                        <img src={item.image} alt={item.name} />
                        <span className="pay-page-item-quantity">{item.quantity}</span>
                    </div>
                    <div className="pay-page-item-info">
                        <h5>{item.name}</h5>
                        {item.option && <small>{item.option}</small>}
                    </div>
                    <div className="pay-page-item-price">
                        {total.toLocaleString('vi-VN')}₫
                    </div>
                </div>
            );
        });
    };

    if (isLoading) {
        return (
            <div>
                <Header />
                <div className="pay-page-loading">
                    <h3>Đang tải dữ liệu...</h3>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="pay-page-wrapper">
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={toggleMobileMenu}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />
            <div className="pay-page-container">
                <div className="container">
                    <div className="pay-page-content">
                        <form onSubmit={handleSubmit}>
                            <div className="pay-page-row">
                                {/* Left Panel - Shipping Form */}
                                <div className="pay-page-form-section">

                                    <div className="pay-page-section-title">
                                        Thông tin giao hàng
                                    </div>

                                    <div className="pay-page-form-group">
                                        <label htmlFor="fullName">Họ và tên</label>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Bắt buộc nhập"
                                        />
                                        {errors.fullName && <span className="pay-page-error-message">{errors.fullName}</span>}
                                    </div>

                                    <div className="pay-page-form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Để nhận xác nhận đơn hàng"
                                        />
                                        {errors.email && <span className="pay-page-error-message">{errors.email}</span>}
                                    </div>

                                    <div className="pay-page-form-group">
                                        <label htmlFor="phoneNumber">Số điện thoại</label>
                                        <input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="tel"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="Bắt buộc nhập"
                                        />
                                        {errors.phoneNumber && <span className="pay-page-error-message">{errors.phoneNumber}</span>}
                                    </div>

                                    <div className="pay-page-form-group">
                                        <label htmlFor="address">Địa chỉ</label>
                                        <input
                                            id="address"
                                            name="address"
                                            type="text"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Bắt buộc nhập"
                                        />
                                        {errors.address && <span className="pay-page-error-message">{errors.address}</span>}
                                    </div>

                                    <div className="pay-page-form-group">
                                        <label htmlFor="notes">Ghi chú (tùy chọn)</label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            placeholder="Ghi chú cho người bán..."
                                        />
                                    </div>

                                    <div className="pay-page-payment-section">
                                        <div className="pay-page-section-title">
                                            Phương thức thanh toán
                                        </div>

                                        <div className="pay-page-payment-methods">
                                            <div className="pay-page-payment-item">
                                                <input
                                                    type="radio"
                                                    id="payment-cod"
                                                    name="paymentMethod"
                                                    value="COD"
                                                    checked={paymentMethod === 'COD'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                />
                                                <label htmlFor="payment-cod">Thanh toán khi nhận hàng (COD)</label>
                                            </div>

                                            <div className="pay-page-payment-item">
                                                <input
                                                    type="radio"
                                                    id="payment-vnpay"
                                                    name="paymentMethod"
                                                    value="VNPAY"
                                                    checked={paymentMethod === 'VNPAY'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                />
                                                <label htmlFor="payment-vnpay">Thanh toán qua Cổng VNPay</label>
                                            </div>

                                            <div className="pay-page-payment-item">
                                                <input
                                                    type="radio"
                                                    id="payment-momo-aio"
                                                    name="paymentMethod"
                                                    value="MOMO_AIO"
                                                    checked={paymentMethod === 'MOMO_AIO'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                />
                                                <label htmlFor="payment-momo-aio">Thanh toán MoMo (Thẻ/QR/Ví)</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pay-page-footer">
                                        <Link to="/cart" className="pay-page-back-link">
                                            <i className="fi-rs-angle-left"></i>
                                            Giỏ hàng
                                        </Link>
                                        <button
                                            type="submit"
                                            className="pay-page-submit-btn"
                                            disabled={isPlacingOrder}
                                        >
                                            {isPlacingOrder ? 'Đang xử lý...' : 'Đặt hàng'}
                                        </button>
                                    </div>
                                </div>

                                {/* Right Panel - Order Summary */}
                                <div className="pay-page-summary-section">
                                    <div className="pay-page-summary-header">
                                        <h2>Thông tin đơn hàng</h2>
                                    </div>

                                    <div className="pay-page-summary-items">
                                        {renderSummaryItems()}
                                    </div>

                                    <div className="pay-page-summary-totals">
                                        <div className="pay-page-summary-row">
                                            <span>Tạm tính:</span>
                                            <span>{orderSummary.cartTotal.toLocaleString('vi-VN')}₫</span>
                                        </div>
                                        <div className="pay-page-summary-row">
                                            <span>Phí vận chuyển:</span>
                                            <span>{orderSummary.shippingFee.toLocaleString('vi-VN')}₫</span>
                                        </div>
                                        <div className="pay-page-summary-total">
                                            <span>Tổng cộng:</span>
                                            <span>{orderSummary.total.toLocaleString('vi-VN')}₫</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
            <GoToTop />
        </div>
    );
}

export default PayPage;
