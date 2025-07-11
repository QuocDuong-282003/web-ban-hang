// File: src/components/product/ProductItem.js

import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { toggleWishlistItem } from '../store/actions/wishlistSlice';
import { addToCart } from '../../container/services/userService';
import { setCart } from '../store/actions/cartSlice';
import './ProductItem.scss';

function ProductItem({ product }) {
    const dispatch = useDispatch();
    const likedProductIds = useSelector(state => state.wishlist.itemIds);
    const isLiked = likedProductIds.includes(product._id);

    // ... (các hàm formatPrice, renderStars giữ nguyên)
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


    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleWishlistItem(product._id));
        if (!isLiked) {
            toast.success(`Đã thêm "${product.name}" vào danh sách yêu thích!`);
        } else {
            toast.info(`Đã xóa "${product.name}" khỏi danh sách yêu thích.`);
        }
    };

    // SỬA Ở ĐÂY: THÊM HÀM `handleAddToCart`
    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const itemData = {
            productId: product._id,
            quantity: 1,
        };

        try {
            const response = await addToCart(itemData);
            if (response && response.data) {
                const updatedCart = response.data.data;
                dispatch(setCart(updatedCart));
                toast.success(response.data.message || "Đã thêm vào giỏ hàng!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Thêm sản phẩm thất bại!");
        }
    };

    if (!product) return null;

    const originalPrice = product.originalPrice || product.price;
    const finalPrice = product.displayPrice || product.finalPrice;
    const hasDiscount = typeof finalPrice === 'number' && typeof originalPrice === 'number' && finalPrice < originalPrice;

    return (
        <Link to={`/product-detail/${product._id}`} className="text-decoration-none text-dark d-block h-100">
            <div className="card h-100 border-0 shadow-sm product-card-hover">
                <div className="product-image-container">
                    {/* Nút yêu thích */}
                    {/* <button className={`wishlist-button ${isLiked ? 'liked' : ''}`} onClick={handleToggleWishlist}>
                        <i className="fas fa-heart"></i>
                    </button>
                    {/* SỬA Ở ĐÂY: Thêm nút "Thêm vào giỏ" *
                    <button className="add-to-cart-button" onClick={handleAddToCart}>
                        Thêm vào giỏ
                    </button> */}
                    <div style={{ aspectRatio: '1 / 1', overflow: 'hidden' }}>
                        <img className="card-img-top" src={product.imageBase64 || product.images?.[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>
                <div className="card-body d-flex flex-column p-3">
                    <h5 className="card-title product-name flex-grow-1" style={{ minHeight: '42px', fontSize: '1rem' }}>
                        {product.name}
                    </h5>
                    <div className="mt-auto">
                        <div className="product__price">
                            <span className="font-weight-bold price-product-new">{formatPrice(finalPrice)}</span>
                            {hasDiscount && (<del className="text-muted ml-2 price-product-old">{formatPrice(originalPrice)}</del>)}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <div className="home-product-item__rating">{renderStars(product.rating)}</div>
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>{product.sold || 0} đã bán</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductItem;