// --- THAY THẾ TOÀN BỘ FILE: src/pages/HomePage/ComponentProduct/ProductGridSection.js ---

import React from 'react';
import { Link } from 'react-router-dom';

// Hàm render sao
const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(<i key={`full-${i}`} className="fas fa-star" style={{ color: '#ffc107' }}></i>);
        } else {
            stars.push(<i key={`empty-${i}`} className="far fa-star" style={{ color: '#e4e5e9' }}></i>);
        }
    }
    return stars;
};

function ProductGridSection({ title, products, openQuickView }) {
    if (!products || products.length === 0) {
        return null;
    }

    // Helper định dạng tiền tệ
    const formatPrice = (price) => {
        return price ? price.toLocaleString('vi-VN') + ' đ' : 'Liên hệ';
    }

    return (
        <div className="product__new" style={{ marginTop: '30px' }}>
            <h3 className="product__ne title-product">{title}</h3>
            <div className="row">
                {products.map(product => (
                    // Sử dụng class cột của Bootstrap để responsive
                    <div className="col-lg-3 col-md-4 col-6 mb-4" key={product._id}>
                        <Link to={`/product-detail/${product._id}`} className="product__new-item text-decoration-none">
                            {/* Thêm h-100 để các card cao bằng nhau */}
                            <div className="card h-100" style={{ width: "100%" }}>
                                {/* Bọc ảnh trong div position-relative để đặt tag giảm giá */}
                                <div style={{ position: 'relative' }}>
                                    {/* Cố định chiều cao ảnh để layout đều */}
                                    <img
                                        className="card-img-top"
                                        src={product.imageBase64 || './assets/img/placeholder.png'}
                                        alt={product.name}
                                        style={{ height: '270px', objectFit: 'cover' }}
                                    />
                                    <form action="" className="hover-icon hidden-sm hidden-xs">
                                        <button type="button" className="btn-add-to-cart" title="Thêm vào giỏ" onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('Thêm vào giỏ: ' + product.name) }}>
                                            <i className="fas fa-cart-plus"></i>
                                        </button>
                                        <button type="button" className="quickview" title="Xem nhanh" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openQuickView(product); }}>
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </form>

                                    {/* SỬA Ở ĐÂY: ĐÃ THÊM LẠI PHẦN HIỂN THỊ TAG GIẢM GIÁ */}
                                    {product.discountPercent > 0 && (
                                        <div className="sale-off">
                                            <span className="sale-off-percent">{product.discountPercent}%</span>
                                            <span className="sale-off-label">GIẢM</span>
                                        </div>
                                    )}
                                </div>

                                {/* Dùng flexbox để căn chỉnh nội dung bên trong card */}
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title description flex-grow-1" style={{ minHeight: '42px' }}>
                                        {product.name}
                                    </h5>

                                    <div className="mt-auto">
                                        <div className="product__price">
                                            {product.finalPrice < product.price ? (
                                                <>
                                                    <p className="card-text price-color product__price-new">{formatPrice(product.finalPrice)}</p>
                                                    <p className="card-text price-color product__price-old"><del>{formatPrice(product.price)}</del></p>
                                                </>
                                            ) : (
                                                <p className="card-text price-color product__price-new">{formatPrice(product.price)}</p>
                                            )}
                                        </div>
                                        <div className="home-product-item__action">
                                            <div className="home-product-item__rating">
                                                {renderStars(product.rating)}
                                            </div>
                                            <span className="home-product-item__sold">{product.sold || 0} đã bán</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductGridSection;