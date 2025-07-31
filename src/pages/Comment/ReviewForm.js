import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createReview } from '../../container/services/userService';
import './ReviewForm.css';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.warn("Vui lòng nhập bình luận của bạn.");
            return;
        }
        setIsSubmitting(true);
        try {
            await createReview({ productId, rating, comment });
            setRating(5);
            setComment('');
            onReviewSubmitted();
        } catch (error) {
            toast.error(error.response?.data?.message || "Gửi đánh giá thất bại. Bạn cần mua sản phẩm này trước.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="review-form-container">
            <h5 className="form-title">Viết đánh giá của bạn</h5>
            <form onSubmit={handleSubmit}>
                <div className="form-group rating-group">
                    <label>Đánh giá của bạn về sản phẩm:</label>
                    <div className="stars-input">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <i
                                    key={ratingValue}
                                    className={`fas fa-star ${ratingValue <= rating ? 'active' : ''}`}
                                    onClick={() => !isSubmitting && setRating(ratingValue)}
                                ></i>
                            );
                        })}
                    </div>
                </div>
                <div className="form-group">
                    <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm nhé..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        disabled={isSubmitting}
                    ></textarea>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-submit-review" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;