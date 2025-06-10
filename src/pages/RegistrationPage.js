import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';
//import Validator from '../utils/validator';
// import './RegistrationPage.css';

function RegistrationPage() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        password_confirmation: '',
        gender: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic validate (cần tự implement hoặc điều chỉnh Validator.js)
        const tempErrors = {};
        if (!formData.fullname.trim()) tempErrors.fullname = "Vui lòng nhập tên đầy đủ";
        if (!formData.email.trim()) tempErrors.email = "Vui lòng nhập email";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email không hợp lệ";
        if (!formData.password) tempErrors.password = "Vui lòng nhập mật khẩu";
        else if (formData.password.length < 6) tempErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        if (!formData.password_confirmation) tempErrors.password_confirmation = "Vui lòng nhập lại mật khẩu";
        else if (formData.password_confirmation !== formData.password) tempErrors.password_confirmation = "Mật khẩu nhập lại không chính xác";
        if (!formData.gender) tempErrors.gender = "Vui lòng chọn giới tính";

        setErrors(tempErrors);

        if (Object.keys(tempErrors).length === 0) {
            console.log('Registration submitted:', formData);
            // Xử lý đăng ký (ví dụ: gọi API)
            alert('Đăng ký thành công! (Demo)');
            navigate('/login'); // Chuyển hướng đến trang đăng nhập
        }
    };

    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={isMobileMenuOpen ? toggleMobileMenu : null}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="container">
                <div className="registration__form">
                    <div className="row">
                        <div className="col-sm-12 col-lg-6">
                            <form onSubmit={handleSubmit} className="form" id="form-register">
                                <h3 className="heading">ĐĂNG KÍ</h3>
                                <div className="form-group">
                                    <label htmlFor="fullname" className="form-label">Tên đầy đủ</label>
                                    <input id="fullname" name="fullname" type="text" placeholder="VD: Quốc Trung" className="form-control" value={formData.fullname} onChange={handleChange} />
                                    {errors.fullname && <span className="form-message">{errors.fullname}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input id="email" name="email" type="text" placeholder="VD: email@domain.com" className="form-control" value={formData.email} onChange={handleChange} />
                                    {errors.email && <span className="form-message">{errors.email}</span>}
                                </div>
                                <div className="form-group matkhau">
                                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                                    <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" className="form-control" value={formData.password} onChange={handleChange} />
                                    <span className="show-hide" onClick={toggleShowPassword} style={{ cursor: 'pointer' }}><i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i></span>
                                    {errors.password && <span className="form-message">{errors.password}</span>}
                                </div>
                                <div className="form-group matkhau">
                                    <label htmlFor="password_confirmation" className="form-label">Nhập lại mật khẩu</label>
                                    <input id="password_confirmation" name="password_confirmation" type={showConfirmPassword ? "text" : "password"} placeholder="Nhập lại mật khẩu" className="form-control" value={formData.password_confirmation} onChange={handleChange} />
                                    <span className="show-hide-two" onClick={toggleShowConfirmPassword} style={{ cursor: 'pointer' }}><i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} fa-eye-2`}></i></span>
                                    {errors.password_confirmation && <span className="form-message">{errors.password_confirmation}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Giới tính</label>
                                    <div>
                                        <div className="form-check-inline">
                                            <input type="radio" className="form-check-input" name="gender" value="male" id="gender_male" checked={formData.gender === 'male'} onChange={handleChange} />
                                            <label htmlFor="gender_male">Nam</label>
                                        </div>
                                        <div className="form-check-inline">
                                            <input type="radio" className="form-check-input" name="gender" value="female" id="gender_female" checked={formData.gender === 'female'} onChange={handleChange} />
                                            <label htmlFor="gender_female">Nữ</label>
                                        </div>
                                        <div className="form-check-inline">
                                            <input type="radio" className="form-check-input" name="gender" value="other" id="gender_other" checked={formData.gender === 'other'} onChange={handleChange} />
                                            <label htmlFor="gender_other">Khác</label>
                                        </div>
                                    </div>
                                    {errors.gender && <span className="form-message">{errors.gender}</span>}
                                </div>
                                <button type="submit" className="form-submit btn-blocker" style={{ borderRadius: 'unset' }}>Đăng ký <i className="fas fa-arrow-right" style={{ fontSize: '16px', marginLeft: '10px' }}></i></button>
                                <p style={{ fontSize: '16px', margin: '10px 0' }}>Bạn đã có tài khoản? <Link to="/login" style={{ color: 'black', fontWeight: 'bold' }}>Đăng nhập</Link></p>
                            </form>
                        </div>
                        <div className="col-sm-12 col-lg-6">
                            <h3 className="heading">TẠO MỘT TÀI KHOẢN</h3>
                            <p className="text-login">Đăng nhập bằng tài khoản sẽ giúp bạn truy cập:</p>
                            <ul>
                                <li className="text-login-item"><i className="fas fa-check"></i> <p className="text-login">Một lần đăng nhập chung duy nhất để tương tác với các sản phẩm và dịch vụ của P&T shop</p></li>
                                <li className="text-login-item"><i className="fas fa-check"></i> <p className="text-login">Thanh toán nhanh hơn</p></li>
                                <li className="text-login-item"><i className="fas fa-check"></i> <p className="text-login">Xem lịch sử đặt hàng riêng của bạn</p></li>
                                <li className="text-login-item"><i className="fas fa-check"></i> <p className="text-login">Thêm hoặc thay đổi tùy chọn email</p></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <GoToTop />
        </div>
    );
}

export default RegistrationPage;