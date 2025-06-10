import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
//import './MobileMenu.css'; // Tạo file CSS riêng nếu cần

function MobileMenu({ isOpen, toggleMenu }) { // Nhận props để điều khiển
    const [openSubmenus, setOpenSubmenus] = useState({});

    const toggleSubmenu = (id, level) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [`${level}-${id}`]: !prev[`${level}-${id}`]
        }));
    };

    const hienthi = (index, id) => { // Tái sử dụng logic hienthi từ main.js
        // This function was complex and relied on direct DOM manipulation.
        // In React, we manage visibility with state.
        // The `cong` and `tru` icons are handled by the `openSubmenus` state.
        toggleSubmenu(id, `level${index}`); // Assuming id is unique for each submenu level
    }

    if (!isOpen) return null; // Không render gì nếu menu đóng

    return (
        <div className={`mobile-main-menu ${isOpen ? 'open' : ''}`}> {/* Thêm class 'open' nếu isOpen là true */}
            <div className="drawer-header">
                <Link to="/login" onClick={toggleMenu}> {/* Đóng menu khi click */}
                    <div className="drawer-header--auth">
                        <div className="_object">
                            <img src="./assets/img/product/giayxah2.jpg" alt="User avatar" />
                        </div>
                        <div className="_body">Đăng nhập
                            <br />Nhận nhiều ưu đãi hơn
                        </div>
                    </div>
                </Link>
            </div>
            <ul className="ul-first-menu">
                <li>
                    <Link to="/login" onClick={toggleMenu}>Đăng nhập</Link>
                </li>
                <li>
                    <Link to="/register" className="abc" onClick={toggleMenu}>Đăng kí</Link>
                </li>
            </ul>
            {/* Example for logged in user - Conditionally render this block */}
            {/* <ul className="ul-first-menu">
                <li><Link to="/account" onClick={toggleMenu}>Tài khoản của tôi</Link></li>
                <li><Link to="/account/addresses" onClick={toggleMenu}>Địạ chỉ của tôi</Link></li>
                <li><Link to="/account/orders" onClick={toggleMenu}>Đơn mua</Link></li>
                <li>
                    <Link to="/wishlist" className="list-like-noicte" onClick={toggleMenu}>Danh sách yêu thích</Link>
                    <span id="header__second__like--notice-mobile" className="header__second__like--notice">3</span>
                </li>
                <li><Link to="/logout" onClick={toggleMenu}>Đăng xuất</Link></li>
            </ul> */}
            <div className="la-scroll-fix-infor-user">
                <div className="la-nav-menu-items">
                    <div className="la-title-nav-items">
                        <strong>Danh mục</strong>
                    </div>
                    <ul className="la-nav-list-items">
                        <li className="ng-scope">
                            <NavLink to="/" onClick={toggleMenu}>Trang chủ</NavLink>
                        </li>
                        <li className="ng-scope">
                            <NavLink to="/intro" onClick={toggleMenu}>Giới thiệu</NavLink>
                        </li>
                        <li className={`ng-scope ng-has-child1 ${openSubmenus['level1-products'] ? 'open' : ''}`}>
                            <div onClick={() => hienthi(1, 'products')} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <NavLink to="/products" onClick={(e) => e.preventDefault()}>Sản phẩm</NavLink> {/* Prevent NavLink default and handle with parent div */}
                                <span>
                                    <i className={`fas ${openSubmenus['level1-products'] ? 'fa-minus' : 'fa-plus'} cong`}></i>
                                </span>
                            </div>
                            {openSubmenus['level1-products'] && (
                                <ul className="ul-has-child1">
                                    <li className={`ng-scope ng-has-child2 ${openSubmenus['level2-allproducts'] ? 'open' : ''}`}>
                                        <div onClick={() => hienthi(2, 'allproducts')} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <NavLink to="/products" onClick={toggleMenu}>Tất cả sản phẩm</NavLink>
                                            <span>
                                                <i className={`fas ${openSubmenus['level2-allproducts'] ? 'fa-minus' : 'fa-plus'} cong1`}></i>
                                            </span>
                                        </div>
                                        {openSubmenus['level2-allproducts'] && (
                                            <ul className="ul-has-child2" id="abc">
                                                <li className="ng-scope"><NavLink to="/products?type=football" onClick={toggleMenu}>Bóng đá</NavLink></li>
                                                {/* Add other sub-items */}
                                            </ul>
                                        )}
                                    </li>
                                    {/* Tương tự cho Quần áo, Giày dép, Phụ kiện */}
                                </ul>
                            )}
                        </li>
                        <li className="ng-scope">
                            <NavLink to="/news" onClick={toggleMenu}>Tin tức</NavLink>
                        </li>
                        <li className="ng-scope">
                            <NavLink to="/contact" onClick={toggleMenu}>Liên hệ</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
            <ul className="mobile-support">
                <li>
                    <div className="drawer-text-support">Hỗ trợ</div>
                </li>
                <li>
                    <i className="fas fa-phone-square-alt footer__item-icon">HOTLINE: </i>
                    <a href="tel:19006750">19006750</a>
                </li>
                <li>
                    <i className="fas fa-envelope-square footer__item-icon">Email: </i>
                    <a href="mailto:support@gmail.vn">support@gmail.vn</a>
                </li>
            </ul>
        </div>
    );
}

export default MobileMenu;