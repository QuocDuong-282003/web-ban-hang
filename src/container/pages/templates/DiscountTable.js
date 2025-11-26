
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import './DiscountTable.scss';

import { useClientSideSearch } from "../../hooks/useClientSideSearch";
import {
    getAllDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount
} from '../../services/userService';
import DiscountModal from "../ModalDiscount/DiscountModal";


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

const DiscountTable = () => {
    const [allDiscounts, setAllDiscounts] = useState([]); // Lưu trữ toàn bộ dữ liệu gốc
    const [isLoading, setIsLoading] = useState(false);

    // hook để quản lý việc lọc và phân trang
    const {
        items: displayedDiscounts,
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



    //  useCallback để tránh việc hàm bị tạo lại, gây lặp vô hạn trong useEffect
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
    }, []);

    useEffect(() => {
        fetchAllDiscounts();
    }, [fetchAllDiscounts]);


    const handleSave = async (formData) => {
        const isEditing = !!currentDiscount;

        try {
            if (isEditing) {
                await updateDiscount(currentDiscount._id, formData);
            } else {
                await createDiscount(formData);
            }
            toast.success(isEditing ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
            closeModal();
            fetchAllDiscounts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lưu thất bại!');
        }
    };

    // Hàm xử lý xóa
    const handleDelete = async (id) => {

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

            <div className="list-summary">
                {`Hiển thị ${displayedDiscounts.length} trong tổng số ${filteredCount} kết quả.`}
            </div>

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
                        <tr><td colSpan="9" className="loading-cell">Đang tải...</td></tr>
                    ) : displayedDiscounts.length > 0 ? (
                        displayedDiscounts.map((discount, index) => (
                            <tr key={discount._id}>
                                <td>{(currentPage - 1) * 10 + index + 1}</td>
                                <td>{discount.code}</td>
                                <td>{discount.description}</td>
                                <td>{discount.discountType === 'percent' ? 'Phần trăm' : 'Cố định'}</td>

                                <td>
                                    {(typeof discount.value === 'number' ? discount.value : 0).toLocaleString('vi-VN')}
                                    {discount.discountType === 'percent' ? ' %' : ' VND'}
                                </td>

                                <td>{new Date(discount.startDate).toLocaleDateString('vi-VN')}</td>
                                <td>{new Date(discount.endDate).toLocaleDateString('vi-VN')}</td>

                                <td className={`status-${(discount.status || '').replace(/\s+/g, '-').toLowerCase()}`}>
                                    {discount.status}
                                </td>

                                <td className="btn-discount-action">
                                    <button className="btn-edit" onClick={() => openEditModal(discount)}>Sửa</button>
                                    <button className="btn-delete" onClick={() => handleDelete(discount._id)}>Xóa</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="9" className="no-data-cell">Không có dữ liệu.</td></tr>
                    )}
                </tbody>
            </table>


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