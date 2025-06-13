// src/components/Modal/EditProductModal.jsx

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllCategories } from '../../services/userService';
import './EditProductModal.scss';

const EditProductModal = ({ isOpen, onClose, onSave, product, existingProducts = [] }) => {

    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        description: '',
        price: 0,
        stock: 0,
        sold: 0,
        category: '',
    });

    const [newImageFiles, setNewImageFiles] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                try {
                    const res = await getAllCategories();
                    setCategories(res.data);
                } catch (error) {
                    toast.error('Không thể tải danh sách danh mục.');
                }
            };
            fetchCategories();
        }
    }, [isOpen]);

    useEffect(() => {
        if (product) {
            setFormData({
                _id: product._id,
                name: product.name || '',
                description: product.description || '',
                price: product.price || 0,
                stock: product.stock || 0,
                sold: product.sold || 0,
                category: product.category?._id || '',
            });
            setNewImageFiles([]);
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setNewImageFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const normalizedNewName = formData.name.trim().toLowerCase();

        // `existingProducts` giờ đây luôn là một mảng, nên `.some` sẽ luôn an toàn
        const isDuplicate = existingProducts.some(
            p => p._id !== product._id && p.name.trim().toLowerCase() === normalizedNewName
        );
        if (isDuplicate) {
            toast.error(`Tên sản phẩm "${formData.name.trim()}" đã tồn tại.`);
            return;
        }

        const updateFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            updateFormData.append(key, value);
        });

        if (newImageFiles.length > 0) {
            for (const file of newImageFiles) {
                updateFormData.append('images', file);
            }
        }

        try {
            await onSave(updateFormData);
        } catch (err) {
            // Lỗi sẽ được xử lý và hiển thị toast ở component cha (ProductTable)
            // Không cần làm gì ở đây
        }
    };

    return (
        <div className="edit-product-modal__overlay">
            <div className="edit-product-modal__content">
                <h3 className="edit-product-modal__title">Chỉnh sửa sản phẩm</h3>

                <form onSubmit={handleSubmit} className="edit-product-modal__form">
                    <div className="edit-product-modal__form-group">
                        <label>Tên sản phẩm:</label>
                        <input name="name" type="text" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="edit-product-modal__form-group">
                        <label>Mô tả:</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required />
                    </div>
                    <div className="edit-product-modal__form-group">
                        <label>Giá:</label>
                        <input name="price" type="number" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="edit-product-modal__form-group">
                        <label>Tồn kho:</label>
                        <input name="stock" type="number" value={formData.stock} onChange={handleChange} required />
                    </div>
                    <div className="edit-product-modal__form-group">
                        <label>Đã bán:</label>
                        <input name="sold" type="number" value={formData.sold} onChange={handleChange} required />
                    </div>
                    <div className="edit-product-modal__form-group">
                        <label>Danh mục:</label>
                        <select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="" disabled>-- Chọn danh mục --</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="edit-product-modal__form-group">
                        <label>Ảnh hiện tại:</label>
                        {product.imageBase64 ? (
                            <img src={product.imageBase64} alt="Current product" className="edit-product-modal__image" />
                        ) : (
                            <p>Không có ảnh.</p>
                        )}
                    </div>
                    <div className="edit-product-modal__form-group">
                        <label>Chọn ảnh mới (nếu muốn thay thế):</label>
                        <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="edit-product-modal__buttons">
                        <button type="submit">Lưu thay đổi</button>
                        <button type="button" onClick={onClose}>Huỷ</button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default EditProductModal;