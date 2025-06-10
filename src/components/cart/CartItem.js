import React from 'react';
import { Link } from 'react-router-dom';

function CartItem({ item, onQuantityChange, onRemoveItem }) {
    const handleInputChange = (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            value = 1; // Hoặc giữ nguyên giá trị cũ nếu không muốn tự sửa
        }
        onQuantityChange(item.id, value);
    };

    const increment = () => {
        onQuantityChange(item.id, item.quantity + 1);
    };

    const decrement = () => {
        if (item.quantity > 1) {
            onQuantityChange(item.id, item.quantity - 1);
        }
    };

    return (
        <div className={`row cart-body-row cart-body-row-${item.id}`} style={{ alignItems: 'center' }}>
            <div className="col-md-11 col-10" style={{ textAlign: 'center' }}>
                <div className="row card-info" style={{ alignItems: 'center' }}>
                    <div className="col-md-2 col-12 card-info-img">
                        <Link to={item.productLink || `/product-detail/${item.id}`}>
                            <img className="cart-img" src={item.img} alt={item.name} />
                        </Link>
                    </div>
                    <div className="col-md-3 col-12">
                        <Link to={item.productLink || `/product-detail/${item.id}`} className="cart-name">
                            <h5>{item.name}</h5>
                        </Link>
                    </div>
                    <div className="col-md-2 col-12" style={{ fontSize: '16px' }}>
                        <span className="product-price-value">{item.price.toLocaleString('vi-VN')}</span>₫
                    </div>
                    <div className="col-md-3 col-12">
                        <div className="cart-quantity">
                            <input type="button" value="-" className="control" onClick={decrement} />
                            <input
                                type="text"
                                value={item.quantity}
                                className="text-input quantity-input"
                                id={`text_so_luong-${item.id}`}
                                onChange={handleInputChange}
                                onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                            />
                            <input type="button" value="+" className="control" onClick={increment} />
                        </div>
                    </div>
                    <div className="col-md-2 col-12 hidden-xs product-total-price" style={{ fontSize: '16px' }}>
                        <span>{(item.price * item.quantity).toLocaleString('vi-VN')}</span>₫
                    </div>
                </div>
            </div>
            <div className="col-md-1 col-2 text-right">
                <button onClick={() => onRemoveItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }}>
                    <i className="fas fa-trash"></i>
                </button>
            </div>
        </div>
    );
}

export default CartItem;