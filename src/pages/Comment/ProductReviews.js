import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getProductReviews } from '../../container/services/userService';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import './ProductReviews.css';
const ProductReviews = ({ productId, productRating, numReviews }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 });
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');

    const fetchReviews = useCallback(async (currentPage, isInitialLoad = false, filter = 'all') => {
        if (!productId) return;

        if (isInitialLoad) setIsLoading(true);
        else setIsFetchingMore(true);

        try {
            const res = await getProductReviews(productId, { page: currentPage, limit: 5 });
            if (res && res.data) {
                setReviews(prev => isInitialLoad ? res.data.reviews : [...prev, ...res.data.reviews]);
                setStats(res.data.stats || { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 });
                setHasMore(res.data.pagination.currentPage < res.data.pagination.totalPages);
            }
        } catch (error) {
            toast.error("Không thể tải đánh giá sản phẩm.");
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, [productId]);

    useEffect(() => {
        setPage(1);
        fetchReviews(1, true, activeFilter);
    }, [productId, activeFilter, fetchReviews]);

    const handleReviewSubmitted = () => {
        toast.success("Cảm ơn bạn đã gửi đánh giá!");
        setPage(1);
        fetchReviews(1, true, activeFilter);
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchReviews(nextPage, false, activeFilter);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(<i key={i} className={`fas fa-star ${i <= rating ? 'text-warning' : ''}`}></i>);
        }
        return stars;
    };

    const filterButtons = [
        { label: 'Tất Cả', key: 'all', count: numReviews },
        { label: '5 Sao', key: '5', count: stats['5'] },
        { label: '4 Sao', key: '4', count: stats['4'] },
        { label: '3 Sao', key: '3', count: stats['3'] },
        { label: '2 Sao', key: '2', count: stats['2'] },
        { label: '1 Sao', key: '1', count: stats['1'] },
    ];

    return (
        <div className="product-reviews-container bg-white p-4 my-4">
            <h4 className="reviews-title">ĐÁNH GIÁ SẢN PHẨM</h4>

            {/* Phần tóm tắt đánh giá */}
            <div className="reviews-summary">
                <div className="summary-rating">
                    <div>
                        <span className="rating-score">{productRating.toFixed(1)}</span>
                        <span className="rating-max"> trên 5</span>
                    </div>
                    <div className="stars-wrapper">{renderStars(productRating)}</div>
                </div>
                <div className="summary-filters">
                    {filterButtons.map(btn => (
                        <button
                            key={btn.key}
                            className={`filter-btn ${activeFilter === btn.key ? 'active' : ''}`}
                            onClick={() => setActiveFilter(btn.key)}
                        >
                            {btn.label} ({btn.count})
                        </button>
                    ))}
                </div>
            </div>

            <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />

            <div className="reviews-list mt-4">
                {isLoading ? (
                    <p className="text-center">Đang tải đánh giá...</p>
                ) : reviews.length > 0 ? (
                    reviews.map(review => (
                        <ReviewItem key={review._id} review={review} />
                    ))
                ) : (
                    <p className="text-center text-muted p-5">Chưa có đánh giá nào cho bộ lọc này.</p>
                )}
            </div>

            <div className="text-center mt-3">
                {isFetchingMore ? (
                    <button className="btn btn-outline-danger" disabled>Đang tải thêm...</button>
                ) : hasMore && (
                    <button className="btn btn-outline-danger" onClick={handleLoadMore}>
                        Xem Thêm Đánh Giá
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;