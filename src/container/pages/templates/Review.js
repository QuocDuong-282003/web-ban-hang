
import React, { use, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getAdminAllReviews, exportReviewsToExcel } from '../../services/userService';
import fileDownload from 'js-file-download';

// Component con để hiển thị sao rating 
const StarRating = ({ rating }) => (
    <div className="star-rating">
        {[...Array(5)].map((_, index) => (
            <span key={index} className={index < rating ? 'star-filled' : 'star-empty'}>★</span>
        ))}
    </div>
);
const Review = () => {
    const [reviewData, setReviewData] = useState(null);
    const [currentReview, setCurrentReview] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReviews, setSelectedReviews] = useState(new Set());
    const [isExporting, setIsExporting] = useState(false);
    const fetchAllReviews = async (page) => {
        setIsLoading(true);
        try {
            //  await axios.get('http://localhost:5000/api/users');
            const response = await getAdminAllReviews({ page: page, limit: 15 });
            setReviewData(response.data);
        } catch (error) {
            toast.error('Không thể tải danh sách đánh giá !')
            console.error("Lỗi khi tải danh sách đánh giá:", error);
            // if (error.response) {

            //     console.error("Dữ liệu lỗi từ server:", error.response.data);
            //     console.error("Trạng thái lỗi:", error.response.status);

            //     const message = error.response.data.message || 'Không thể tải danh sách đánh giá !';
            //     toast.error(message);
            // } else if (error.request) {
            //     // Request đã được gửi nhưng không nhận được phản hồi
            //     console.error("Không nhận được phản hồi từ server:", error.request);
            //     toast.error('Không thể kết nối tới máy chủ!');
            // } else {

            //     console.error("Lỗi không xác định:", error.message);
            //     toast.error('Đã xảy ra lỗi không xác định!');
            // }

        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchAllReviews(currentPage);
    }, [currentPage]);
    const reviewToDisplay = reviewData ? reviewData.data : [];

    // Hàm xử lý khi chọn/bỏ chọn một review
    const handleSelectReview = (reviewId) => {
        setSelectedReviews(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(reviewId)) {
                newSelected.delete(reviewId);
            } else {
                newSelected.add(reviewId);
            }
            return newSelected;
        });
    };

    // Hàm xử lý khi nhấn nút "Chọn tất cả"
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            const allReviewIdsOnPage = reviewToDisplay.map(r => r._id);
            setSelectedReviews(new Set(allReviewIdsOnPage));
        } else {
            setSelectedReviews(new Set());
        }
    };

    // Hàm xử lý khi nhấn nút "Xuất Excel"
    const handleExportClick = async () => {

        if (selectedReviews.size === 0) {
            toast.warn("Vui lòng chọn ít nhất một đánh giá để xuất.");
            return;
        }
        setIsExporting(true);
        try {
            const response = await exportReviewsToExcel(Array.from(selectedReviews));

            // . Xử lý kết quả thành công: tải file và thông báo
            fileDownload(response.data, `danh-sach-danh-gia_${new Date().toISOString().slice(0, 10)}.xlsx`);
            toast.success("Xuất file Excel thành công!");

        } catch (error) {
            // 
            console.error('Lỗi khi xuất file Excel:', error);
            if (error.response && error.response.status === 401) {
                toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            } else {
                toast.error('Có lỗi xảy ra khi xuất file Excel.');
            }
        } finally {
            //  trạng thái "đang xuất"
            setIsExporting(false);
        }

    };
    const isAllSelectedOnCurrentPage = reviewToDisplay.length > 0 && selectedReviews.size >= reviewToDisplay.length;
    return (
        <div className='container-review'>
            <div className='list-review-header'>
                <h2>Quản lý Đánh giá</h2>
                <button
                    onClick={handleExportClick}
                    className="export-button"
                    disabled={isExporting || selectedReviews.size === 0}
                >
                    {isExporting ? 'Đang xuất...' : `Xuất Excel (${selectedReviews.size} đã chọn)`}
                </button>
            </div>
            <table className='review-table-data'>
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={isAllSelectedOnCurrentPage}
                            />
                        </th>
                        <th>STT</th>
                        <th>Người đánh giá</th>
                        <th>Email</th>

                        <th>Số điện thoại</th>

                        <th>Sản phẩm</th>
                        <th>Số sao</th>
                        <th style={{ width: '35%' }}>Bình luận</th>
                        <th>Ngày</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        // Cập nhật colSpan cho đúng số cột mới (9 cột)
                        <tr><td colSpan="9" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td></tr>
                    ) : reviewToDisplay.length > 0 ? (
                        reviewToDisplay.map((review, index) => (
                            <tr key={review._id} className={selectedReviews.has(review._id) ? 'selected-row' : ''}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedReviews.has(review._id)}
                                        onChange={() => handleSelectReview(review._id)}
                                    />
                                </td>
                                <td>{index + 1 + (currentPage - 1) * 15}</td>
                                <td>{review.user?.name || '[Đã xóa]'}</td>
                                <td>{review.user?.email || 'N/A'}</td>

                                <td>{review.user?.phone || 'N/A'}</td>

                                <td>{review.product?.name || '[Đã xóa]'}</td>
                                <td><StarRating rating={review.rating} /></td>
                                <td>{review.comment || <em className="text-muted">Không bình luận</em>}</td>
                                <td>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</td>
                            </tr>
                        ))
                    ) : (
                        // Cập nhật colSpan cho đúng số cột mới (9 cột)
                        <tr><td colSpan="9" style={{ textAlign: 'center' }}>Không có đánh giá nào.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Review;