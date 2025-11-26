import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogout } from '../../container/redux/userAuthSlice';
import { logout } from '../../container/services/userService';
import { clearCart } from '../../components/store/actions/cartSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './MobileMenu.scss';

function MobileMenu({ isOpen, toggleMenu, user, isAuthenticated }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openSubmenus, setOpenSubmenus] = useState({});

    // ============ HANDLERS ============
    const toggleSubmenu = (id, level) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [`${level}-${id}`]: !prev[`${level}-${id}`]
        }));
    };

    const handleSubmenuToggle = (index, id) => {
        toggleSubmenu(id, `level${index}`);
    };

    const handleLogout = async () => {
        try {
            await logout();
            dispatch(userLogout());
            dispatch(clearCart());
            toast.info("Bạn đã đăng xuất.");
            toggleMenu();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            dispatch(userLogout());
            dispatch(clearCart());
            toast.info("Bạn đã đăng xuất.");
            toggleMenu();
            navigate('/');
        }
    };

    const handleLogoutClick = () => {
        toggleMenu();
        handleLogout();
    };

    // ============ RENDER FUNCTIONS ============
    const renderDrawerHeader = () => {
        if (isAuthenticated && user) {
            return (
                <Link
                    to="/account"
                    onClick={toggleMenu}
                    className="drawer-header--auth-wrapper"
                    style={{ textDecoration: 'none', display: 'block' }}
                >
                    <div className="drawer-header--auth">
                        <div className="_object">
                            <img
                                src={user.avatar ? user.avatar : "/assets/img/product/noavatar.png"}
                                alt="User avatar"
                            />
                        </div>
                        <div className="_body">
                            {user.name}
                            <br />Hồ sơ của tôi
                        </div>
                    </div>
                </Link>
            );
        }

        return (
            <Link to="/login" onClick={toggleMenu}>
                <div className="drawer-header--auth">
                    <div className="_object">
                        <img src="./assets/img/product/giayxah2.jpg" alt="User avatar" />
                    </div>
                    <div className="_body">
                        Đăng nhập
                        <br />Nhận nhiều ưu đãi hơn
                    </div>
                </div>
            </Link>
        );
    };

    const renderAuthMenu = () => {
        // Chỉ hiển thị menu đăng nhập/đăng ký khi chưa đăng nhập
        if (!isAuthenticated || !user) {
            return (
                <ul className="ul-first-menu">
                    <li>
                        <Link to="/login" onClick={toggleMenu}>Đăng nhập</Link>
                    </li>
                    <li>
                        <Link to="/register" className="abc" onClick={toggleMenu}>Đăng kí</Link>
                    </li>
                </ul>
            );
        }
        // Ẩn menu tài khoản khi đã đăng nhập (đã có trong dropdown)
        return null;
    };

    const renderProductsSubmenu = () => {
        const isProductsOpen = openSubmenus['level1-products'];
        const isAllProductsOpen = openSubmenus['level2-allproducts'];

        return (
            <li className={`ng-scope ng-has-child1 ${isProductsOpen ? 'open' : ''}`}>
                <div
                    onClick={() => handleSubmenuToggle(1, 'products')}
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <NavLink to="/products" onClick={(e) => e.preventDefault()}>
                        <i className="fas fa-box"></i>
                        Sản phẩm
                    </NavLink>
                    <span>
                        <i className={`fas ${isProductsOpen ? 'fa-chevron-up' : 'fa-chevron-down'} cong`}></i>
                    </span>
                </div>
                {isProductsOpen && (
                    <ul className="ul-has-child1">
                        <li className={`ng-scope ng-has-child2 ${isAllProductsOpen ? 'open' : ''}`}>
                            <div
                                onClick={() => handleSubmenuToggle(2, 'allproducts')}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <NavLink to="/products" onClick={toggleMenu}>
                                    Tất cả sản phẩm
                                </NavLink>
                                <span>
                                    <i className={`fas ${isAllProductsOpen ? 'fa-chevron-up' : 'fa-chevron-down'} cong1`}></i>
                                </span>
                            </div>
                            {isAllProductsOpen && (
                                <ul className="ul-has-child2" id="abc">
                                    <li className="ng-scope">
                                        <NavLink to="/products?type=football" onClick={toggleMenu}>
                                            Bóng đá
                                        </NavLink>
                                    </li>
                                    {/* Add other sub-items */}
                                </ul>
                            )}
                        </li>
                        {/* Tương tự cho Quần áo, Giày dép, Phụ kiện */}
                    </ul>
                )}
            </li>
        );
    };

    const renderNavigationMenu = () => {
        return (
            <div className="la-scroll-fix-infor-user">
                <div className="la-nav-menu-items">
                    <ul className="la-nav-list-items">
                        <li className="ng-scope">
                            <NavLink to="/" onClick={toggleMenu}>
                                <i className="fas fa-home"></i>
                                Trang chủ
                            </NavLink>
                        </li>
                        <li className="ng-scope">
                            <NavLink to="/intro" onClick={toggleMenu}>
                                <i className="fas fa-info-circle"></i>
                                Giới thiệu
                            </NavLink>
                        </li>
                        {renderProductsSubmenu()}
                        <li className="ng-scope">
                            <NavLink to="/news" onClick={toggleMenu}>
                                <i className="fas fa-newspaper"></i>
                                Tin tức
                            </NavLink>
                        </li>
                        <li className="ng-scope">
                            <NavLink to="/contact" onClick={toggleMenu}>
                                <i className="fas fa-phone-alt"></i>
                                Liên hệ
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        );
    };

    const renderSupportSection = () => {
        return (
            <ul className="mobile-support">
                <li>
                    <div className="drawer-text-support">Hỗ trợ</div>
                </li>
                <li>
                    <a href="tel:19006750">
                        <i className="fas fa-phone-alt"></i>
                        <span className="support-label">HOTLINE:</span>
                        <span className="support-value">19006750</span>
                    </a>
                </li>
                <li>
                    <a href="mailto:support@gmail.vn">
                        <i className="fas fa-envelope"></i>
                        <span className="support-label">Email:</span>
                        <span className="support-value">support@gmail.vn</span>
                    </a>
                </li>
            </ul>
        );
    };

    // ============ MAIN RENDER ============
    if (!isOpen) return null;

    return (
        <div className={`mobile-main-menu ${isOpen ? 'xyz' : ''}`}>
            <div className="drawer-header">
                <button
                    className="mobile-menu-close-btn"
                    onClick={toggleMenu}
                    aria-label="Đóng menu"
                >
                    <i className="fas fa-times"></i>
                </button>
                {renderDrawerHeader()}
            </div>
            {renderAuthMenu()}
            {renderNavigationMenu()}
            {renderSupportSection()}
        </div>
    );
}

export default MobileMenu;
