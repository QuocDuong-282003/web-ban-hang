import React, { useState, useEffect } from 'react';
import './AddProductModal.css';
import { toast } from 'react-toastify';
import { getAllCategories } from '../../services/userService'
const AddProductModal = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [imageFiles, setImageFiles] = useState([]); // Chứa các đối tượng File
    const [categories, setCategories] = useState([]);

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
        }
    }, [isOpen]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description || !price || !stock || !category || imageFiles.length === 0) {
            toast.warning('Vui lòng điền đầy đủ thông tin và chọn ít nhất một ảnh.');
            return;
        }
        // khởi tạo 1 obj
        const productData = {
            name, description, price, stock, category,

        }
        // tạo 1 đối tượng
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
            const response = await onSave(formData);

            if (response && response.status === 201) {
                toast.success("Thêm sản phẩm  thành công!");
                setName('');
                setDescription('');
                setPrice('');
                setStock('');
                setCategory('');
                setImageFiles([]);
                onClose(); // Đóng modal sau khi thành công
            } else {
                toast.error(" Lỗi khi thêm sản phẩm !Vui lòng thử lại");
            }
        } catch (err) {
            console.error('Lỗi khi gửi form:', err);
            const errorMessage = err.response?.data?.message || 'Đã xảy ra lỗi khi gửi dữ liệu.';
            toast.error(`Thêm sản phẩm thất bại: ${errorMessage}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Thêm sản phẩm mới</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Tên sản phẩm:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
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
                        <label>Số lượng:</label>
                        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                    </div>
                    <div>
                        <label>Ảnh:</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setImageFiles(Array.from(e.target.files))}
                        />
                    </div>
                    <div>
                        <label>Danh mục:</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
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