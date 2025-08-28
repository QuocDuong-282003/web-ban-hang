// --- THAY THẾ TOÀN BỘ FILE: src/pages/PayPage.js ---

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';
import { toast } from 'react-toastify';
import { createOrder, getUserInfo } from '../container/services/userService';
// --- ĐÃ CẬP NHẬT ---: Import hàm createMomoAioPaymentUrl
import { createVnpayPaymentUrl, createMomoAioPaymentUrl } from '../container/services/payService';

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
        }
        // --- ĐÃ CẬP NHẬT ---: Thêm nhánh xử lý cho MoMo AIO
        else if (paymentMethod === 'MOMO_AIO') {
            const paymentData = {
                amount: orderSummary.total,
                orderInfo: `P&T Shop - Thanh toan don hang`,
            };
            try {
                // Gọi đến hàm service cho MoMo AIO
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
        if (!orderSummary.items) return null;
        return orderSummary.items.map((item, index) => {
            const total = item.itemTotal || 0;
            return (
                <div className="row row-sliderbar" key={item.cartItemId || `summary-item-${index}`} style={{ alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                    <div className="col-3 col-md-2 position-relative">
                        <img src={item.image} alt={item.name} width="80%" style={{ border: '1px solid #ddd', borderRadius: '4px', objectFit: 'cover', aspectRatio: '1 / 1' }} />
                        <span className="notice" style={{ top: '-5px', right: '10px' }}>{item.quantity}</span>
                    </div>
                    <div className="col-7 col-md-7">
                        <h5 style={{ fontSize: '0.9rem', margin: 0 }}>{item.name}</h5>
                        {item.option && <small className="text-muted">{item.option}</small>}
                    </div>
                    <div className="col-2 col-md-3 text-right" style={{ fontSize: '0.9rem' }}>
                        <span>{total.toLocaleString('vi-VN')}₫</span>
                    </div>
                </div>
            );
        });
    }

    if (isLoading) {
        return <div className="text-center p-5 vh-100 d-flex align-items-center justify-content-center"><h3>Đang tải dữ liệu...</h3></div>;
    }

    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={toggleMobileMenu}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />
            <div className="content">
                <div className="wrap">
                    <div className="container">
                        <form onSubmit={handleSubmit} id="form-pay">
                            <div className="row">
                                <div className="col-lg-7 col-12">
                                    <div className="main">
                                        <div className="main-header"><Link to="/"><h1>P&T SHOP</h1></Link></div>
                                        <div className="main-content">
                                            <div className="main-title"><h2>Thông tin giao hàng</h2></div>
                                            <div className="fieldset">
                                                {/* Các ô input thông tin giao hàng giữ nguyên */}
                                                <div className="fieldset-fullname form-group"><label htmlFor="fullName" className="form-label">Họ và tên</label><input id="fullName" name="fullName" type="text" className="form-control" value={formData.fullName} onChange={handleChange} placeholder="Bắt buộc nhập" />{errors.fullName && <span className="form-message" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.fullName}</span>}</div>
                                                <div className="fieldset-email form-group"><label htmlFor="email" className="form-label">Email</label><input id="email" name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} placeholder="Để nhận xác nhận đơn hàng" />{errors.email && <span className="form-message" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.email}</span>}</div>
                                                <div className="fieldset-phone form-group"><label htmlFor="phoneNumber" className="form-label">Số điện thoại</label><input id="phoneNumber" name="phoneNumber" type="tel" className="form-control" value={formData.phoneNumber} onChange={handleChange} placeholder="Bắt buộc nhập" />{errors.phoneNumber && <span className="form-message" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.phoneNumber}</span>}</div>
                                                <div className="fieldset-address form-group"><label htmlFor="address" className="form-label">Địa chỉ</label><input id="address" name="address" type="text" className="form-control" value={formData.address} onChange={handleChange} placeholder="Bắt buộc nhập" />{errors.address && <span className="form-message" style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errors.address}</span>}</div>
                                                <div className="fieldset-notes form-group"><label htmlFor="notes" className="form-label">Ghi chú (tùy chọn)</label><textarea id="notes" name="notes" className="form-control" value={formData.notes} onChange={handleChange} placeholder="Ghi chú cho người bán..." /></div>
                                            </div>
                                            <div className="main-title" style={{ marginTop: '2rem' }}><h2>Phương thức thanh toán</h2></div>
                                            {/* --- ĐÃ CẬP NHẬT ---: Thêm lựa chọn MoMo AIO */}
                                            <div className="payment-methods" style={{ border: '1px solid #e1e1e1', padding: '1rem', borderRadius: '5px' }}>
                                                <div className="payment-method-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                                    <input type="radio" id="payment-cod" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '10px', width: '18px', height: '18px' }} />
                                                    <label htmlFor="payment-cod" style={{ fontWeight: 500, cursor: 'pointer' }}>Thanh toán khi nhận hàng (COD)</label>
                                                </div>
                                                <div className="payment-method-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                                    <input type="radio" id="payment-vnpay" name="paymentMethod" value="VNPAY" checked={paymentMethod === 'VNPAY'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '10px', width: '18px', height: '18px' }} />
                                                    <label htmlFor="payment-vnpay" style={{ fontWeight: 500, cursor: 'pointer' }}>Thanh toán qua Cổng VNPay</label>
                                                </div>
                                                <div className="payment-method-item" style={{ display: 'flex', alignItems: 'center' }}>
                                                    <input type="radio" id="payment-momo-aio" name="paymentMethod" value="MOMO_AIO" checked={paymentMethod === 'MOMO_AIO'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ marginRight: '10px', width: '18px', height: '18px' }} />
                                                    <label htmlFor="payment-momo-aio" style={{ fontWeight: 500, cursor: 'pointer' }}>Thanh toán MoMo (Thẻ/QR/Ví)</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="main-footer">
                                        <Link to="/cart" className="continue"><i className="fi-rs-angle-left"></i> Giỏ hàng</Link>
                                        <div className="pay">
                                            <button type="submit" className="btn-pay form-submit" disabled={isPlacingOrder}>
                                                {isPlacingOrder ? 'Đang xử lý...' : 'Đặt hàng'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-12 d-none d-lg-block" style={{ backgroundColor: '#f3f3f3', padding: '30px' }}>
                                    <div className="sliderbar">
                                        <div className="sliderbar-header"><h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Thông tin đơn hàng</h2></div>
                                        <div className="sliderbar-content">{renderSummaryItems()}</div>
                                        <div className="slider-footer" style={{ borderTop: '1px solid #ddd', paddingTop: '20px', marginTop: '20px' }}>
                                            <div className="subtotal">
                                                <div className="row row-sliderbar-footer" style={{ marginBottom: '10px' }}><div className="col-6"><span>Tạm tính:</span></div><div className="col-6 text-right"><span>{orderSummary.cartTotal.toLocaleString('vi-VN')}₫</span></div></div>
                                                <div className="row row-sliderbar-footer"><div className="col-6"><span>Phí vận chuyển:</span></div><div className="col-6 text-right"><span>{orderSummary.shippingFee.toLocaleString('vi-VN')}₫</span></div></div>
                                                <div className="total" style={{ borderTop: '1px solid #ddd', paddingTop: '15px', marginTop: '15px' }}><div className="row row-sliderbar-footer" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}><div className="col-6"><span>Tổng cộng:</span></div><div className="col-6 text-right"><span>{orderSummary.total.toLocaleString('vi-VN')}₫</span></div></div></div>
                                            </div>
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