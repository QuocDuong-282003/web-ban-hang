// --- THAY THẾ TOÀN BỘ FILE: src/pages/HomePage/ComponentProduct/PopularProductsSection.js ---
import React from 'react';
import { Link } from 'react-router-dom';

function PopularProductsSection({ products }) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="product_popular" style={{ marginTop: '30px' }}>
            <h3 className="product__popular title-product">Sản phẩm phổ biến</h3>
            <div className="row">
                {products.map(product => (
                    // SỬA: Thay đổi class cột và thêm mb-4 để tạo khoảng cách
                    <div className="col-lg-4 col-md-6 mb-4" key={product._id}>
                        {/* SỬA: Thêm class h-100 để các card cao bằng nhau */}
                        <div className="card h-100" style={{ width: '100%' }}>
                            {/* SỬA: Thêm style để cố định chiều cao ảnh và dùng object-fit */}
                            <img
                                className="card-img-top"
                                src={product.imageBase64 || './assets/img/placeholder.png'}
                                alt={product.name}
                                // Bạn có thể điều chỉnh chiều cao này cho phù hợp
                                style={{ height: '350px', objectFit: 'cover' }}
                            />
                            {/* SỬA: Thêm d-flex flex-column để đẩy nút "Xem ngay" xuống dưới */}
                            <div className="card-body d-flex flex-column">
                                <h4 className="card-title">{product.name}</h4>
                                {/* SỬA: Thêm flex-grow-1 để mô tả co giãn lấp đầy không gian */}
                                <p className="card-text description flex-grow-1" style={{ fontWeight: 400 }}>
                                    {product.description}
                                </p>
                                {/* SỬA: Thêm mt-auto để đẩy nút này xuống đáy card */}
                                <Link to={`/product-detail/${product._id}`} title={product.name} className="btn btn-buynow mt-auto align-self-start">
                                    Xem ngay <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PopularProductsSection;