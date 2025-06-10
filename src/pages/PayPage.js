import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate for redirection
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';
//import Validator from '../utils/validator'; // Giả sử bạn đã chuyển validator.js sang dạng module
// import './PayPage.css';

// Dữ liệu mẫu cho summary (trong thực tế lấy từ cart context/state)
const sampleOrderSummary = {
    items: [
        { id: 1, name: 'ÁO THỦ MÔN ĐTVN 2021 GRAND SPORT - 038-322 - VÀNG CAM', price: 625000, quantity: 2, img: './assets/img/product/stansmith.jpg' },
        { id: 2, name: 'ADIDAS STAN SMITH NAM NỮ', price: 790000, quantity: 1, img: './assets/img/product/addidas1.jpg' }
    ],
    subtotal: (625000 * 2) + 790000,
    shippingFee: 30000,
    total: (625000 * 2) + 790000 + 30000
};


function PayPage() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [formData, setFormData] = useState({
        hoten: 'Quốc Trung', // Dữ liệu mẫu, sẽ lấy từ user context
        email: 'nguyenquoctrung@gmail.com', // Dữ liệu mẫu
        sdt: '',
        diachi: ''
    });
    const [errors, setErrors] = useState({});
    const [orderSummary, setOrderSummary] = useState(sampleOrderSummary);
    const [showMobileSummary, setShowMobileSummary] = useState(false);


    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Khởi tạo Validator (cần điều chỉnh validator.js để hoạt động với React state)
        const validationErrors = {}; // Đây là nơi validator sẽ ghi lỗi
        // --- Logic gọi Validator ở đây ---
        // Ví dụ:
        if (!formData.hoten.trim()) validationErrors.hoten = "Vui lòng nhập họ tên";
        if (!formData.sdt.trim()) validationErrors.sdt = "Vui lòng nhập số điện thoại";
        // else if (!/^(0\d{9})$/.test(formData.sdt)) validationErrors.sdt = "Số điện thoại không hợp lệ";
        if (!formData.diachi.trim()) validationErrors.diachi = "Vui lòng nhập địa chỉ";

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            console.log('Form submitted:', formData);
            // Chuyển hướng đến trang đặt hàng thành công
            navigate('/order-success');
        }
    };

    const renderSummaryItems = () => {
        return orderSummary.items.map(item => (
            <div className="row row-sliderbar" key={item.id} style={{ alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                <div className="col-3 col-md-2 position-relative"> {/* col-md-2 for desktop, col-3 for mobile summary */}
                    <img src={item.img} alt={item.name} width="80%" style={{ border: '1px solid #ddd', borderRadius: '4px' }} />
                    <span className="notice" style={{ top: '-5px', right: '10px' }}>{item.quantity}</span>
                </div>
                <div className="col-7 col-md-7"> {/* col-md-7 for desktop */}
                    <h5 style={{ fontSize: '0.9rem', margin: 0 }}>{item.name}</h5>
                </div>
                <div className="col-2 col-md-3 text-right" style={{ fontSize: '0.9rem' }}> {/* col-md-3 for desktop */}
                    <span>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                </div>
            </div>
        ));
    };


    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={isMobileMenuOpen ? toggleMobileMenu : null}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="content">
                <div className="wrap">
                    <div className="container">
                        <form onSubmit={handleSubmit} id="form-pay">
                            <div className="row">
                                {/* Mobile Summary (hidden on larger screens) */}
                                <div className="summary col-12 d-lg-none mb-3">
                                    <div className="summary-heading" onClick={() => setShowMobileSummary(!showMobileSummary)} style={{ cursor: 'pointer' }}>
                                        <div className="summary-heading-title">
                                            <h4>Thông tin đơn hàng</h4>
                                        </div>
                                        <div className="summary-heading-price">
                                            <h4>{orderSummary.total.toLocaleString('vi-VN')}đ <i className={`fas ${showMobileSummary ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ marginLeft: '20px', marginRight: '5px' }}></i></h4>
                                        </div>
                                    </div>
                                    {showMobileSummary && (
                                        <div className="summary-content" style={{ border: '1px solid #eee', padding: '15px', marginTop: '10px' }}>
                                            <div className="sliderbar">
                                                <div className="sliderbar-content">
                                                    {renderSummaryItems()}
                                                </div>
                                                <div className="slider-footer">
                                                    <div className="subtotal">
                                                        <div className="row row-sliderbar-footer">
                                                            <div className="col-6"><span>Tạm tính:</span></div>
                                                            <div className="col-6 text-right"><span>{orderSummary.subtotal.toLocaleString('vi-VN')}₫</span></div>
                                                        </div>
                                                        <div className="row row-sliderbar-footer">
                                                            <div className="col-6"><span>Phí vận chuyển:</span></div>
                                                            <div className="col-6 text-right"><span>{orderSummary.shippingFee.toLocaleString('vi-VN')}₫</span></div>
                                                        </div>
                                                    </div>
                                                    <div className="total">
                                                        <div className="row row-sliderbar-footer" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                            <div className="col-6"><span>Tổng cộng:</span></div>
                                                            <div className="col-6 text-right"><span>{orderSummary.total.toLocaleString('vi-VN')}₫</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Main Form */}
                                <div className="col-lg-6 col-12">
                                    <div className="main">
                                        <div className="main-header">
                                            <Link to="/"><h1>P&T SHOP</h1></Link>
                                        </div>
                                        <div className="main-content">
                                            <div className="main-title"><h2>Thông tin giao hàng</h2></div>
                                            <div className="main-customer-info">
                                                <div className="main-customer-info-img">
                                                    <img src="./assets/img/product/noavatar.png" alt="Avatar" width="60px" height="60px" />
                                                </div>
                                                <div className="main-customer-info-logged">
                                                    <p className="main-customer-info-logged-paragraph">{formData.hoten} ({formData.email})</p>
                                                    <Link to="/login">Đăng xuất</Link>
                                                </div>
                                            </div>
                                            <div className="fieldset">
                                                <div className="fieldset-name form-group">
                                                    <label htmlFor="hoten" className="form-label">Họ tên</label>
                                                    <input id="hoten" name="hoten" type="text" className="form-control" value={formData.hoten} onChange={handleChange} />
                                                    {errors.hoten && <span className="form-message">{errors.hoten}</span>}
                                                </div>
                                                <div className="fieldset-phone form-group">
                                                    <label htmlFor="sdt" className="form-label">Số điện thoại</label>
                                                    <input id="sdt" name="sdt" type="tel" className="form-control" value={formData.sdt} onChange={handleChange} />
                                                    {errors.sdt && <span className="form-message">{errors.sdt}</span>}
                                                </div>
                                                <div className="fieldset-address form-group">
                                                    <label htmlFor="diachi" className="form-label">Địa chỉ</label>
                                                    <input id="diachi" name="diachi" type="text" className="form-control" value={formData.diachi} onChange={handleChange} />
                                                    {errors.diachi && <span className="form-message">{errors.diachi}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="main-footer">
                                            <div className="continue">
                                                <Link to="/cart"><i className="fi-rs-angle-left"></i> Giỏ hàng</Link>
                                            </div>
                                            <div className="pay">
                                                <button type="submit" className="btn-pay form-submit">Thanh toán</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Summary */}
                                <div className="col-lg-6 col-12 d-none d-lg-block" style={{ backgroundColor: '#f3f3f3', padding: '30px' }}>
                                    <div className="sliderbar">
                                        <div className="sliderbar-header"><h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Thông tin đơn hàng</h2></div>
                                        <div className="sliderbar-content">
                                            {renderSummaryItems()}
                                        </div>
                                        <div className="slider-footer" style={{ borderTop: '1px solid #ddd', paddingTop: '20px', marginTop: '20px' }}>
                                            <div className="subtotal">
                                                <div className="row row-sliderbar-footer" style={{ marginBottom: '10px' }}>
                                                    <div className="col-6"><span>Tạm tính:</span></div>
                                                    <div className="col-6 text-right"><span>{orderSummary.subtotal.toLocaleString('vi-VN')}₫</span></div>
                                                </div>
                                                <div className="row row-sliderbar-footer">
                                                    <div className="col-6"><span>Phí vận chuyển:</span></div>
                                                    <div className="col-6 text-right"><span>{orderSummary.shippingFee.toLocaleString('vi-VN')}₫</span></div>
                                                </div>
                                            </div>
                                            <div className="total" style={{ borderTop: '1px solid #ddd', paddingTop: '15px', marginTop: '15px' }}>
                                                <div className="row row-sliderbar-footer" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                                    <div className="col-6"><span>Tổng cộng:</span></div>
                                                    <div className="col-6 text-right"><span>{orderSummary.total.toLocaleString('vi-VN')}₫</span></div>
                                                </div>
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