// --- FILE: src/components/Discount/DiscountTable.js (REWRITTEN FOR CLARITY & CORRECTNESS) ---

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import './DiscountTable.scss';

import { useClientSideSearch } from "../../hooks/useClientSideSearch";
import {
    getAllDiscounts,
    createDiscount, // Import hàm tạo discount
    updateDiscount,
    deleteDiscount
} from '../../services/userService';
import DiscountModal from "../ModalDiscount/DiscountModal"; // Import modal


//  ĐỊNH NGHĨA HÀM LỌC TÁCH BIỆT

const discountFilterFn = (discount, searchTerm) => {
    const code = discount.code || '';
    const description = discount.description || '';
    const discountType = discount.discountType || '';

    // Tìm kiếm không phân biệt hoa thường
    return (
        code.toLowerCase().includes(searchTerm) ||
        description.toLowerCase().includes(searchTerm) ||
        discountType.toLowerCase().includes(searchTerm)
    );
};

// 3. COMPONENT CHÍNH
const DiscountTable = () => {
    // === PHẦN STATE VÀ HOOKS ===
    const [allDiscounts, setAllDiscounts] = useState([]); // Lưu trữ toàn bộ dữ liệu gốc
    const [isLoading, setIsLoading] = useState(false);

    // Sử dụng hook để quản lý việc lọc và phân trang
    const {
        items: displayedDiscounts, // << SỬA LỖI: Dùng biến này để render, không phải allDiscounts
        totalPage,
        currentPage,
        goToPage,
        searchTerm,
        setSearchTerm,
        totalItems: filteredCount
    } = useClientSideSearch(allDiscounts, 10, discountFilterFn);

    // State cho việc hiển thị và quản lý modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDiscount, setCurrentDiscount] = useState(null);

    // === PHẦN LOGIC (HÀM) ===

    // Dùng useCallback để tránh việc hàm bị tạo lại, gây lặp vô hạn trong useEffect
    const fetchAllDiscounts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getAllDiscounts();
            setAllDiscounts(response.data || []);
        } catch (error) {
            toast.error("Không thể tải danh sách mã giảm giá.");
        } finally {
            setIsLoading(false);
        }
    }, []); // Mảng rỗng nghĩa là hàm này chỉ được tạo 1 lần

    // Gọi API để lấy dữ liệu khi component được mount
    useEffect(() => {
        fetchAllDiscounts();
    }, [fetchAllDiscounts]);

    // Hàm xử lý khi lưu (cả thêm mới và cập nhật)
    const handleSave = async (formData) => {
        console.log('check data discount', formData)
        const isEditing = !!currentDiscount; // << SỬA LỖI LOGIC: `true` nếu currentDiscount có giá trị

        try {
            if (isEditing) {
                await updateDiscount(currentDiscount._id, formData);
            } else {
                await createDiscount(formData); // << SỬA LỖI: Gọi đúng hàm createDiscount
            }
            toast.success(isEditing ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
            closeModal();
            fetchAllDiscounts(); // Tải lại toàn bộ dữ liệu sau khi thành công
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lưu thất bại!');
        }
    };

    // Hàm xử lý xóa
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này không?")) return;
        try {
            await deleteDiscount(id);
            toast.success("Xóa thành công!");
            fetchAllDiscounts();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Xóa thất bại!');
        }
    };

    // Các hàm tiện ích để quản lý modal
    const openCreateModal = () => { setCurrentDiscount(null); setIsModalOpen(true); };
    const openEditModal = (discount) => { setCurrentDiscount(discount); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setCurrentDiscount(null); };

    // Hàm xử lý sự kiện click trang của ReactPaginate
    const handlePageClick = (event) => {
        goToPage(event.selected + 1);
    };


    return (
        <div className="list-container">

            <div className="list-header">
                <h2 className="list-title">Quản lý mã giảm giá</h2>
                <div className="header-actions">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button onClick={openCreateModal} className="add-button-discount">+ Thêm mới</button>
                </div>
            </div>

            {/* Thống kê */}
            <div className="list-summary">
                {`Hiển thị ${displayedDiscounts.length} trong tổng số ${filteredCount} kết quả.`}
            </div>

            {/* Bảng dữ liệu */}
            <table className="data-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã</th>
                        <th>Mô tả</th>
                        <th>Loại</th>
                        <th>Giá trị</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr><td colSpan="8" className="loading-cell">Đang tải...</td></tr>
                    ) : displayedDiscounts.length > 0 ? (
                        displayedDiscounts.map((discount, index) => (
                            <tr key={discount._id}>
                                <td>{(currentPage - 1) * 10 + index + 1}</td>
                                <td>{discount.code}</td>
                                <td>{discount.description}</td>
                                <td>{discount.discountType === 'percent' ? 'Phần trăm' : 'Cố định'}</td>
                                <td>{discount.value.toLocaleString()} {discount.discountType === 'percent' ? '%' : 'VND'}</td>
                                <td>{new Date(discount.startDate).toLocaleDateString('vi-VN')}</td>
                                <td>{new Date(discount.endDate).toLocaleDateString('vi-VN')}</td>
                                <td className={discount.isActive ? 'status-active' : 'status-inactive'}>
                                    {discount.isActive ? 'Kích hoạt' : 'Vô hiệu'}
                                </td>
                                <td className="btn-discount-action">
                                    <button className="btn-edit" onClick={() => openEditModal(discount)}>Sửa</button>
                                    <button className="btn-delete" onClick={() => handleDelete(discount._id)}>Xóa</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="8" className="no-data-cell">Không có dữ liệu.</td></tr>
                    )}
                </tbody>
            </table>

            {/* Phân trang */}
            {/* <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                pageCount={totalPage}
                onPageChange={handlePageClick}
                containerClassName={'pagination-container'}
                activeClassName={'active'}
                forcePage={currentPage - 1}
            /> */}
            {totalPage > 1 && (
                <div className="category-pagination">
                    {Array.from({ length: totalPage }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(i + 1)}
                            disabled={i + 1 === currentPage}
                            className={i + 1 === currentPage ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
            {/* Modal */}
            <DiscountModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSave}
                discount={currentDiscount}
            />
        </div>
    );
};

export default DiscountTable;