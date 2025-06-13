import React, { useEffect, useState, useCallback } from 'react';
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../../services/userService';
import { toast } from 'react-toastify';
import CategoryModal from '../ModalCategory/CategoryModal';
import { useClientSideSearch } from '../../hooks/useClientSideSearch';
import './ListCategory.scss';

const ListCategory = () => {
    const [allCategories, setAllCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const categoryFilterFn = useCallback((category, searchTerm) => {
        const name = category.name || '';
        const description = category.description || '';

        return (
            name.toLowerCase().includes(searchTerm) ||
            description.toLowerCase().includes(searchTerm)
        );
    }, []);
    const {
        items: displayedCategories,
        totalPage,
        currentPage,
        goToPage,
        searchTerm,
        setSearchTerm,
        totalItems,
    } = useClientSideSearch(allCategories, 10, categoryFilterFn);

    const fetchAllCategories = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getAllCategories();
            console.log("checkres", response);
            const categoriesData = response.data?.data || response.data || [];
            setAllCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (err) {
            setError(err);
            toast.error('Không thể tải danh sách danh mục');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllCategories();
    }, []);

    const handleSave = async (formData) => {
        const isEditing = !!currentCategory;
        const action = isEditing
            ? updateCategory(currentCategory._id, formData)
            : createCategory(formData);

        try {
            await action;
            toast.success(isEditing ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
            closeModal();
            fetchAllCategories();
        } catch (error) {
            toast.error(isEditing ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!');
        }
    };

    const handleDelete = async (id) => {

        try {
            await deleteCategory(id);
            toast.success("Xóa thành công!");
            fetchAllCategories();
        } catch (error) {
            toast.error("Xóa danh mục thất bại!");
        }

    };

    const openCreateModal = () => {
        setCurrentCategory(null);
        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        setCurrentCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCategory(null);
    };

    return (
        <div className="category-container">
            <div className="category-header">
                <h2 className="category-title">Quản lý danh mục </h2>
                <button className="category-add-button" onClick={openCreateModal}>+ Thêm mới</button>
            </div>

            <div className="category-search-wrapper">
                <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Tìm kiếm..."
                    className="category-search-input"
                />
            </div>


            <p className="category-result-info">
                Hiển thị {displayedCategories.length} trên tổng số {totalItems} kết quả.
            </p>

            {isLoading && <p>Đang tải dữ liệu...</p>}
            {error && <p className="category-error">Lỗi: {error.message}</p>}

            <table className="category-table">
                <thead >
                    <tr>
                        <th>STT</th>
                        <th>Tên</th>
                        <th>Mô tả</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading && displayedCategories.length > 0 ? (
                        displayedCategories.map((category, index) => (
                            <tr key={category._id}>
                                <td>{(currentPage - 1) * 10 + index + 1}</td>
                                {/* <td>{allCategories.findIndex(category => category._id === category._id) + 1}</td> */}
                                <td>{category.name}</td>
                                <td>{category.description}</td>
                                <td className={category.status === 'Active' ? 'category-status-active' : 'category-status-inactive'}>
                                    {category.status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                                </td>
                                <td>
                                    <button
                                        className="category-action-button category-edit-button"
                                        onClick={() => openEditModal(category)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="category-action-button category-delete-button"
                                        onClick={() => handleDelete(category._id)}
                                    >
                                        Xoá
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                {isLoading ? 'Đang tải...' : 'Không có danh mục nào.'}
                            </td>
                        </tr>
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

            <CategoryModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSave}
                category={currentCategory}
            />
        </div>
    );
};

export default ListCategory;
