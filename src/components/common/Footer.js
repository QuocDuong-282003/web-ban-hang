import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer bg-light text-dark pt-5">
            <div className="container">
                <div className="row">

                    {/* Cột 1: Logo + Liên hệ + MXH */}
                    <div className="col-sm-12 col-md-6 col-lg-3 mb-4">
                        <img
                            src="./assets/img/logo/logomain.png"
                            alt="P&T Shop Logo"
                            width="100"
                            height="100"
                            style={{
                                borderRadius: '50%',
                                border: '3px solid #000',
                                marginBottom: '20px'
                            }}
                        />
                        <ul className="footer__list list-unstyled">
                            <li className="footer__item mb-2">
                                <i className="fas fa-search-location footer__item-icon me-2"></i>
                                Ho Chi Minh, Viet Nam
                            </li>
                            <li className="footer__item mb-2">
                                <i className="fas fa-phone-square-alt footer__item-icon me-2"></i>
                                Phone: <a href="tel:0123456789">0123456789</a>
                            </li>
                            <li className="footer__item mb-3">
                                <i className="fas fa-envelope-square footer__item-icon me-2"></i>
                                Email: <a href="mailto:abc@gmail.com">abc@gmail.com</a>
                            </li>
                            <li className="footer__item d-flex">
                                <a href="#facebook" className="me-2 text-dark">
                                    <i className="fab fa-facebook fa-lg"></i>
                                </a>
                                <a href="#instagram" className="me-2" style={{ color: 'pink' }}>
                                    <i className="fab fa-instagram fa-lg"></i>
                                </a>
                                <a href="#youtube" className="me-2" style={{ color: 'red' }}>
                                    <i className="fab fa-youtube fa-lg"></i>
                                </a>
                                <a href="#twitter" className="text-dark">
                                    <i className="fab fa-twitter fa-lg"></i>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 2: Thông tin của chúng tôi */}
                    <div className="col-sm-12 col-md-6 col-lg-3 mb-4">
                        <h5 className="footer__heading mb-3">Thông tin của chúng tôi</h5>
                        <ul className="footer__list list-unstyled">
                            <li className="footer__item mb-2">
                                <Link to="/store-location/1" className="footer__item--link">
                                    Cơ sở 1: 26 Đường D1, P12, Quận Tân Bình, TP.HCM
                                </Link>
                            </li>
                            <li className="footer__item mb-2">
                                <Link to="/store-location/2" className="footer__item--link">
                                    Cơ sở 2: 86 Đinh Bộ Lĩnh, P10, Quận Bình Thạnh, TP.HCM
                                </Link>
                            </li>
                            <li className="footer__item">
                                <Link to="/about#business-area" className="footer__item--link">
                                    Lĩnh vực kinh doanh
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3: Chính sách */}
                    <div className="col-sm-12 col-md-6 col-lg-3 mb-4">
                        <h5 className="footer__heading mb-3">Chính sách</h5>
                        <ul className="footer__list list-unstyled">
                            <li className="footer__item mb-2">
                                <Link to="/policy/warranty" className="footer__item--link">
                                    Chính sách bảo hành
                                </Link>
                            </li>
                            <li className="footer__item mb-2">
                                <Link to="/policy/return" className="footer__item--link">
                                    Chính sách đổi trả
                                </Link>
                            </li>
                            <li className="footer__item mb-2">
                                <Link to="/policy/payment" className="footer__item--link">
                                    Chính sách thanh toán
                                </Link>
                            </li>
                            <li className="footer__item mb-2">
                                <Link to="/policy/shipping" className="footer__item--link">
                                    Chính sách giao nhận hàng
                                </Link>
                            </li>
                            <li className="footer__item">
                                <Link to="/policy/privacy" className="footer__item--link">
                                    Chính sách bảo mật
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 4: Hỗ trợ chung */}
                    <div className="col-sm-12 col-md-6 col-lg-3 mb-4">
                        <h5 className="footer__heading mb-3">Hỗ trợ chung</h5>
                        <ul className="footer__list list-unstyled">
                            <li className="footer__item mb-2">
                                <Link to="/" className="footer__item--link">Trang chủ</Link>
                            </li>
                            <li className="footer__item mb-2">
                                <Link to="/intro" className="footer__item--link">Giới thiệu</Link>
                            </li>
                            <li className="footer__item mb-2">
                                <Link to="/products" className="footer__item--link">Sản phẩm</Link>
                            </li>
                            <li className="footer__item mb-2">
                                <Link to="/news" className="footer__item--link">Tin tức</Link>
                            </li>
                            <li className="footer__item">
                                <Link to="/contact" className="footer__item--link">Liên hệ</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer__bottom bg-dark text-white text-center py-3 mt-4">
                <p className="mb-0">© Bản quyền thuộc về ABC</p>
            </div>
        </footer>
    );
}

export default Footer;
