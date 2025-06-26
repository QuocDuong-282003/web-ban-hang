// --- THAY THẾ TOÀN BỘ FILE: src/components/Modal/AddProductModal.js ---

import React, { useState, useEffect } from 'react';
import './AddProductModal.css';
import { toast } from 'react-toastify';
import { getAllCategories } from '../../services/userService';

const AddProductModal = ({ isOpen, onClose, onSave }) => {
    // State cho các trường input cơ bản
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [categories, setCategories] = useState([]);

    // State để quản lý các dòng input cho "Tùy chọn"
    const [options, setOptions] = useState(['']);

    useEffect(() => {
        if (isOpen) {
            // Tải danh mục khi modal được mở
            const fetchCategories = async () => {
                try {
                    const res = await getAllCategories();
                    setCategories(res.data);
                } catch (error) {
                    console.error('Lỗi khi tải danh mục:', error);
                }
            };
            fetchCategories();

            // SỬA Ở ĐÂY: Reset toàn bộ form về trạng thái ban đầu mỗi khi mở
            setName('');
            setDescription('');
            setPrice('');
            setStock('');
            setCategory('');
            setImageFiles([]);
            setOptions(['']); // Reset tùy chọn về một dòng trống
        }
    }, [isOpen]);

    // SỬA Ở ĐÂY: Thêm các hàm quản lý state 'options'

    // 1. Hàm cập nhật giá trị của một dòng tùy chọn
    const handleOptionChange = (index, event) => {
        const newOptions = [...options];
        newOptions[index] = event.target.value;
        setOptions(newOptions);
    };

    // 2. Hàm thêm một dòng input tùy chọn mới
    const addOption = () => {
        setOptions([...options, '']);
    };

    // 3. Hàm xóa một dòng input tùy chọn
    const removeOption = (index) => {
        // Chỉ cho phép xóa nếu có nhiều hơn 1 dòng
        if (options.length > 1) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra thông tin cơ bản
        if (!name || !description || !price || !stock || !category || imageFiles.length === 0) {
            toast.warning('Vui lòng điền đầy đủ thông tin và chọn ít nhất một ảnh.');
            return;
        }

        // SỬA Ở ĐÂY: Xử lý và thêm `options` vào `formData`

        // Lọc bỏ các tùy chọn trống trước khi gửi
        const filledOptions = options.filter(opt => opt.trim() !== '');

        const productData = {
            name,
            description,
            price,
            stock,
            category,
            // Chuyển mảng options thành chuỗi JSON để gửi đi trong FormData
            options: JSON.stringify(filledOptions)
        };

        const formData = new FormData();
        for (const [key, value] of Object.entries(productData)) {
            formData.append(key, value);
        }

        // Tên field 'images' phải khớp với tên trong middleware multer
        for (const file of imageFiles) {
            formData.append('images', file);
        }

        try {
            // Gọi hàm onSave (chính là handleAdd) với formData
            // onSave nên là một async function trả về promise
            await onSave(formData);

            // Logic thành công/thất bại nên được xử lý ở component cha (ProductTable)
            // nơi gọi onSave, để đảm bảo toast chỉ hiện 1 lần và danh sách được fetch lại.
            // Tuy nhiên, để giữ code cũ, tôi vẫn để logic toast ở đây
            toast.success("Thêm sản phẩm thành công!");
            onClose(); // Đóng modal sau khi thành công

        } catch (err) {
            // Lỗi đã được toast ở component cha, chỉ cần log ở đây
            console.error('Lỗi khi gửi form từ AddProductModal:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <h3>Thêm sản phẩm mới</h3>
                <form onSubmit={handleSubmit}>
                    {/* Các trường input cũ, không thay đổi */}
                    <div><label>Tên sản phẩm:</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                    <div><label>Mô tả:</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} required /></div>
                    <div><label>Giá:</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
                    <div><label>Số lượng:</label><input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required /></div>
                    <div><label>Ảnh (chọn nhiều ảnh):</label><input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(Array.from(e.target.files))} /></div>
                    <div><label>Danh mục:</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                        </select>
                    </div>

                    <hr />
                    <h4>Các tùy chọn (Màu sắc, Kiểu dáng)</h4>

                    {/* SỬA Ở ĐÂY: Gắn các hàm xử lý sự kiện vào JSX */}
                    {options.map((option, index) => (
                        <div key={index} className="variant-row">
                            <input
                                type="text"
                                placeholder="Tên tùy chọn (vd: Trắng phối đen)"
                                value={option}
                                onChange={e => handleOptionChange(index, e)}
                            />
                            {/* Nút xóa chỉ hiện khi có nhiều hơn 1 dòng */}
                            {options.length > 1 && (
                                <button type="button" className="remove-variant-btn" onClick={() => removeOption(index)}>Xóa</button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="add-variant-btn" onClick={addOption}>+ Thêm tùy chọn</button>
                    <hr />

                    <div className="modal-buttons">
                        <button type="submit">Lưu</button>
                        <button type="button" onClick={onClose}>Huỷ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;