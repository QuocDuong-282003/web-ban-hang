import React from 'react';
import { Link } from 'react-router-dom';

function OrderSuccessPage() {
    return (
        <>
            <header className="header order-success-header"> {/* Thêm class để style riêng nếu cần */}
                <div className="container-fluid">
                    <div className="header__first">
                        <ul className="nav nav__first">
                            <li className="nav-item nav-item__first">
                                <i className="fi-rs-bell"></i>
                                <a className="nav-link nav-link__first nav-link__first--separate" href="#">Thông báo</a>
                            </li>
                            <li className="nav-item nav-item__first">
                                <Link className="nav-link nav-link__first nav-link__first--separate" to="/contact">Liên hệ</Link>
                            </li>
                            <li className="nav-item nav-item__first">
                                <Link className="nav-link nav-link__first" to="/login">Đăng nhập</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="header__second">
                        <div className="header__second__logo">
                            <Link to="/"><img src="./assets/img/logo/logomain.png" alt="P&T Shop Logo" className="header__second__logo--img" /></Link>
                        </div>
                        <div className="header__second__search">
                            {/* Search bar có thể không cần thiết trên trang success */}
                        </div>
                        <div className="header__second__like">
                            <Link to="/wishlist" className="header__second__like--icon"><i className="fi-rs-heart"></i></Link>
                        </div>
                        <div className="header__second__cart">
                            <Link to="/cart" className="header__second__cart--icon">
                                <i className="fi-rs-shopping-bag"></i>
                                {/* Cart notice nên được cập nhật từ state global */}
                                <span className="header__second__cart--notice">0</span>
                            </Link>
                        </div>
                    </div>
                    <div className="header__third">
                        <ul className="nav nav__third">
                            <li className="nav-item nav-item__third">
                                <Link className="nav-link nav-link__third" to="/">Trang chủ</Link>
                            </li>
                            <li className="nav-item nav-item__third">
                                <Link className="nav-link nav-link__third" to="/products">Tất cả sản phẩm</Link>
                            </li>
                            {/* Các mục menu khác có thể ẩn đi trên trang success */}
                        </ul>
                    </div>
                </div>
            </header>

            <div className="container">
                <div className="content" style={{ height: 'auto', minHeight: '200px', boxShadow: '0 1px 6px 0 rgb(32 33 36 / 28%)', marginTop: '150px', marginBottom: '150px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '30px' }}>
                    <i className="fas fa-check-circle" style={{ fontSize: '5rem', color: 'green', marginBottom: '20px' }}></i>
                    <h1 style={{ fontSize: '2rem' }}>Đặt hàng thành công!</h1>
                    <p style={{ fontSize: '1.1rem', margin: '15px 0' }}>Cảm ơn bạn đã mua hàng tại P&T Shop. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất.</p>
                    <Link style={{ fontSize: '1.1rem', textDecoration: 'underline', color: '#007bff' }} to="/">Tiếp tục mua hàng</Link>
                </div>
            </div>

            <footer className="footer order-success-footer"> {/* Thêm class để style riêng nếu cần */}
                <div className="container">
                    {/* Footer có thể đơn giản hơn trên trang success */}
                </div>
                <div className="footer__bottom">
                    <p className="footer__text">© Bản quyền thuộc về P&T Shop</p>
                </div>
            </footer>
        </>
    );
}

export default OrderSuccessPage;