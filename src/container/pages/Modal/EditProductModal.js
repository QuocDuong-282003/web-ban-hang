// --- THAY THẾ TOÀN BỘ FILE: src/components/Modal/EditProductModal.js ---

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllCategories } from '../../services/userService';
import './EditProductModal.scss'; // Giữ lại file scss của bạn

const EditProductModal = ({ isOpen, onClose, onSave, product, existingProducts = [] }) => {

    // State cho các trường input cơ bản
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

    const [options, setOptions] = useState(['']);

    // useEffect để tải danh mục 
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

    // useEffect để điền dữ liệu sản phẩm vào form khi mở modal
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


            // Nếu sản phẩm có options, dùng nó. Nếu không, tạo 1 dòng trống.
            if (product.options && product.options.length > 0) {
                setOptions([...product.options]);
            } else {
                setOptions(['']);
            }

            setNewImageFiles([]);
        }
    }, [product]); // Phụ thuộc vào `product` để chạy lại khi có sản phẩm mới được chọn

    if (!isOpen || !product) return null;

    // Hàm xử lý thay đổi input cơ bản (giữ nguyên)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Hàm xử lý thay đổi file (giữ nguyên)
    const handleFileChange = (e) => {
        setNewImageFiles(Array.from(e.target.files));
    };

    // SỬA Ở ĐÂY: Thêm các hàm quản lý state 'options'
    const handleOptionChange = (index, event) => {
        const newOptions = [...options];
        newOptions[index] = event.target.value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const removeOption = (index) => {
        if (options.length > 1) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const normalizedNewName = formData.name.trim().toLowerCase();
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

        // SỬA Ở ĐÂY: Thêm 'options' vào FormData
        const filledOptions = options.filter(opt => opt.trim() !== '');
        updateFormData.append('options', JSON.stringify(filledOptions));

        if (newImageFiles.length > 0) {
            for (const file of newImageFiles) {
                updateFormData.append('images', file);
            }
        }

        try {
            // onSave chính là handleEdit trong ProductTable
            await onSave(updateFormData);
            // Component cha sẽ đóng modal và fetch lại dữ liệu
        } catch (err) {
            // Lỗi đã được xử lý ở component cha
            console.error("Lỗi khi gửi form từ EditProductModal:", err);
        }
    };

    return (
        <div className="edit-product-modal__overlay">
            <div className="edit-product-modal__content">
                <h3 className="edit-product-modal__title">Chỉnh sửa sản phẩm</h3>

                <form onSubmit={handleSubmit} className="edit-product-modal__form">
                    {/* Các trường input cũ, không thay đổi */}
                    <div className="edit-product-modal__form-group"><label>Tên sản phẩm:</label><input name="name" type="text" value={formData.name} onChange={handleChange} required /></div>
                    <div className="edit-product-modal__form-group"><label>Mô tả:</label><textarea name="description" value={formData.description} onChange={handleChange} required /></div>
                    <div className="edit-product-modal__form-group"><label>Giá:</label><input name="price" type="number" value={formData.price} onChange={handleChange} required /></div>
                    <div className="edit-product-modal__form-group"><label>Tồn kho:</label><input name="stock" type="number" value={formData.stock} onChange={handleChange} required /></div>
                    <div className="edit-product-modal__form-group"><label>Đã bán:</label><input name="sold" type="number" value={formData.sold} onChange={handleChange} required /></div>
                    <div className="edit-product-modal__form-group"><label>Danh mục:</label>
                        <select name="category" value={formData.category} onChange={handleChange} required>
                            <option value="" disabled>-- Chọn danh mục --</option>
                            {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                        </select>
                    </div>

                    {/*  Thêm phần quản lý "Tùy chọn" */}
                    <hr />
                    <h4>Các tùy chọn (Màu sắc, Kiểu dáng)</h4>
                    {options.map((option, index) => (
                        <div key={index} className="variant-row">
                            <input
                                type="text"
                                placeholder="Tên tùy chọn"
                                value={option}
                                onChange={e => handleOptionChange(index, e)}
                            />
                            {options.length > 1 && (
                                <button type="button" className="remove-variant-btn" onClick={() => removeOption(index)}>Xóa</button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="add-variant-btn" onClick={addOption}>+ Thêm tùy chọn</button>
                    <hr />

                    {/* Các trường input ảnh, không thay đổi */}
                    <div className="edit-product-modal__form-group"><label>Ảnh hiện tại:</label>
                        {product.imageBase64 ? (<img src={product.imageBase64} alt="Current product" className="edit-product-modal__image" />) : (<p>Không có ảnh.</p>)}
                    </div>
                    <div className="edit-product-modal__form-group"><label>Chọn ảnh mới (nếu muốn thay thế):</label><input type="file" multiple accept="image/*" onChange={handleFileChange} /></div>

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