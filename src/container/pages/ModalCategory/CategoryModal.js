import React, { useState, useEffect } from 'react';
import './CategoryModal.css'; // Import CSS đã tách riêng

const INITIAL_STATE = {
    name: '',
    description: '',
    status: 'Active'
};

const CategoryModal = ({ isOpen, onClose, onSave, category }) => {
    const [formData, setFormData] = useState(INITIAL_STATE);

    useEffect(() => {
        if (isOpen) {
            if (category) {
                setFormData({
                    name: category.name || '',
                    description: category.description || '',
                    status: category.status || 'Active',
                });
            } else {
                setFormData(INITIAL_STATE);
            }
        }
    }, [category, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            return alert('Tên danh mục không được để trống!');
        }
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="modal-field">
                        <label>Tên</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="modal-field">
                        <label>Mô tả</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="modal-field">
                        <label>Trạng thái</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Active">Hoạt động</option>
                            <option value="Inactive">Không hoạt động</option>
                        </select>
                    </div>
                    <div className="modal-actions">

                        <button type="submit" class="btn btn-success">Success</button>
                        <button type="button" onClick={onClose} class="btn btn-danger">Danger</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;
