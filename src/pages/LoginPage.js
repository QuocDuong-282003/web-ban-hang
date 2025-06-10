import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';

function LoginPage() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const tempErrors = {};
        if (!formData.email) {
            tempErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email không hợp lệ';
        }
        if (!formData.password) {
            tempErrors.password = 'Vui lòng nhập mật khẩu';
        } else if (formData.password.length < 6) {
            tempErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(tempErrors);

        if (Object.keys(tempErrors).length === 0) {
            console.log('Login submitted:', formData);
            alert('Đăng nhập thành công! (Demo)');
            navigate('/');
        }
    };

    return (
        <div>
            <div
                className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`}
                onClick={isMobileMenuOpen ? toggleMobileMenu : null}
            ></div>

            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="container">
                <div className="login__form">
                    <div className="row">
                        <div className="col-sm-12 col-lg-6">
                            <form onSubmit={handleSubmit} className="form" id="form-login">
                                <h3 className="heading">ĐĂNG NHẬP</h3>
                                <Link
                                    to="/forgot-password"
                                    className="form__forgot-password"
                                >
                                    Bạn quên mật khẩu?
                                </Link>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        placeholder="VD: email@domain.com"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && (
                                        <span className="form-message">{errors.email}</span>
                                    )}
                                </div>

                                <div className="form-group matkhau">
                                    <label htmlFor="password" className="form-label">
                                        Mật khẩu
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Nhập mật khẩu"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <span
                                        className="show-hide"
                                        onClick={toggleShowPassword}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <i
                                            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'
                                                }`}
                                        ></i>
                                    </span>
                                    {errors.password && (
                                        <span className="form-message">{errors.password}</span>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="form-submit btn-blocker"
                                    style={{ borderRadius: 'unset' }}
                                >
                                    ĐĂNG NHẬP{' '}
                                    <i
                                        className="fas fa-arrow-right"
                                        style={{ fontSize: '16px', marginLeft: '10px' }}
                                    ></i>
                                </button>

                                <h4>HOẶC</h4>

                                <div className="form-social">
                                    <button type="button" className="form-submit-social btn-blocker">
                                        <span>Facebook</span>
                                        <img
                                            src="./assets/icon/facebook.svg"
                                            alt="Facebook login"
                                            className="form-submit-social--img"
                                        />
                                    </button>

                                    <button type="button" className="form-submit-social btn-blocker">
                                        <span>GOOGLE</span>
                                        <img
                                            src="./assets/icon/google.svg"
                                            alt="Google login"
                                            className="form-submit-social--img"
                                        />
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="col-sm-12 col-lg-6">
                            <h3 className="heading">TẠO MỘT TÀI KHOẢN</h3>
                            <p className="text-login">
                                Thật dễ dàng tạo một tài khoản. Hãy nhập địa chỉ email của bạn
                                và điền vào mẫu trên trang tiếp theo và tận hưởng những lợi ích
                                của việc sở hữu một tài khoản :
                            </p>
                            <ul>
                                <li className="text-login-item">
                                    <i className="fas fa-check"></i>{' '}
                                    <p className="text-login">
                                        Tổng quan đơn giản về thông tin cá nhân của bạn
                                    </p>
                                </li>
                                <li className="text-login-item">
                                    <i className="fas fa-check"></i>{' '}
                                    <p className="text-login">Thanh toán nhanh hơn</p>
                                </li>
                                <li className="text-login-item">
                                    <i className="fas fa-check"></i>{' '}
                                    <p className="text-login">Ưu đãi và khuyến mãi độc quyền</p>
                                </li>
                                <li className="text-login-item">
                                    <i className="fas fa-check"></i>{' '}
                                    <p className="text-login">Các sản phẩm mới nhất</p>
                                </li>
                                <li className="text-login-item">
                                    <i className="fas fa-check"></i>{' '}
                                    <p className="text-login">
                                        Các bộ sưu tập giới hạn và bộ sưu tập theo mùa mới
                                    </p>
                                </li>
                                <li className="text-login-item">
                                    <i className="fas fa-check"></i>{' '}
                                    <p className="text-login">Các sự kiện sắp tới</p>
                                </li>
                            </ul>

                            <Link to="/register">
                                <button
                                    className="form-submit btn-blocker custom-btn"
                                    style={{ borderRadius: 'unset', margin: 'unset' }}
                                >
                                    ĐĂNG KÍ{' '}
                                    <i
                                        className="fas fa-arrow-right"
                                        style={{ fontSize: '16px', marginLeft: '10px' }}
                                    ></i>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <GoToTop />
        </div>
    );
}

export default LoginPage;
