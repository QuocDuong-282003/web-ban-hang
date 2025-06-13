import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllDiscounts } from '../../services/userService';

const AssignDiscountModal = ({ isOpen, onClose, onSave, product }) => {
    // State để chứa danh sách mã giảm giá từ API
    const [allDiscounts, setAllDiscounts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const [selectedDiscountId, setSelectedDiscountId] = useState('');

    useEffect(() => {
        // Chỉ chạy logic khi modal được mở
        if (isOpen) {
            const fetchDiscounts = async () => {
                setIsLoading(true);
                try {
                    const response = await getAllDiscounts();
                    // Lọc ra các mã đang hoạt động để người dùng chọn
                    setAllDiscounts(response.data.filter(d => d.isActive) || []);
                } catch (error) {
                    toast.error("Không thể tải danh sách mã giảm giá.");
                } finally {
                    setIsLoading(false);
                }
            };

            fetchDiscounts();

            // Nếu product.discount là null,   trả về chuỗi rỗng ''
            setSelectedDiscountId(product?.discount?._id || '');
        }
    }, [isOpen, product]); // Chạy lại khi modal mở hoặc sản phẩm thay đổi


    if (!isOpen) return null;


    const handleSubmit = () => {
        onSave(selectedDiscountId || null);
    };

    return (
        <div className="discount-modal-overlay" onClick={onClose}>
            <div className="discount-modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Gán mã giảm giá cho: <strong>{product?.name}</strong></h2>


                <div className="discount-list" style={{ marginTop: '15px' }}>
                    {isLoading ? <p>Đang tải...</p> :
                        <>
                            <label htmlFor="discount-select" style={{ display: 'block', marginBottom: '8px' }}>Chọn một mã giảm giá:</label>
                            <select
                                id="discount-select"
                                value={selectedDiscountId}
                                onChange={(e) => setSelectedDiscountId(e.target.value)}
                                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
                            >
                                {/* Thêm  lựa chọn mặc định để gỡ bỏ mã */}
                                <option value="">-- Không áp dụng --</option>

                                {allDiscounts.map(discount => (
                                    <option key={discount._id} value={discount._id}>
                                        {discount.code} - {discount.description} ({discount.value}{discount.discountType === 'percent' ? '%' : 'VND'})
                                    </option>
                                ))}
                            </select>
                        </>
                    }
                </div>

                <div className="modal-actions" style={{ marginTop: '20px', textAlign: 'right' }}>
                    <button type="button" onClick={onClose} className="btn-cancel" style={{ marginRight: '10px' }}>Hủy</button>
                    <button type="button" onClick={handleSubmit} className="btn-save">Lưu thay đổi</button>
                </div>
            </div>
        </div>
    );
};

export default AssignDiscountModal;