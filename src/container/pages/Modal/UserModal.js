// 📁 src/components/ConfirmModal.jsx
import React from 'react';
import './UserModal.css';

const UserModal = ({ open, onClose, onConfirm, message }) => {
    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{message}</h3>
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>Hủy</button>
                    <button className="btn-confirm" onClick={onConfirm}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
