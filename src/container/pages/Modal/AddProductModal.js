// --- THAY THẾ TOÀN BỘ FILE AddProductModal.js ---

import React, { useState, useEffect } from 'react';
import './AddProductModal.css';
import { toast } from 'react-toastify';
import { getAllCategories } from '../../services/userService';

const AddProductModal = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [imageFiles, setImageFiles] = useState([]); // State cho file
    const [categories, setCategories] = useState([]);
    const [options, setOptions] = useState(['']);

    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                try {
                    const res = await getAllCategories();
                    setCategories(res.data);
                } catch (error) {
                    console.error('Lỗi khi tải danh mục:', error);
                }
            };
            fetchCategories();

            // Reset form khi mở
            setName('');
            setDescription('');
            setPrice('');
            setStock('');
            setCategory('');
            setBrand('');
            setImageFiles([]);
            setOptions(['']);
        }
    }, [isOpen]);

    const handleOptionChange = (index, event) => {
        const newOptions = [...options];
        newOptions[index] = event.target.value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions([...options, '']);

    const removeOption = (index) => {
        if (options.length > 1) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description || !price || !stock || !category || !brand || imageFiles.length === 0) {
            toast.warning('Vui lòng điền đầy đủ thông tin và chọn ít nhất một ảnh.');
            return;
        }

        // Tạo đối tượng FormData để gửi file và dữ liệu
        const formData = new FormData();

        // Thêm các trường dữ liệu text vào formData
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('category', category);
        formData.append('brand', brand);

        // Chuyển mảng options thành chuỗi JSON để gửi đi
        const filledOptions = options.filter(opt => opt.trim() !== '');
        formData.append('options', JSON.stringify(filledOptions));

        // Thêm các file ảnh vào formData.
        // Tên 'images' ở đây PHẢI TRÙNG với tên trong middleware multer
        for (const file of imageFiles) {
            formData.append('images', file);
        }

        try {
            await onSave(formData); // Gọi hàm onSave từ cha (ProductTable)
            onClose(); // Đóng modal nếu thành công
        } catch (err) {
            // Lỗi đã được xử lý và toast ở component cha, không cần làm gì ở đây
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <h3>Thêm sản phẩm mới</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Tên sản phẩm:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label>Thương hiệu:</label>
                        <input type="text" placeholder="VD: Nike, Adidas..." value={brand} onChange={(e) => setBrand(e.target.value.toUpperCase())} required />
                    </div>
                    <div>
                        <label>Mô tả:</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

                    </div>
                    <div>
                        <label>Giá:</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>
                    <div>
                        <label>Tổng số lượng nhập kho:</label>
                        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                    </div>

                    <div>
                        <label>Ảnh sản phẩm (chọn nhiều ảnh):</label>
                        <input
                            type="file"
                            multiple
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={(e) => setImageFiles(Array.from(e.target.files))}
                            required
                        />
                    </div>

                    <div><label>Danh mục:</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                        </select>
                    </div>

                    <hr />
                    <h4>Các tùy chọn (ví dụ: Size, Màu sắc)</h4>
                    {options.map((option, index) => (
                        <div key={index} className="variant-row">
                            <input
                                type="text"
                                placeholder="Tên tùy chọn (vd: Đỏ, Size L)"
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