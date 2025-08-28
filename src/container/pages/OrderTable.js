import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

import { useServerSideSearch } from '../hooks/useServerSideSearch';
import { getAllOrders, updateOrderStatus } from '../services/userService';
import { formatCurrency } from '../../components/utils/formatter';

import OrderActions from './OrderActions';
import './OrderTable.scss';
import { STATUS_TAG_CONFIG } from '../config/orderWorkflow';

const UpdateStatusModal = ({ isOpen, onClose, onSubmit, statusConfig }) => {
    const [estimatedDelivery, setEstimatedDelivery] = useState('');
    const [shippingProvider, setShippingProvider] = useState('');
    const [trackingCode, setTrackingCode] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        const extraData = {};
        if (statusConfig.status === 'processing' && estimatedDelivery) {
            extraData.estimatedDeliveryDate = estimatedDelivery;
        }
        if (statusConfig.status === 'shipped') {
            if (shippingProvider) extraData.shippingProvider = shippingProvider;
            if (trackingCode) extraData.shippingTrackingCode = trackingCode;
        }
        onSubmit(extraData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Cập nhật đơn hàng</h4>
                <p>Bạn sắp chuyển trạng thái sang: <strong>{statusConfig.text}</strong></p>

                {statusConfig.status === 'processing' && (
                    <div className="form-group">
                        <label>Ngày giao hàng dự kiến (tùy chọn)</label>
                        <input type="text" value={estimatedDelivery} onChange={(e) => setEstimatedDelivery(e.target.value)} className="form-control" placeholder="Ví dụ: 3-5 ngày" />
                    </div>
                )}

                {statusConfig.status === 'shipped' && (
                    <>
                        <div className="form-group">
                            <label>Đơn vị vận chuyển (tùy chọn)</label>
                            <input type="text" value={shippingProvider} onChange={(e) => setShippingProvider(e.target.value)} className="form-control" placeholder="vd: Giao Hàng Tiết Kiệm" />
                        </div>
                        <div className="form-group">
                            <label>Mã vận đơn (tùy chọn)</label>
                            <input type="text" value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} className="form-control" />
                        </div>
                    </>
                )}

                <div className="modal-actions">
                    <button onClick={onClose} className="btn btn-secondary">Hủy</button>
                    <button onClick={handleSubmit} className="btn btn-primary">Xác nhận</button>
                </div>
            </div>
        </div>
    );
};
const StatusTag = ({ status }) => {
    const config = STATUS_TAG_CONFIG[status] || STATUS_TAG_CONFIG.default;
    return (
        <span style={{
            backgroundColor: config.color, color: 'white', padding: '4px 10px',
            borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
        }}>
            {config.text}
        </span>
    );
};

const OrderTable = () => {
    const {
        items: displayedOrders, isLoading, currentPage, totalPages, totalItems,
        goToPage, searchTerm, setSearchTerm, refreshData
    } = useServerSideSearch(getAllOrders, 10);

    // Thêm state cho modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUpdateInfo, setCurrentUpdateInfo] = useState(null);

    //  mở modal
    const handleUpdateStatus = (orderId, newStatus, confirmMessage) => {
        if (newStatus === 'processing' || newStatus === 'shipped') {
            setCurrentUpdateInfo({ orderId, newStatus, confirmMessage });
            setIsModalOpen(true);
        } else {
            const message = confirmMessage || `Xác nhận chuyển trạng thái sang "${STATUS_TAG_CONFIG[newStatus]?.text}"?`;
            if (window.confirm(message)) {
                updateStatusDirectly(orderId, { status: newStatus });
            }
        }
    };

    // Hàm mới để xử lý submit từ modal
    const handleSubmitFromModal = (extraData) => {
        if (!currentUpdateInfo) return;
        const { orderId, newStatus } = currentUpdateInfo;
        const updateData = { status: newStatus, ...extraData };
        updateStatusDirectly(orderId, updateData);
        // Đóng modal
        setIsModalOpen(false);
        setCurrentUpdateInfo(null);
    };

    // Hàm chung để gọi API, tránh lặp code
    const updateStatusDirectly = async (orderId, data) => {
        try {
            await updateOrderStatus(orderId, data);
            toast.success("Cập nhật trạng thái thành công!");
            refreshData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Cập nhật thất bại!");
        }
    };

    const handlePageClick = (event) => goToPage(event.selected + 1);

    return (
        <div className="order-page-container">
            <div className="order-page__header">
                <h2 className="order-page__title">Quản lý Đơn hàng</h2>
                <div className="order-page__search-wrapper">
                    <input type="text" placeholder="Tìm theo mã ĐH, tên, SĐT..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="order-page__search-input" />
                </div>
            </div>
            <div className="order-page__summary">
                {`Hiển thị ${displayedOrders.length} trên tổng số ${totalItems} kết quả.`}
            </div>

            <table className="order-page__table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã ĐH</th>
                        <th>Khách hàng</th>
                        <th>Sản phẩm</th>
                        <th>SL</th>
                        <th>Địa chỉ</th>
                        <th>Ngày đặt</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr><td colSpan="10" className="order-page__table-cell--loading">Đang tải...</td></tr>
                    ) : displayedOrders.length > 0 ? (
                        displayedOrders.map((order, index) => (
                            <tr key={order._id}>
                                <td>{(currentPage - 1) * 10 + index + 1}</td>
                                <td><strong>{order.orderCode}</strong></td>
                                <td>
                                    <div>{order.shippingInfo.fullName}</div>
                                    <div className="text-muted">{order.shippingInfo.phoneNumber}</div>
                                </td>
                                <td className="order-page__table-cell--items">
                                    {order.items.map(item => <div key={item._id}>{item.name}</div>)}
                                </td>
                                <td className="order-page__table-cell--quantity">
                                    {order.items.map(item => <div key={item._id}>{item.quantity}</div>)}
                                </td>
                                <td>{`${order.shippingInfo.address}, ${order.shippingInfo.city}`}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td><strong>{formatCurrency(order.totalPrice)}</strong></td>
                                <td><StatusTag status={order.status} /></td>
                                <td className="order-page__table-cell--actions">
                                    <OrderActions
                                        order={order}
                                        onUpdateStatus={handleUpdateStatus}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="10" className="order-page__table-cell--no-data">Không có đơn hàng nào.</td></tr>
                    )}
                </tbody>
            </table>

            {totalPages > 1 && (
                <ReactPaginate
                    previousLabel={'<'}
                    nextLabel={'>'}
                    pageCount={totalPages}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination-container'}
                    activeClassName={'active'}
                    forcePage={currentPage - 1}
                />
            )}

            <UpdateStatusModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitFromModal}
                statusConfig={STATUS_TAG_CONFIG[currentUpdateInfo?.newStatus] || {}}
            />
        </div>
    );
};

export default OrderTable;
