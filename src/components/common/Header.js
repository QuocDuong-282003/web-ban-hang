import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom'; // Sử dụng NavLink để active class
//import './Header.css'; // Tạo file CSS riêng cho Header nếu cần

function Header() {
    // Ví dụ state cho loggedIn (bạn sẽ quản lý cái này qua Context API hoặc Redux)
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Mặc định là chưa đăng nhập
    const [userName, setUserName] = useState("Huy Hùng"); // Tên người dùng ví dụ

    // Logic cho mobile menu (nếu bạn chuyển từ main.js)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        // Cũng có thể thêm/xóa class 'hidden' cho overlay
        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.classList.toggle('hidden', !isMobileMenuOpen);
        }
    };

    // Giả sử bạn có một hàm để kiểm tra trạng thái đăng nhập
    useEffect(() => {
        // checkLoginStatus().then(status => setIsLoggedIn(status.loggedIn));
        // Ví dụ: setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    }, []);


    return (
        <header className="header">
            <div className="container">
                <div className="top-link clearfix hidden-sm hidden-xs">
                    <div className="row">
                        <div className="col-6 social_link">
                            <div className="social-title">Theo dõi: </div>
                            <a href="https://www.facebook.com/zeroryo25/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook" style={{ fontSize: '24px', marginRight: '10px' }}></i></a>
                            <a href="#instagram"><i className="fab fa-instagram" style={{ fontSize: '24px', marginRight: '10px', color: 'pink' }}></i></a>
                            <a href="#youtube"><i className="fab fa-youtube" style={{ fontSize: '24px', marginRight: '10px', color: 'red' }}></i></a>
                            <a href="#twitter"><i className="fab fa-twitter" style={{ fontSize: '24px', marginRight: '10px' }}></i></a>
                        </div>
                        <div className="col-6 login_link">
                            {isLoggedIn ? (
                                <ul className="nav nav__first right">
                                    <li className="nav-item nav-item__first nav-item__first-user">
                                        <img src="./assets/img/product/noavatar.png" alt="" className="nav-item__first-img" />
                                        <span className="nav-item__first-name">{userName}</span>
                                        <ul className="nav-item__first-menu">
                                            <li className="nav-item__first-item">
                                                <Link to="/account">Tài khoản của tôi</Link>
                                            </li>
                                            <li className="nav-item__first-item">
                                                <Link to="/account/addresses">Địa chỉ của tôi</Link>
                                            </li>
                                            <li className="nav-item__first-item">
                                                <Link to="/account/orders">Đơn mua</Link>
                                            </li>
                                            <li className="nav-item__first-item">
                                                {/* <button onClick={handleLogout}>Đăng xuất</button> */}
                                                <Link to="/logout">Đăng xuất</Link>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            ) : (
                                <ul className="header_link right m-auto">
                                    <li>
                                        <Link to="/login"><i className="fas fa-sign-in-alt mr-3"></i>Đăng nhập</Link>
                                    </li>
                                    <li>
                                        <Link to="/register"><i className="fas fa-user-plus mr-3" style={{ marginLeft: '10px' }}></i>Đăng kí</Link>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                <div className="header-main clearfix">
                    <div className="row">
                        <div className="col-lg-3 col-100-h">
                            <div id="trigger-mobile" className="visible-sm visible-xs" onClick={toggleMobileMenu}><i className="fas fa-bars"></i></div>
                            <div className="logo">
                                <Link to="/">
                                    <img src="./assets/img/logo/logomain.png" alt="P&T Shop Logo" />
                                </Link>
                            </div>
                            <div className="mobile_cart visible-sm visible-xs">
                                <Link to="/cart" className="header__second__cart--icon">
                                    <i className="fas fa-shopping-cart"></i>
                                    <span id="header__second__cart--notice" className="header__second__cart--notice">3</span> {/* State for cart count */}
                                </Link>
                                <Link to="/wishlist" className="header__second__like--icon">
                                    <i className="far fa-heart"></i>
                                    <span id="header__second__like--notice" className="header__second__like--notice">3</span> {/* State for wishlist count */}
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6 m-auto pdt15">
                            <form className="example" action="/products" onSubmit={(e) => { /* handle search submission */ }}>
                                <input type="text" className="input-search" placeholder="Tìm kiếm.." name="search" />
                                <button type="submit" className="search-btn"><i className="fa fa-search"></i></button>
                            </form>
                        </div>
                        <div className="col-3 m-auto hidden-sm hidden-xs">
                            <div className="item-car clearfix">
                                <Link to="/cart" className="header__second__cart--icon">
                                    <i className="fas fa-shopping-cart"></i>
                                    <span id="header__second__cart--notice-desktop" className="header__second__cart--notice">3</span>
                                </Link>
                            </div>
                            <div className="item-like clearfix">
                                <Link to="/wishlist" className="header__second__like--icon">
                                    <i className="far fa-heart"></i>
                                    <span id="header__second__like--notice-desktop" className="header__second__like--notice">3</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <nav className="header_nav hidden-sm hidden-xs">
                <div className="container">
                    <ul className="header_nav-list nav">
                        <li className="header_nav-list-item">
                            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Trang chủ</NavLink>
                        </li>
                        <li className="header_nav-list-item">
                            <NavLink to="/intro" className={({ isActive }) => isActive ? "active" : ""}>Giới thiệu</NavLink>
                        </li>
                        <li className="header_nav-list-item has-mega">
                            <NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>Sản phẩm<i className="fas fa-angle-right" style={{ marginLeft: '5px' }}></i></NavLink>
                            <div className="mega-content" style={{ overflowX: 'hidden' }}>
                                <div className="row">
                                    <ul className="col-8 no-padding level0">
                                        <li className="level1">
                                            <Link className="hmega" to="/products">Tất cả sản phẩm</Link>
                                        </li>
                                        <li className="level1">
                                            <span className="hmega">Giày, dép</span> {/* Changed to span as it's a category title */}
                                            <ul className="level1">
                                                <li className="level2"><Link to="/products?category=shoes&type=football">Bóng đá</Link></li>
                                                <li className="level2"><Link to="/products?category=shoes&type=running">Chạy</Link></li>
                                                <li className="level2"><Link to="/products?category=shoes&type=badminton">Cầu lông</Link></li>
                                                <li className="level2"><Link to="/products?category=shoes&type=basketball">Bóng rổ</Link></li>
                                                <li className="level2"><Link to="/products?category=shoes&type=tennis">Quần vợt</Link></li>
                                            </ul>
                                        </li>
                                        <li className="level1">
                                            <span className="hmega">Quần, áo</span>
                                            <ul className="level1">
                                                <li className="level2"><Link to="/products?category=clothes&type=football">Bóng đá</Link></li>
                                                <li className="level2"><Link to="/products?category=clothes&type=running">Chạy</Link></li>
                                                {/* ... more */}
                                            </ul>
                                        </li>
                                        <li className="level1">
                                            <span className="hmega">Phụ kiện</span>
                                            <ul className="level1">
                                                <li className="level2"><Link to="/products?category=accessories&type=football">Bóng đá</Link></li>
                                                {/* ... more */}
                                            </ul>
                                        </li>
                                    </ul>
                                    <div className="col-4">
                                        <Link to="/products/special-offer">
                                            <picture>
                                                <img src="https://media.giphy.com/media/mj7HcKFq23oobJMcOG/giphy.gif" alt="Special Offer" width="80%" />
                                            </picture>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="header_nav-list-item">
                            <NavLink to="/news" className={({ isActive }) => isActive ? "active" : ""}>Tin tức</NavLink>
                        </li>
                        <li className="header_nav-list-item">
                            <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Liên hệ</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Header;