import React, { useState, useEffect } from 'react';
import './DiscountModal.scss';

const INITIAL_STATE = {
    code: '',
    description: '',
    discountType: 'percent',
    value: '',
    startDate: '',
    endDate: '',
    isActive: true,
};

const DiscountModal = ({ isOpen, onClose, onSave, discount }) => {
    const [formData, setFormData] = useState(INITIAL_STATE);

    useEffect(() => {
        if (isOpen) {
            if (discount) {
                const formattedStartDate = discount.startDate
                    ? new Date(discount.startDate).toISOString().split('T')[0]
                    : '';
                const formattedEndDate = discount.endDate
                    ? new Date(discount.endDate).toISOString().split('T')[0]
                    : '';
                setFormData({
                    code: discount.code || '',
                    description: discount.description || '',
                    discountType: discount.discountType || 'percent',
                    value: discount.value || 0,
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                    isActive: discount.isActive !== undefined ? discount.isActive : true,
                });
            } else {
                const today = new Date().toISOString().split('T')[0];
                setFormData({
                    ...INITIAL_STATE,
                    startDate: today,
                });

            }
        }
    }, [discount, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.code.trim() || !formData.startDate || !formData.endDate) {
            return alert('Mã, ngày bắt đầu và ngày kết thúc là bắt buộc!');
        }
        onSave(formData);
    };

    return (
        <div className="discount-modal-overlay" onClick={onClose}>
            <div
                className="discount-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>{discount ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá mới'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Mã (Code)</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Mô tả</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label>Loại giảm giá</label>
                        <select
                            name="discountType"
                            value={formData.discountType}
                            onChange={handleChange}
                        >
                            <option value="percent">Phần trăm (%)</option>
                            <option value="fixed">Số tiền cố định (VND)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Giá trị</label>
                        <input
                            type="number"
                            name="value"
                            value={formData.value}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Ngày bắt đầu</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            //onChange={handleChange}
                            onChange={() => { }}
                            readOnly={!!discount}
                            required readonly
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label>Ngày kết thúc</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            readOnly={!!discount}
                            required
                        />
                    </div>

                    <div className="form-group checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                            />
                            Kích hoạt
                        </label>
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Hủy
                        </button>
                        <button type="submit" className="btn-save">
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DiscountModal;
