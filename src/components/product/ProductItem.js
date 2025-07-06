import React from 'react';
import { Link } from 'react-router-dom';
import './ProductItem.scss'; // Giữ lại file scss của bạn

function ProductItem({ product }) {

    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        }
        return 'Liên hệ';
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating || 0);
        for (let i = 1; i <= 5; i++) {
            if (i < fullStars + 1) {
                stars.push(<i key={i} className="fas fa-star" style={{ color: '#ffc107' }}></i>);
            } else {
                stars.push(<i key={i} className="far fa-star" style={{ color: '#e4e5e9' }}></i>);
            }
        }
        return stars;
    };

    if (!product) return null;


    const originalPrice = product.originalPrice || product.price;
    const finalPrice = product.displayPrice || product.finalPrice;

    const hasDiscount = typeof finalPrice === 'number' && typeof originalPrice === 'number' && finalPrice < originalPrice;

    return (
        <Link to={`/product-detail/${product._id}`} className="text-decoration-none text-dark d-block h-100">
            <div className="card h-100 border-0 shadow-sm product-card-hover">
                <div style={{ position: 'relative' }}>
                    <div style={{ aspectRatio: '1 / 1', overflow: 'hidden' }}>
                        <img
                            className="card-img-top"
                            src={product.imageBase64}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                </div>
                <div className="card-body d-flex flex-column p-3">
                    <h5 className="card-title product-name flex-grow-1" style={{ minHeight: '42px', fontSize: '1rem' }}>
                        {product.name}
                    </h5>
                    <div className="mt-auto">
                        <div className="product__price">
                            <span className="font-weight-bold price-product-new">{formatPrice(finalPrice)}</span>
                            {hasDiscount && (
                                <del className="text-muted ml-2 price-product-old" style={{ fontSize: '0.9rem' }}>
                                    {formatPrice(originalPrice)}
                                </del>
                            )}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <div className="home-product-item__rating">
                                {renderStars(product.rating)}
                            </div>
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                                {product.sold || 0} đã bán
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductItem;