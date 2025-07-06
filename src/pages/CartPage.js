// --- THAY THẾ TOÀN BỘ FILE: src/pages/CartPage/CartPage.js ---

// import React, { useState, useEffect, useMemo } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Header from '../components/common/Header';
// import Footer from '../components/common/Footer';
// import MobileMenu from '../components/common/MobileMenu';
// import GoToTop from '../components/common/GoToTop';
// import CartItem from '../components/cart/CartItem';
// import { toast } from 'react-toastify';
// import { getCartAPI, updateCart, deleteCart } from '../container/services/userService';

// function CartPage() {
//     const navigate = useNavigate();
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//     // Khởi tạo state an toàn để không bao giờ bị lỗi 'undefined'
//     const [cart, setCart] = useState({ items: [], subtotal: 0 });

//     // Tách biệt state loading
//     const [isPageLoading, setIsPageLoading] = useState(true);
//     const [updatingItemId, setUpdatingItemId] = useState(null);

//     const [selectedItems, setSelectedItems] = useState([]);

//     useEffect(() => {
//         const fetchInitialCart = async () => {
//             setIsPageLoading(true);
//             try {
//                 const res = await getCartAPI();
//                 if (res && res.data) {
//                     setCart(res.data);
//                     setSelectedItems(res.data.items.map(item => item.cartItemId));
//                 }
//             } catch (error) {
//                 toast.error(error.response?.data?.message || "Không thể tải giỏ hàng.");
//             } finally {
//                 setIsPageLoading(false);
//             }
//         };
//         fetchInitialCart();
//     }, []);

//     const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//     // *** ĐÂY LÀ PHẦN SỬA LỖI QUAN TRỌNG NHẤT ***
//     const handleQuantityChange = async (cartItemId, newQuantity) => {
//         setUpdatingItemId(cartItemId); // 1. Báo cho giao diện biết là đang loading
//         try {
//             // 2. Gọi API và chờ kết quả. API của bạn phải trả về giỏ hàng mới nhất
//             const res = await updateCart(cartItemId, { quantity: newQuantity });

//             // 3. Dùng kết quả từ API để cập nhật giao diện.
//             // Cách này đảm bảo cả số lượng và tổng tiền đều được cập nhật đúng và không bị chớp.
//             if (res && res.data) {
//                 setCart(res.data);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Lỗi khi cập nhật số lượng.");
//             // Chỉ trong trường hợp có lỗi, mới fetch lại để đồng bộ
//             const res = await getCartAPI();
//             if (res && res.data) setCart(res.data);
//         } finally {
//             setUpdatingItemId(null); // 4. Tắt loading
//         }
//     };

//     const handleRemoveItem = async (cartItemId, itemName) => {
//         if (window.confirm(`Bạn có chắc muốn xóa "${itemName}" khỏi giỏ hàng?`)) {
//             setUpdatingItemId(cartItemId);
//             try {
//                 const res = await deleteCart(cartItemId);
//                 toast.success(`Đã xóa "${itemName}" khỏi giỏ hàng.`);
//                 if (res && res.data) {
//                     setCart(res.data);
//                     setSelectedItems(prev => prev.filter(id => id !== cartItemId));
//                 }
//             } catch (error) {
//                 toast.error(error.response?.data?.message || "Lỗi khi xóa sản phẩm.");
//                 const res = await getCartAPI();
//                 if (res && res.data) setCart(res.data);
//             } finally {
//                 setUpdatingItemId(null);
//             }
//         }
//     };

//     // ... (Các hàm handleSelect và handleCheckout giữ nguyên như cũ)
//     const handleSelectItem = (cartItemId) => {
//         setSelectedItems(prevSelected =>
//             prevSelected.includes(cartItemId)
//                 ? prevSelected.filter(id => id !== cartItemId)
//                 : [...prevSelected, cartItemId]
//         );
//     };

//     const handleSelectAll = (e) => {
//         if (e.target.checked) {
//             if (cart && cart.items) setSelectedItems(cart.items.map(item => item.cartItemId));
//         } else {
//             setSelectedItems([]);
//         }
//     };

//     const { totalSelectedPrice, totalSelectedItemsCount } = useMemo(() => {
//         if (!cart || !cart.items) return { totalSelectedPrice: 0, totalSelectedItemsCount: 0 };
//         const total = cart.items
//             .filter(item => selectedItems.includes(item.cartItemId))
//             .reduce((sum, item) => sum + (item.itemTotal || 0), 0);
//         return { totalSelectedPrice: total, totalSelectedItemsCount: selectedItems.length };
//     }, [cart, selectedItems]);

//     const handleCheckout = () => {
//         if (selectedItems.length === 0) {
//             toast.warn("Vui lòng chọn sản phẩm để thanh toán.");
//             return;
//         }
//         const itemsToCheckout = cart.items.filter(item => selectedItems.includes(item.cartItemId));
//         sessionStorage.setItem('checkout_items', JSON.stringify(itemsToCheckout));
//         navigate('/pay');
//     };


//     if (isPageLoading) {
//         return <div><Header /><div className="text-center p-5">Đang tải giỏ hàng...</div><Footer /></div>;
//     }

//     return (
//         <div>
//             {/* Giữ nguyên toàn bộ JSX của bạn, chỉ truyền thêm props xuống CartItem */}
//             <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={toggleMobileMenu}></div>
//             <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
//             <Header />

//             <div className="cart">
//                 <div className="container">
//                     <div className="cart-wrap">
//                         <div className="cart-content">
//                             {!cart || !cart.items || cart.items.length === 0 ? (
//                                 <div style={{ textAlign: 'center', padding: '50px 0' }}>
//                                     <h2>Giỏ hàng của bạn đang trống!</h2>
//                                     <Link to="/products" className="btn btn-primary mt-3">Tiếp tục mua sắm</Link>
//                                 </div>
//                             ) : (
//                                 <div className="form-cart" >
//                                     <div className="cart-body-left">
//                                         <div className="cart-heding hidden-xs">
//                                             <div className="row cart-row" style={{ alignItems: 'center' }}>
//                                                 <div className="col-1 d-flex justify-content-center">
//                                                     <input
//                                                         type="checkbox"
//                                                         style={{ width: '18px', height: '18px' }}
//                                                         onChange={handleSelectAll}
//                                                         checked={cart.items.length > 0 && selectedItems.length === cart.items.length}
//                                                     />
//                                                 </div>
//                                                 <div className="col-11" style={{ textAlign: 'center' }}>
//                                                     <div className="row">
//                                                         <div className="col-5">Sản phẩm</div>
//                                                         <div className="col-2">Đơn giá</div>
//                                                         <div className="col-3">Số lượng</div>
//                                                         <div className="col-2">Thành tiền</div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-1"></div>
//                                             </div>
//                                         </div>
//                                         <div className="cart-body">
//                                             {cart.items.map(item => (
//                                                 <CartItem
//                                                     key={item.cartItemId}
//                                                     item={item}
//                                                     onQuantityChange={handleQuantityChange}
//                                                     onRemoveItem={handleRemoveItem}
//                                                     onSelectItem={handleSelectItem}
//                                                     isSelected={selectedItems.includes(item.cartItemId)}
//                                                     isUpdating={updatingItemId === item.cartItemId}
//                                                 />
//                                             ))}
//                                         </div>
//                                         <div className="cart-footer">
//                                             <div className="row cart-footer-row">
//                                                 <div className="col-1 d-none d-md-block"></div>
//                                                 <div className="col-md-11 col-12 continue">
//                                                     <Link to="/products">
//                                                         <i className="fas fa-chevron-left"></i>
//                                                         Tiếp tục mua sắm
//                                                     </Link>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="cart-body-right">
//                                         <div className="cart-total">
//                                             <label>Tổng thanh toán ({totalSelectedItemsCount} sản phẩm):</label>
//                                             <span className="total__price">{totalSelectedPrice.toLocaleString('vi-VN')}₫</span>
//                                         </div>
//                                         <div className="cart-buttons">
//                                             <button
//                                                 type="button"
//                                                 className="chekout"
//                                                 onClick={handleCheckout}
//                                                 disabled={selectedItems.length === 0}
//                                             >
//                                                 THANH TOÁN
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <Footer />
//             <GoToTop />
//         </div>
//     );
// }

// export default CartPage;


// --- THAY THẾ TOÀN BỘ FILE: src/pages/CartPage/CartPage.js ---

// import React, { useState, useEffect } from 'react';
// import Header from '../components/common/Header';
// import Footer from '../components/common/Footer';
// import MobileMenu from '../components/common/MobileMenu';
// import GoToTop from '../components/common/GoToTop';
// import CartItem from '../components/cart/CartItem'; // Đảm bảo bạn đã import file này
// import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
// import { toast } from 'react-toastify';
// import { getCartAPI, updateCart, deleteCart } from '../container/services/userService';

// function CartPage() {
//     const navigate = useNavigate();
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [cart, setCart] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     // State cho checkbox, giữ nguyên
//     const [selectedItems, setSelectedItems] = useState([]);

//     // Hàm fetchCart giữ nguyên như của bạn
//     const fetchCart = async () => {
//         try {
//             // Không set isLoading ở đây nữa để tránh chớp khi fetch lại
//             const res = await getCartAPI();
//             setCart(res.data);
//             // Mặc định chọn tất cả khi tải lần đầu
//             if (res.data && res.data.items) {
//                 setSelectedItems(res.data.items.map(item => item.cartItemId));
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Không thể tải giỏ hàng.");
//             setCart({ items: [], subtotal: 0 });
//         } finally {
//             if (isLoading) setIsLoading(false); // Chỉ tắt loading lần đầu
//         }
//     };

//     useEffect(() => {
//         setIsLoading(true);
//         fetchCart();
//     }, []);

//     const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//     // *** SỬA LỖI TẠI ĐÂY: CẬP NHẬT TỔNG TIỀN ***
//     const handleQuantityChange = async (cartItemId, newQuantity) => {
//         // 1. Cập nhật giao diện với số lượng mới VÀ TÍNH LẠI TỔNG TIỀN
//         if (cart) {
//             let newSubtotal = 0;
//             const updatedItems = cart.items.map(item => {
//                 let currentItem = { ...item };
//                 if (item.cartItemId === cartItemId) {
//                     currentItem.quantity = newQuantity;
//                     currentItem.itemTotal = currentItem.price * newQuantity;
//                 }
//                 newSubtotal += currentItem.itemTotal;
//                 return currentItem;
//             });

//             // Cập nhật cả items và subtotal
//             setCart({ ...cart, items: updatedItems, subtotal: newSubtotal });
//         }

//         // 2. Gọi API để cập nhật ở server (không cần chờ)
//         try {
//             await updateCart(cartItemId, { quantity: newQuantity });
//         } catch (error) {
//             toast.error("Có lỗi xảy ra, đang đồng bộ lại giỏ hàng.");
//             fetchCart(); // Nếu có lỗi ở server, fetch lại để đảm bảo dữ liệu đúng
//         }
//     };

//     // Sửa lại hàm xóa để nó cũng cập nhật lại tổng tiền
//     const handleRemoveItem = async (cartItemId, itemName) => {
//         if (window.confirm(`Bạn có chắc muốn xóa "${itemName}" khỏi giỏ hàng?`)) {
//             if (cart) {
//                 let newSubtotal = 0;
//                 const updatedItems = cart.items.filter(item => {
//                     if (item.cartItemId === cartItemId) return false;
//                     newSubtotal += item.itemTotal;
//                     return true;
//                 });
//                 setCart({ ...cart, items: updatedItems, subtotal: newSubtotal });
//                 setSelectedItems(prev => prev.filter(id => id !== cartItemId));
//             }

//             try {
//                 await deleteCart(cartItemId);
//                 toast.success(`Đã xóa "${itemName}" khỏi giỏ hàng.`);
//             } catch (error) {
//                 toast.error("Có lỗi xảy ra, đang đồng bộ lại giỏ hàng.");
//                 fetchCart();
//             }
//         }
//     };

//     // Các hàm cho checkbox
//     const handleSelectItem = (cartItemId) => {
//         setSelectedItems(prev => prev.includes(cartItemId) ? prev.filter(id => id !== cartItemId) : [...prev, cartItemId]);
//     };

//     const handleSelectAll = (e) => {
//         if (e.target.checked) {
//             if (cart) setSelectedItems(cart.items.map(item => item.cartItemId));
//         } else {
//             setSelectedItems([]);
//         }
//     };

//     // Tính tổng tiền cho các item đã chọn
//     const totalSelectedPrice = React.useMemo(() => {
//         if (!cart || !cart.items) return 0;
//         return cart.items
//             .filter(item => selectedItems.includes(item.cartItemId))
//             .reduce((sum, item) => sum + (item.itemTotal || 0), 0);
//     }, [cart, selectedItems]);


//     const handleCheckout = () => {
//         if (selectedItems.length === 0) {
//             toast.warn("Vui lòng chọn sản phẩm để thanh toán.");
//             return;
//         }
//         const itemsToCheckout = cart.items.filter(item => selectedItems.includes(item.cartItemId));
//         sessionStorage.setItem('buy_now_item', JSON.stringify(itemsToCheckout));
//         navigate('/pay');
//     };


//     if (isLoading) {
//         return <div><Header /><div className="text-center p-5">Đang tải giỏ hàng...</div><Footer /></div>;
//     }

//     return (
//         <div>
//             <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={toggleMobileMenu}></div>
//             <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
//             <Header />

//             <div className="cart">
//                 <div className="container">
//                     <div className="cart-wrap">
//                         <div className="cart-content">
//                             {!cart || cart.items.length === 0 ? (
//                                 <div style={{ textAlign: 'center', padding: '50px 0' }}>
//                                     <h2>Giỏ hàng của bạn đang trống!</h2>
//                                     <Link to="/products" className="btn btn-primary mt-3">Tiếp tục mua sắm</Link>
//                                 </div>
//                             ) : (
//                                 <div className="form-cart" >
//                                     <div className="cart-body-left">
//                                         <div className="cart-heding hidden-xs">
//                                             <div className="row cart-row" style={{ alignItems: 'center' }}>
//                                                 <div className="col-1 d-flex justify-content-center">
//                                                     <input
//                                                         type="checkbox"
//                                                         style={{ width: '18px', height: '18px' }}
//                                                         onChange={handleSelectAll}
//                                                         checked={cart.items.length > 0 && selectedItems.length === cart.items.length}
//                                                     />
//                                                 </div>
//                                                 <div className="col-11" style={{ textAlign: 'center' }}>
//                                                     <div className="row">
//                                                         <div className="col-4">Sản phẩm</div>
//                                                         <div className="col-2">Đơn giá</div>
//                                                         <div className="col-3">Số lượng</div>
//                                                         <div className="col-2">Thành tiền</div>
//                                                         <div className="col-1"></div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="cart-body">
//                                             {cart.items.map(item => (
//                                                 <CartItem
//                                                     key={item.cartItemId}
//                                                     item={item}
//                                                     onQuantityChange={handleQuantityChange}
//                                                     onRemoveItem={handleRemoveItem}
//                                                     onSelectItem={handleSelectItem}
//                                                     isSelected={selectedItems.includes(item.cartItemId)}
//                                                 />
//                                             ))}
//                                         </div>
//                                         <div className="cart-footer">
//                                             {/*...*/}
//                                         </div>
//                                     </div>
//                                     <div className="cart-body-right">
//                                         <div className="cart-total">
//                                             <label>Tổng thanh toán ({selectedItems.length} sản phẩm):</label>
//                                             <span className="total__price">{totalSelectedPrice.toLocaleString('vi-VN')}₫</span>
//                                         </div>
//                                         <div className="cart-buttons">
//                                             <button
//                                                 type="button"
//                                                 className="chekout"
//                                                 onClick={handleCheckout}
//                                                 disabled={selectedItems.length === 0}
//                                             >
//                                                 THANH TOÁN
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <Footer />
//             <GoToTop />
//         </div>
//     );
// }

// export default CartPage;




// --- THAY THẾ TOÀN BỘ FILE: src/pages/CartPage/CartPage.js ---

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

    // 1. Tách hàm fetchCart ra riêng để có thể gọi lại bất cứ lúc nào
    const fetchCart = async () => {
        try {
            const res = await getCartAPI();
            if (res && res.data && res.data.items) {
                setCart(res.data);
                // Giữ lại các item đã được chọn trước đó, nếu không thì chọn tất cả
                setSelectedItems(prevSelected => {
                    const currentItemIds = res.data.items.map(item => item.cartItemId);
                    // Chỉ giữ lại những lựa chọn vẫn còn trong giỏ hàng
                    const validSelections = prevSelected.filter(id => currentItemIds.includes(id));
                    // Nếu là lần tải đầu tiên (chưa có lựa chọn nào), chọn tất cả
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
            setCart({ items: [], subtotal: 0 }); // Đặt giỏ hàng thành rỗng nếu có lỗi
        }
    };

    // Tải giỏ hàng lần đầu khi component được mount
    useEffect(() => {
        const loadInitialData = async () => {
            setIsPageLoading(true);
            await fetchCart();
            setIsPageLoading(false);
        };
        loadInitialData();
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // 2. Sửa lại handleQuantityChange để tuân thủ "Quy Tắc Vàng"
    const handleQuantityChange = async (cartItemId, newQuantity) => {
        setUpdatingItemId(cartItemId);
        try {
            // Chỉ cần gọi API để cập nhật trên server
            await updateCart(cartItemId, { quantity: newQuantity });
            // Sau khi server cập nhật thành công, TẢI LẠI TOÀN BỘ GIỎ HÀNG để đồng bộ
            await fetchCart();
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi cập nhật số lượng.");
            // Nếu có lỗi, cũng nên tải lại giỏ hàng để đảm bảo UI đúng với trạng thái cuối cùng trên server
            await fetchCart();
        } finally {
            setUpdatingItemId(null);
        }
    };

    // 3. Sửa lại handleRemoveItem tương tự
    const handleRemoveItem = async (cartItemId, itemName) => {
        if (window.confirm(`Bạn có chắc muốn xóa "${itemName}" khỏi giỏ hàng?`)) {
            setUpdatingItemId(cartItemId);
            try {
                await deleteCart(cartItemId);
                toast.success(`Đã xóa "${itemName}" khỏi giỏ hàng.`);
                // Sau khi xóa thành công, TẢI LẠI TOÀN BỘ GIỎ HÀNG
                await fetchCart();
            } catch (error) {
                toast.error(error.response?.data?.message || "Lỗi khi xóa sản phẩm.");
            } finally {
                setUpdatingItemId(null);
            }
        }
    };

    // Các hàm xử lý checkbox (giữ nguyên, chúng hoạt động trên state đã được đồng bộ)
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

    // Hàm tính tổng tiền (giữ nguyên)
    const { totalSelectedPrice, totalSelectedItemsCount } = useMemo(() => {
        if (!cart || !cart.items) return { totalSelectedPrice: 0, totalSelectedItemsCount: 0 };
        const total = cart.items
            .filter(item => selectedItems.includes(item.cartItemId))
            .reduce((sum, item) => sum + (item.itemTotal || 0), 0);
        return { totalSelectedPrice: total, totalSelectedItemsCount: selectedItems.length };
    }, [cart, selectedItems]);

    // Hàm thanh toán (giữ nguyên, giờ nó sẽ luôn có dữ liệu đúng)
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

    // --- PHẦN JSX GIỮ NGUYÊN ---
    if (isPageLoading) {
        return <div><Header /><div className="text-center p-5">Đang tải giỏ hàng...</div><Footer /></div>;
    }

    return (
        <div>
            {/* ... MobileMenu, Header ... */}
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