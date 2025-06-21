
import React, { memo } from 'react';
import { WORKFLOW_CONFIG } from '../config/orderWorkflow';

const OrderActions = memo(({ order, onUpdateStatus }) => {
    // Lấy ra danh sách các hành động được phép từ trạng thái hiện tại của đơn hàng
    const availableActions = WORKFLOW_CONFIG[order.status] || [];

    // Nếu không có hành động nào (ví dụ: đơn đã giao, đã hủy)
    if (availableActions.length === 0) {
        return <span>—</span>;
    }

    // Nếu có hành động, render các nút tương ứng
    return (
        <div className="action-buttons-wrapper">
            {availableActions.map(action => (
                <button
                    key={action.nextStatus}
                    className={`action-btn ${action.className}`}
                    // Truyền cả message vào hàm xử lý để hiển thị hộp thoại confirm
                    onClick={() => onUpdateStatus(order._id, action.nextStatus, action.confirmMessage)}
                >
                    {action.label}
                </button>
            ))}
        </div>
    );
});

export default OrderActions;