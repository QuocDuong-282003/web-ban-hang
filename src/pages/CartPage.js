import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';
import CartItem from '../components/cart/CartItem'; // Component con
import { Link } from 'react-router-dom';
// import './CartPage.css'; // CSS riêng

// Dữ liệu giỏ hàng mẫu (trong thực tế sẽ lấy từ state/context/localStorage)
const initialCartItems = [
    { id: 1, name: 'ÁO THỦ MÔN ĐTVN 2021 GRAND SPORT - 038-322 - VÀNG CAM', price: 625000, quantity: 1, img: './assets/img/product/addidas1.jpg', productLink: '/product-detail/1' },
    { id: 2, name: 'ADIDAS STAN SMITH NAM NỮ', price: 790000, quantity: 2, img: './assets/img/product/stansmith.jpg', productLink: '/product-detail/2' },
    { id: 3, name: 'NIKE AIR ZOOM PEGASUS', price: 1250000, quantity: 1, img: './assets/img/product/giayxanh.jpg', productLink: '/product-detail/3' }
];

function CartPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price * item.quantity;
        });
        setTotalPrice(total);
    }, [cartItems]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleQuantityChange = (itemId, newQuantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
            )
        );
    };

    const handleRemoveItem = (itemId) => {
        if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        }
    };

    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={isMobileMenuOpen ? toggleMobileMenu : null}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="cart">
                <div className="container">
                    <div className="cart-wrap">
                        <div className="cart-content">
                            {cartItems.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                                    <h2>Giỏ hàng của bạn đang trống!</h2>
                                    <Link to="/products" className="btn btn-primary mt-3">Tiếp tục mua sắm</Link>
                                </div>
                            ) : (
                                <form className="form-cart">
                                    <div className="cart-body-left">
                                        <div className="cart-heding hidden-xs">
                                            <div className="row cart-row">
                                                <div className="col-11" style={{ textAlign: 'center' }}>
                                                    <div className="row">
                                                        <div className="col-5">Sản phẩm</div>
                                                        <div className="col-2">Đơn giá</div>
                                                        <div className="col-3">Số lượng</div>
                                                        <div className="col-2">Thành tiền</div>
                                                    </div>
                                                </div>
                                                <div className="col-1"></div>
                                            </div>
                                        </div>
                                        <div className="cart-body">
                                            {cartItems.map(item => (
                                                <CartItem
                                                    key={item.id}
                                                    item={item}
                                                    onQuantityChange={handleQuantityChange}
                                                    onRemoveItem={handleRemoveItem}
                                                />
                                            ))}
                                        </div>
                                        <div className="cart-footer">
                                            <div className="row cart-footer-row">
                                                <div className="col-1 d-none d-md-block"></div>
                                                <div className="col-md-11 col-12 continue">
                                                    <Link to="/products">
                                                        <i className="fas fa-chevron-left"></i>
                                                        Tiếp tục mua sắm
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cart-body-right">
                                        <div className="cart-total">
                                            <label>Thành tiền:</label>
                                            <span className="total__price">{totalPrice.toLocaleString('vi-VN')}₫</span>
                                        </div>
                                        <div className="cart-buttons">
                                            <Link style={{ display: 'block', textAlign: 'center' }} to="/pay" className="chekout">THANH TOÁN</Link>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <GoToTop />
        </div>
    );
}

export default CartPage;