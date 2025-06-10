import React from 'react';
import { Link } from 'react-router-dom';

function ProductItem({ product, onQuickView }) {
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const renderStars = (rating) => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<i key={i} className="home-product-item__star--gold fas fa-star"></i>);
            } else if (i - 0.5 === rating) {
                stars.push(<i key={i} className="home-product-item__star--gold fas fa-star-half-alt"></i>);
            } else {
                stars.push(<i key={i} className="fas fa-star" style={{ color: "#d5d5d5" }}></i>);
            }
        }
        return stars;
    };


    return (
        <div className="col-lg-4 col-md-6 col-12 mb-20" style={{ marginBottom: '20px' }}>
            <Link to={`/product-detail/${product.id}`} className="product__new-item">
                <div className="card" style={{ width: '100%' }}>
                    <div>
                        <img className="card-img-top" src={product.img} alt={product.name} />
                        <form action="" className="hover-icon hidden-sm hidden-xs">
                            <input type="hidden" />
                            <button className="btn-add-to-cart" title="Mua ngay" onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert(`Thêm ${product.name} vào giỏ`); /* Logic thêm vào giỏ */ }}>
                                <i className="fas fa-cart-plus"></i>
                            </button>
                            <button data-toggle="modal" data-target="#myModalQuickView" className="quickview" title="Xem nhanh" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(product); }}>
                                <i className="fas fa-search"></i>
                            </button>
                        </form>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title custom__name-product">
                            {product.name}
                        </h5>
                        <div className="product__price">
                            {product.oldPrice && <p className="card-text price-color product__price-old">{formatPrice(product.oldPrice)}</p>}
                            <p className="card-text price-color product__price-new">{formatPrice(product.price)}</p>
                        </div>
                        <div className="home-product-item__action">
                            <span className="home-product-item__like home-product-item__like--liked"> {/* Cần state để quản lý like */}
                                <i className="home-product-item__like-icon-empty far fa-heart"></i>
                                <i className="home-product-item__like-icon-fill fas fa-heart"></i>
                            </span>
                            <div className="home-product-item__rating">
                                {renderStars(product.rating || 0)} {/* Giả sử có rating */}
                            </div>
                            <span className="home-product-item__sold">{product.sales || 0} đã bán</span>
                        </div>
                        {product.oldPrice && product.price < product.oldPrice && (
                            <div className="sale-off">
                                <span className="sale-off-percent">{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</span>
                                <span className="sale-off-label">GIẢM</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ProductItem;