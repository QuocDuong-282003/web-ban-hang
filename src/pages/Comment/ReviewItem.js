import React from 'react';
import './ReviewItem.css';

const ReviewItem = ({ review }) => {
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(<i key={i} className={`fas fa-star ${i <= rating ? 'text-warning' : 'text-secondary'}`}></i>);
        }
        return stars;
    };

    //
    const userImage = review.user?.avatar
        ? review.user.avatar
        : '/assets/img/product/noavatar.png';


    return (
        <div className="review-item">
            <div className="author-avatar">
                <img src={userImage} alt={review.user?.name} />
            </div>
            <div className="review-main-content">
                <div className="author-name">{review.user?.name || 'Người dùng ẩn danh'}</div>
                <div className="author-rating">{renderStars(review.rating)}</div>
                <div className="review-date">{new Date(review.createdAt).toLocaleString('vi-VN')}</div>
                <p className="review-comment">{review.comment}</p>
                {/* Phần này để hiển thị ảnh/video nếu có, bạn có thể thêm sau */}
                {/* <div className="review-media">
                    <img src="..." alt="review media" />
                </div> */}
            </div>
        </div>
    );
};

export default ReviewItem;