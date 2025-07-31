

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';
import CartItem from '../components/cart/CartItem';
import { toast } from 'react-toastify';
import { getCartAPI, updateCart, deleteCart } from '../container/services/userService';

function CartPage() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [cart, setCart] = useState({ items: [], subtotal: 0 });
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [updatingItemId, setUpdatingItemId] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const fetchCart = async () => {
        try {
            const res = await getCartAPI();
            if (res && res.data && res.data.items) {
                setCart(res.data);
                setSelectedItems(prevSelected => {
                    const currentItemIds = res.data.items.map(item => item.cartItemId);
                    const validSelections = prevSelected.filter(id => currentItemIds.includes(id));
                    if (validSelections.length === 0 && prevSelected.length === 0) {
                        return currentItemIds;
                    }
                    return validSelections;
                });
            } else {
                setCart({ items: [], subtotal: 0 });
                setSelectedItems([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể tải giỏ hàng.");
            setCart({ items: [], subtotal: 0 });
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setIsPageLoading(true);
            await fetchCart();
            setIsPageLoading(false);
        };
        loadInitialData();
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleQuantityChange = async (cartItemId, newQuantity) => {
        setUpdatingItemId(cartItemId);
        try {
            await updateCart(cartItemId, { quantity: newQuantity });
            await fetchCart();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi cập nhật số lượng.");
            await fetchCart();
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleRemoveItem = async (cartItemId, itemName) => {
        if (window.confirm(`Bạn có chắc muốn xóa "${itemName}" khỏi giỏ hàng?`)) {
            setUpdatingItemId(cartItemId);
            try {
                await deleteCart(cartItemId);
                toast.success(`Đã xóa "${itemName}" khỏi giỏ hàng.`);
                await fetchCart();
            } catch (error) {
                toast.error(error.response?.data?.message || "Lỗi khi xóa sản phẩm.");
            } finally {
                setUpdatingItemId(null);
            }
        }
    };

    const handleSelectItem = (cartItemId) => {
        setSelectedItems(prevSelected =>
            prevSelected.includes(cartItemId)
                ? prevSelected.filter(id => id !== cartItemId)
                : [...prevSelected, cartItemId]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            if (cart && cart.items) setSelectedItems(cart.items.map(item => item.cartItemId));
        } else {
            setSelectedItems([]);
        }
    };

    const { totalSelectedPrice, totalSelectedItemsCount } = useMemo(() => {
        if (!cart || !cart.items) return { totalSelectedPrice: 0, totalSelectedItemsCount: 0 };
        const total = cart.items
            .filter(item => selectedItems.includes(item.cartItemId))
            .reduce((sum, item) => sum + (item.itemTotal || 0), 0);
        return { totalSelectedPrice: total, totalSelectedItemsCount: selectedItems.length };
    }, [cart, selectedItems]);

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            toast.warn("Vui lòng chọn sản phẩm để thanh toán.");
            return;
        }
        const itemsToCheckout = cart.items.filter(item => selectedItems.includes(item.cartItemId));
        if (itemsToCheckout.length === 0) {
            toast.error("Lỗi: Không tìm thấy sản phẩm đã chọn. Vui lòng thử lại.");
            return;
        }
        sessionStorage.setItem('checkout_items', JSON.stringify(itemsToCheckout));
        navigate('/pay');
    };

    if (isPageLoading) {
        return <div><Header /><div className="text-center p-5">Đang tải giỏ hàng...</div><Footer /></div>;
    }

    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={toggleMobileMenu}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="cart">
                <div className="container">
                    <div className="cart-wrap">
                        <div className="cart-content">
                            {!cart || !cart.items || cart.items.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                                    <h2>Giỏ hàng của bạn đang trống!</h2>
                                    <Link to="/products" className="btn btn-primary mt-3">Tiếp tục mua sắm</Link>
                                </div>
                            ) : (


                                <div className="form-cart" >
                                    <div className="cart-main" style={{ display: 'flex', gap: '2rem' }}>
                                        <div className="cart-body-left" style={{ flex: '1' }}>
                                            <div className="cart-heding hidden-xs">
                                                <div className="row cart-row" style={{ alignItems: 'center' }}>
                                                    <div className="col-1 d-flex justify-content-center">
                                                        <input
                                                            type="checkbox"
                                                            style={{ width: '18px', height: '18px' }}
                                                            onChange={handleSelectAll}
                                                            checked={cart.items.length > 0 && selectedItems.length === cart.items.length}
                                                        />
                                                    </div>
                                                    <div className="col-11" style={{ textAlign: 'center' }}>
                                                        <div className="row">
                                                            <div className="col-5">Sản phẩm</div>
                                                            <div className="col-2">Đơn giá</div>
                                                            <div className="col-3">Số lượng</div>
                                                            <div className="col-2">Thành tiền</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="cart-body">
                                                {cart.items.map(item => (
                                                    <CartItem
                                                        key={item.cartItemId}
                                                        item={item}
                                                        onQuantityChange={handleQuantityChange}
                                                        onRemoveItem={handleRemoveItem}
                                                        onSelectItem={handleSelectItem}
                                                        isSelected={selectedItems.includes(item.cartItemId)}
                                                        isUpdating={updatingItemId === item.cartItemId}
                                                    />
                                                ))}
                                            </div>
                                        </div>


                                        <div className="cart-body-right" style={{ width: '320px' }}>
                                            <div className="cart-total">
                                                <label>Tổng thanh toán ({totalSelectedItemsCount} sản phẩm):</label>
                                                <span className="total__price">{totalSelectedPrice.toLocaleString('vi-VN')}₫</span>
                                            </div>
                                            <div className="cart-buttons">
                                                <button
                                                    type="button"
                                                    className="chekout"
                                                    onClick={handleCheckout}
                                                    disabled={selectedItems.length === 0 || updatingItemId !== null}
                                                >
                                                    THANH TOÁN
                                                </button>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="cart-footer" style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
                                        <div className="row cart-footer-row">
                                            <div className="col-12 continue">
                                                <Link to="/products" style={{ textDecoration: 'none' }}>
                                                    <i className="fas fa-chevron-left" style={{ marginRight: '8px' }}></i>
                                                    Tiếp tục mua sắm
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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