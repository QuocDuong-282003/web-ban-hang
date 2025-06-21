

import React from 'react';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

import { useServerSideSearch } from '../hooks/useServerSideSearch';
import { getAllOrders, updateOrderStatus } from '../services/userService';
import { formatCurrency } from '../../components/utils/formatter';


import OrderActions from './OrderActions';
import './OrderTable.scss';
import { STATUS_TAG_CONFIG } from '../config/orderWorkflow';

// Component con để hiển thị tag trạng thái một cách sạch sẽ
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


    const handleUpdateStatus = async (orderId, newStatus, confirmMessage) => {
        // Sử dụng confirmMessage động từ file cấu hình để người dùng biết họ đang làm gì
        const message = confirmMessage || `Xác nhận chuyển trạng thái sang "${newStatus}"?`;


        try {
            // Gửi yêu cầu lên backend với đúng định dạng mà controller mong đợi
            await updateOrderStatus(orderId, { status: newStatus });

            toast.success("Cập nhật trạng thái thành công!");
            refreshData(); // Tải lại dữ liệu để thấy sự thay đổi
        } catch (error) {
            // Hiển thị lỗi trả về từ backend, nếu không có thì hiển thị lỗi chung
            toast.error(error.response?.data?.message || "Cập nhật thất bại!");
        }
    };

    const handlePageClick = (event) => goToPage(event.selected + 1);

    return (
        <div className="order-page-container">
            {/* Header và Summary */}
            <div className="order-page__header">
                <h2 className="order-page__title">Quản lý Đơn hàng</h2>
                <div className="order-page__search-wrapper">
                    <input
                        type="text"
                        placeholder="Tìm theo mã ĐH, tên, SĐT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="order-page__search-input"
                    />
                </div>
            </div>
            <div className="order-page__summary">
                {`Hiển thị ${displayedOrders.length} trên tổng số ${totalItems} kết quả.`}
            </div>

            {/* Bảng dữ liệu */}
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

            {/* Phân trang */}
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
        </div>
    );
};

export default OrderTable;