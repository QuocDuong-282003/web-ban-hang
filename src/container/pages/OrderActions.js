
import React, { memo } from 'react';
import { WORKFLOW_CONFIG } from '../config/orderWorkflow';

const OrderActions = memo(({ order, onUpdateStatus }) => {
    const availableActions = WORKFLOW_CONFIG[order.status] || [];

    if (availableActions.length === 0) {
        return <span>—</span>;
    }

    return (
        <div className="action-buttons-wrapper">
            {availableActions.map(action => (
                <button
                    key={action.nextStatus}
                    className={`action-btn ${action.className}`}
                    onClick={() => onUpdateStatus(order._id, action.nextStatus, action.confirmMessage)}
                >
                    {action.label}
                </button>
            ))}
        </div>
    );
});

export default OrderActions;