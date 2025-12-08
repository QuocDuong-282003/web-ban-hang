import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../../container/redux/userAuthSlice';
import { getCartAPI } from '../../container/services/userService';
import { logout } from '../../container/services/authService';
import { setCart, clearCart } from '../../components/store/actions/cartSlice';
import { useClientSideSearch } from '../../container/hooks/useClientSideSearch';
import Search from './Search/Search';
import AuthModal from '../auth/AuthModal';
import MobileMenu from './MobileMenu';
import { toast } from 'react-toastify';
import './Header.scss';
function Header() {
    const [showAuthModal, setShowAuthModal] = useState(false);
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
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State để control user dropdown menu
    const userMenuRef = useRef(null); // Ref để detect click outside

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

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);
    // ============ HÀM XỬ LÝ ĐĂNG XUẤT ============
    /**
     * Handle logout
     * Flow:
     * 1. Gọi API /api/auth/logout để clear HttpOnly cookie trên server
     * 2. Clear Redux state (user, token, isAuthenticated)
     * 3. Clear localStorage
     * 4. Clear cart (nếu có)
     * 5. Navigate về home
     * 
     * QUAN TRỌNG: Phải gọi API logout trước để clear cookie,
     * nếu không khi reload, AuthChecker sẽ tự động login lại vì cookie vẫn còn
     */
    const handleLogout = async () => {
        try {
            // Step 1: Gọi API logout để clear HttpOnly cookie trên server
            await logout();

            // Step 2: Clear Redux state và localStorage
            dispatch(userLogout());

            // Step 3: Clear cart
            dispatch(clearCart());

            // Step 4: Show success message
            toast.info("Bạn đã đăng xuất.");

            // Step 5: Navigate về home
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);

            // Ngay cả khi API logout fail, vẫn clear state và localStorage
            // để đảm bảo user được logout ở frontend
            dispatch(userLogout());
            dispatch(clearCart());

            toast.info("Bạn đã đăng xuất.");
            navigate('/');
        }
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
                                    <li
                                        ref={userMenuRef}
                                        className="nav-item nav-item__first nav-item__first-user"
                                    >
                                        <div
                                            className="nav-item__first-trigger"
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                gap: '8px'
                                            }}
                                        >
                                            <img
                                                src={user.avatar ? user.avatar : "/assets/img/product/noavatar.png"}
                                                alt=""
                                                className="nav-item__first-img"
                                            />
                                            <span className="nav-item__first-name">{user.name}</span>
                                            <i
                                                className={`fas fa-chevron-${isUserMenuOpen ? 'up' : 'down'}`}
                                                style={{
                                                    fontSize: '12px',
                                                    color: '#666',
                                                    transition: 'transform 0.2s ease'
                                                }}
                                            ></i>
                                        </div>

                                        {/* ĐÂY LÀ MENU DROPDOWN - Modern Design */}
                                        {isUserMenuOpen && (
                                            <ul className="nav-item__first-menu nav-item__first-menu--open">
                                                <li className="nav-item__first-item">
                                                    <Link
                                                        to="/account"
                                                        className="nav-item__first-link"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <i className="fas fa-user-circle"></i>
                                                        <span>Tài khoản của tôi</span>
                                                    </Link>
                                                </li>
                                                <li className="nav-item__first-item">
                                                    <Link
                                                        to="/account?tab=order"
                                                        className="nav-item__first-link nav-item__first-link--order"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        <i className="fas fa-shopping-bag"></i>
                                                        <span>Đơn mua</span>
                                                    </Link>
                                                </li>
                                                <li className="nav-item__first-item nav-item__first-item--separator"></li>
                                                {/* ===  NÚT ĐĂNG XUẤT === */}
                                                <li className="nav-item__first-item">
                                                    <button
                                                        onClick={() => {
                                                            setIsUserMenuOpen(false);
                                                            handleLogout();
                                                        }}
                                                        className="nav-item__first-link nav-item__first-link--logout"
                                                        style={{
                                                            width: '100%',
                                                            textAlign: 'left',
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: '10px 15px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <i className="fas fa-sign-out-alt"></i>
                                                        <span>Đăng xuất</span>
                                                    </button>
                                                </li>
                                            </ul>
                                        )}
                                    </li>
                                </ul>
                            ) : (
                                // GIAO DIỆN KHI CHƯA ĐĂNG NHẬP 
                                <ul className="header_link right m-auto">
                                    <li>
                                        <button
                                            onClick={() => setShowAuthModal(true)}
                                            style={{ all: 'unset', cursor: 'pointer', color: 'inherit' }}
                                        >
                                            <i className="fas fa-sign-in-alt mr-3"></i>Đăng nhập
                                        </button>
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
                                {isAuthenticated && user && (
                                    <Link to="/account" className="header__second__user--icon" style={{ marginRight: '10px' }}>
                                        <img
                                            src={user.avatar ? user.avatar : "/assets/img/product/noavatar.png"}
                                            alt="User"
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                borderRadius: '50%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </Link>
                                )}
                                <Link to="/cart" className="header__second__cart--icon">
                                    <i className="fas fa-shopping-cart"></i>
                                    {/* <span id="header__second__cart--notice" className="header__second__cart--notice">3</span>  */}
                                    {cartQuantity > 0 && <span className="header__second__cart--notice">{cartQuantity}</span>}
                                </Link>
                                <Link to="/wishlist" className="header__second__like--icon">
                                    <i className="far fa-heart"></i>
                                    {/* <span id="header__second__like--notice" className="header__second__like--notice">3</span>     */}
                                    {wishlistCount > 0 && <span className="header__second__like--notice">{wishlistCount}</span>}
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
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onGuestMode={() => {
                    toast.info('Bạn đang duyệt với tư cách khách');
                }}
            />
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={toggleMobileMenu}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} user={user} isAuthenticated={isAuthenticated} />
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