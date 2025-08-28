import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../../container/redux/userAuthSlice';
import { getCartAPI } from '../../container/services/userService';
import { setCart, clearCart } from '../../components/store/actions/cartSlice';
import { useClientSideSearch } from '../../container/hooks/useClientSideSearch';
import Search from './Search/Search';
import { toast } from 'react-toastify';
import './Header.scss';
function Header() {
    // Lấy trạng thái đăng nhập (isAuthenticated) và thông tin user từ Redux
    const { isAuthenticated, user } = useSelector(state => state.userAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartQuantity = useSelector(state => state.cart.totalQuantity);
    const wishlistCount = useSelector(state => state.wishlist.itemIds.length);
    // State cho mobile menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Tạo một biến để kiểm tra xem component còn tồn tại không
        // Tránh lỗi "Can't perform a React state update on an unmounted component"
        let isMounted = true;

        const syncCartWithBackend = async () => {
            if (isAuthenticated) {
                try {
                    const response = await getCartAPI();
                    // Chỉ dispatch nếu component vẫn còn trên cây DOM và có dữ liệu
                    if (isMounted && response && response.data) {
                        dispatch(setCart(response.data));
                    }
                } catch (error) {
                    // Không làm gì cả, chỉ log lỗi. Không để lỗi này làm crash app.
                    console.error("Failed to sync cart on mount:", error.response?.data?.message || error.message);
                }
            }
        };

        syncCartWithBackend();

        // Hàm dọn dẹp (cleanup function) của useEffect
        // Sẽ chạy khi component bị unmount
        return () => {
            isMounted = false;
        };
    }, [isAuthenticated, dispatch]);
    // HÀM XỬ LÝ ĐĂNG XUẤT
    const handleLogout = () => {

        dispatch(userLogout());

        toast.info("Bạn đã đăng xuất.");

        navigate('/');
    };
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="header">
            <div className="container">
                <div className="top-link clearfix hidden-sm hidden-xs">
                    <div className="row">
                        <div className="col-6 social_link">

                            <div className="social-title">Theo dõi: </div>
                            <a href="https://www.facebook.com/zeroryo25/" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook" style={{ fontSize: '24px', marginRight: '10px' }}></i></a>
                        </div>
                        <div className="col-6 login_link">

                            {isAuthenticated && user ? (
                                // GIAO DIỆN KHI  ĐĂNG NHẬP
                                <ul className="nav nav__first right">
                                    <li className="nav-item nav-item__first nav-item__first-user">
                                        <img
                                            src={user.avatar ? user.avatar : "/assets/img/product/noavatar.png"}
                                            alt=""
                                            className="nav-item__first-img"
                                        />
                                        <span className="nav-item__first-name">{user.name}</span>

                                        {/* ĐÂY LÀ MENU DROPDOWN */}
                                        <ul className="nav-item__first-menu">
                                            <li className="nav-item__first-item">
                                                <Link to="/account">Tài khoản của tôi</Link>
                                            </li>
                                            <li className="nav-item__first-item">
                                                <Link to="/account?tab=order">Đơn mua</Link>
                                            </li>

                                            {/* ===  NÚT ĐĂNG XUẤT === */}
                                            <li className="nav-item__first-item">
                                                <button
                                                    onClick={handleLogout}
                                                    className="btn-logout"
                                                    style={{ all: 'unset', cursor: 'pointer', width: '100%', padding: '5px 15px', textAlign: 'left', background: 'none', border: 'none', color: 'white' }}
                                                >
                                                    Đăng xuất
                                                </button>
                                            </li>

                                        </ul>
                                    </li>
                                </ul>
                            ) : (
                                // GIAO DIỆN KHI CHƯA ĐĂNG NHẬP 
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
                                    {/* <span id="header__second__cart--notice" className="header__second__cart--notice">3</span>  */}
                                    {cartQuantity > 0 && <span className="header__second__cart--notice">{cartQuantity}</span>}
                                </Link>
                                <Link to="/wishlist" className="header__second__like--icon">
                                    <i className="far fa-heart"></i>
                                    {/* <span id="header__second__like--notice" className="header__second__like--notice">3</span>     */}
                                    {wishlistCount > 0 && <span className="header__second__like--notice">{{ wishlistCount }}</span>}
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6 m-auto pdt15 search-product">
                            {/* <form className="example" action="/products" onSubmit={handleSearchSubmit}>
                                <input type="text" className="input-search"
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Tìm kiếm.." name="search" />
                                <button type="submit" className="search-btn"><i className="fa fa-search"></i></button>
                            </form> */}
                            <Search />
                        </div>

                        {/* <div className="search-product-shopee">
                            <form className="search-form" action="/products" onSubmit={(e) => { /* handle submit >
                                <input type="text" className="search-input" name="search" placeholder="Tìm sản phẩm, thương hiệu và tên shop..." />
                                <button type="submit" className="search-button">
                                    <i className="fa fa-search"></i>
                                </button>
                            </form>
                        </div> */}

                        <div className="col-3 m-auto hidden-sm hidden-xs">
                            <div className="item-car clearfix">
                                <Link to="/cart" className="header__second__cart--icon">
                                    <i className="fas fa-shopping-cart"></i>
                                    {cartQuantity > 0 && <span className="header__second__like--notice">{cartQuantity}</span>}
                                </Link>
                            </div>
                            <div className="item-like clearfix">
                                <Link to="/wishlist" className="header__second__like--icon">
                                    <i className="far fa-heart"></i>
                                    {/* SỬA LẠI ĐỂ HIỂN THỊ wishlistCount MỘT CÁCH ĐỘNG */}
                                    {wishlistCount > 0 && <span id="header__second__like--notice-desktop" className="header__second__like--notice">{wishlistCount}</span>}
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
                                            <span className="hmega">Giày, dép</span>
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