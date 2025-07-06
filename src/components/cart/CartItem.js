// import React from 'react';
// import { Link } from 'react-router-dom';

// function CartItem({ item, onQuantityChange, onRemoveItem }) {

//     const increment = () => {

//         onQuantityChange(item.cartItemId, item.quantity + 1);
//     };
//     const decrement = () => {
//         if (item.quantity > 1) {
//             onQuantityChange(item.cartItemId, item.quantity - 1);
//         }
//     };
//     const handleRemove = () => {
//         onRemoveItem(item.cartItemId, item.name);
//     };



//     return (

//         <div className={`row cart-body-row cart-body-row-${item.cartItemId}`} style={{ alignItems: 'center' }}>
//             <div className="col-md-11 col-10" style={{ textAlign: 'center' }}>
//                 <div className="row card-info" style={{ alignItems: 'center' }}>
//                     <div className="col-md-2 col-12 card-info-img">

//                         <Link to={`/products/${item.productId}`}>
//                             <img className="cart-img" src={item.image} alt={item.name} />
//                         </Link>
//                     </div>
//                     <div className="col-md-3 col-12">
//                         <Link to={`/products/${item.productId}`} className="cart-name">
//                             <h5>{item.name}</h5>

//                             {item.option && <small className="text-muted">Phân loại: {item.option}</small>}
//                         </Link>
//                     </div>
//                     <div className="col-md-2 col-12" style={{ fontSize: '16px' }}>
//                         <span className="product-price-value">{item.price.toLocaleString('vi-VN')}</span>₫
//                     </div>
//                     <div className="col-md-3 col-12">
//                         <div className="cart-quantity">

//                             <input type="button" value="-" className="control" onClick={decrement} disabled={item.quantity <= 1} />
//                             <input
//                                 type="text"
//                                 value={item.quantity}
//                                 className="text-input quantity-input"
//                                 id={`text_so_luong-${item.cartItemId}`}
//                                 readOnly
//                             />
//                             <input type="button" value="+" className="control" onClick={increment} disabled={item.quantity >= item.stock} />
//                         </div>
//                     </div>
//                     <div className="col-md-2 col-12 hidden-xs product-total-price" style={{ fontSize: '16px' }}>
//                         {/* SỬA LỖI: Dùng itemTotal từ API để đảm bảo tính đúng đắn */}
//                         <span>{(item.itemTotal).toLocaleString('vi-VN')}</span>₫
//                     </div>
//                 </div>
//             </div>
//             <div className="col-md-1 col-2 text-right">
//                 {/* SỬA LỖI: Gọi hàm handleRemove đã được tạo */}
//                 <button onClick={handleRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }}>
//                     <i className="fas fa-trash"></i>
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default CartItem;


// --- FILE: src/components/cart/CartItem.js (GIỮ NGUYÊN NHƯ CỦA BẠN) ---
// --- THAY THẾ TOÀN BỘ FILE: src/components/cart/CartItem.js ---

// --- FILE: src/components/cart/CartItem.js ---

import React from 'react';
import { Link } from 'react-router-dom';

function CartItem({ item, onQuantityChange, onRemoveItem, isUpdating, isSelected, onSelectItem }) {
    const increment = () => !isUpdating && onQuantityChange(item.cartItemId, item.quantity + 1);
    const decrement = () => !isUpdating && item.quantity > 1 && onQuantityChange(item.cartItemId, item.quantity - 1);
    const handleRemove = () => !isUpdating && onRemoveItem(item.cartItemId, item.name);
    const handleSelect = () => !isUpdating && onSelectItem(item.cartItemId);

    const itemStyle = isUpdating ? { opacity: 0.6, pointerEvents: 'none', position: 'relative' } : { position: 'relative' };
    const spinner = isUpdating && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#ee4d2d' }}></i>
        </div>
    );

    return (
        <div className={`row cart-body-row cart-body-row-${item.cartItemId}`} style={{ alignItems: 'center', ...itemStyle, padding: '1rem 0', borderBottom: '1px solid #eee' }}>
            {spinner}
            <div className="col-1 d-flex justify-content-center">
                <input type="checkbox" style={{ width: '18px', height: '18px' }} checked={isSelected} onChange={handleSelect} disabled={isUpdating} />
            </div>
            <div className="col-md-11 col-10" style={{ textAlign: 'center' }}>
                <div className="row card-info" style={{ alignItems: 'center' }}>
                    <div className="col-md-2 col-12 card-info-img">
                        <Link to={`/product-detail/${item.productId}`}>
                            <img className="cart-img" src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                        </Link>
                    </div>
                    <div className="col-md-3 col-12 text-left">
                        <Link to={`/product-detail/${item.productId}`} className="cart-name">
                            <h5 style={{ fontSize: '1rem', margin: 0 }}>{item.name}</h5>
                            {item.option && <small className="text-muted">Phân loại: {item.option}</small>}
                        </Link>
                    </div>
                    <div className="col-md-2 col-12" style={{ fontSize: '16px' }}>
                        <span className="product-price-value">{item.price.toLocaleString('vi-VN')}</span>₫
                    </div>
                    <div className="col-md-3 col-12">
                        <div className="cart-quantity">
                            <input type="button" value="-" className="control" onClick={decrement} disabled={isUpdating || item.quantity <= 1} />
                            <input type="text" value={item.quantity} className="text-input quantity-input" readOnly />
                            <input type="button" value="+" className="control" onClick={increment} disabled={isUpdating || item.quantity >= (item.stock || 99)} />
                        </div>
                    </div>
                    <div className="col-md-2 col-12 hidden-xs product-total-price" style={{ fontSize: '16px', color: '#ee4d2d', fontWeight: 'bold' }}>
                        <span>{(item.itemTotal || 0).toLocaleString('vi-VN')}</span>₫
                    </div>
                </div>
            </div>
            <div className="col-md-1 col-2 text-right">
                <button onClick={handleRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }} disabled={isUpdating}>
                    <i className="fas fa-trash"></i>
                </button>
            </div>
        </div>
    );
}

export default CartItem;