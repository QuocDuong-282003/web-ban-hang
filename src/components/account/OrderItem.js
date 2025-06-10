import React from 'react';

function OrderItem({ order, onShowDetail }) {
    return (
        <div className="row bd-bottom" style={{ alignItems: 'center', padding: '10px 0' }}>
            <div className="col-md-2 col-4">{order.id}</div> {/* Adjusted for mobile */}
            <div className="col-md-3 col-4">{order.date}</div> {/* Adjusted for mobile */}
            <div className="col-md-3 d-none d-md-block">{order.total.toLocaleString('vi-VN')} VNĐ</div> {/* Hidden on mobile */}
            <div className="col-md-2 col-4">
                <span className={`btn-stt ${order.statusColor}`}>{order.status}</span>
            </div>
            <div className="col-md-2 col-12 text-md-left text-right mt-2 mt-md-0"> {/* Full width on mobile, button at end */}
                <button onClick={() => onShowDetail(order)} className="btn btn-sm btn-info">Xem</button>
            </div>
        </div>
    );
}

export default OrderItem;