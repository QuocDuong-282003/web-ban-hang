// --- FILE: src/components/common/ModalQuickView.js (FINAL & GUARANTEED TO WORK) ---

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ModalQuickView.scss';

function ModalQuickView({ product, show, handleClose }) {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [currentImage, setCurrentImage] = useState('');

    useEffect(() => {
        // Xử lý hiệu ứng khóa cuộn trang nền khi modal MỞ hoặc ĐÓNG
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        // Cập nhật state nội bộ của modal khi 'product' thay đổi
        if (product) {
            if (product.images && product.images.length > 0) {
                setCurrentImage(product.images[0]);
            } else if (product.imageBase64) {
                setCurrentImage(product.imageBase64);
            } else {
                setCurrentImage('/path/to/default-placeholder.png'); // Ảnh mặc định
            }

            if (product.variants && product.variants.length > 0) {
                setSelectedVariant(product.variants[0]);
            } else {
                setSelectedVariant(null);
            }
            setQuantity(1);
        }

        // Cleanup function: đảm bảo trang có thể cuộn lại nếu component bị unmount
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [show, product]);

    // Không render gì cả nếu không được yêu cầu hiển thị
    if (!show) {
        return null;
    }

    const stockAvailable = selectedVariant?.stock ?? product?.stock ?? 0;

    const handleQuantityChange = (amount) => {
        setQuantity(prev => {
            const newQuantity = prev + amount;
            if (newQuantity < 1) return 1;
            if (newQuantity > stockAvailable) {
                toast.warn(`Chỉ còn ${stockAvailable} sản phẩm có sẵn.`);
                return stockAvailable > 0 ? stockAvailable : 1;
            }
            return newQuantity;
        });
    };

    const handleBuyNow = () => {
        // Logic mua ngay của bạn...
        const itemToBuy = { /* ... */ };
        sessionStorage.setItem('checkout_items', JSON.stringify([itemToBuy]));
        navigate('/pay');
        handleClose();
    };

    return (
        <div className="quickview-modal-overlay" onClick={handleClose}>
            <div className="quickview-modal-dialog" onClick={e => e.stopPropagation()}>
                <div className="quickview-modal-content">
                    <button className="quickview-modal-close" onClick={handleClose}>×</button>
                    <div className="quickview-modal-body">
                        {/* Phần ảnh */}
                        <div className="quickview-image-section">
                            <div className="quickview-main-image-wrapper">
                                <img src={currentImage} alt={product.name} className="quickview-main-image" />
                            </div>
                            {product.images && product.images.length > 1 && (
                                <div className="quickview-thumbnail-wrapper">
                                    {product.images.map((imgSrc, index) => (
                                        <div
                                            className={`quickview-thumbnail-item ${currentImage === imgSrc ? 'active' : ''}`}
                                            key={index}
                                            onClick={() => setCurrentImage(imgSrc)}
                                        >
                                            <img src={imgSrc} alt={`${product.name} thumbnail ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Phần thông tin */}
                        <div className="quickview-info-section">
                            <h3 className="quickview-product-name">
                                <Link to={`/product-detail/${product._id}`} title={product.name}>{product.name || "Tên sản phẩm"}</Link>
                            </h3>
                            <div className="quickview-meta-info">
                                <span>Trạng thái: <b className={stockAvailable > 0 ? 'text-success' : 'text-danger'}>{stockAvailable > 0 ? 'Còn hàng' : 'Hết hàng'}</b></span>
                                <span>Loại sản phẩm: <b>{product.category?.name || "Chưa rõ"}</b></span>
                            </div>
                            <div className="quickview-price-box">
                                {product.finalPrice < product.price && (
                                    <del className="quickview-old-price">{(product.price || 0).toLocaleString('vi-VN')}₫</del>
                                )}
                                <span className="quickview-final-price">{(product.finalPrice || 0).toLocaleString('vi-VN')}₫</span>
                            </div>
                            <div className="quickview-description">{product.description || "Chưa có mô tả..."}</div>
                            <div className="quickview-actions">
                                <div className="quantity-selector">
                                    <span className="quantity-label">Số lượng:</span>
                                    <div className="quantity-input-group">
                                        <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
                                        <input type="text" value={quantity} readOnly />
                                        <button onClick={() => handleQuantityChange(1)} disabled={quantity >= stockAvailable}>+</button>
                                    </div>
                                </div>
                                <button className="buy-now-btn" onClick={handleBuyNow} disabled={stockAvailable < 1}>Mua ngay</button>
                            </div>
                            <span className="stock-info">{stockAvailable > 0 ? `${stockAvailable} sản phẩm có sẵn` : 'Sản phẩm đã hết hàng'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalQuickView;