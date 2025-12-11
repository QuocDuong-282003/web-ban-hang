import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { getPaymentTransactions } from '../../services/payService';
import { formatCurrency } from '../../../components/utils/formatter';
import './Payment.scss';

const Payment = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    // Fetch transactions
    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                search: searchTerm,
                status: statusFilter === 'all' ? '' : statusFilter
            };

            const response = await getPaymentTransactions(params);
            if (response.data.success) {
                setTransactions(response.data.data || []);
                setTotalPages(response.data.pagination?.totalPages || 1);
                setTotalItems(response.data.pagination?.totalItems || 0);
            } else {
                toast.error('Không thể tải danh sách giao dịch!');
                setTransactions([]);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Lỗi khi tải danh sách giao dịch!');
            setTransactions([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [currentPage, statusFilter]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) {
                fetchTransactions();
            } else {
                setCurrentPage(1);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    const handleClearFilter = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setCurrentPage(1);
    };

    const handleViewDetail = (transaction) => {
        // TODO: Implement view detail modal or navigate to detail page
        console.log('View detail:', transaction);
        toast.info('Xem chi tiết giao dịch: ' + transaction.transactionId);
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            'completed': { text: 'Thành công', bgColor: '#10b981', icon: '✓' },
            'failed': { text: 'Thất bại', bgColor: '#ef4444', icon: '✕' },
            'pending': { text: 'Chờ thanh toán', bgColor: '#f59e0b', icon: '⏳' }
        };

        const config = statusConfig[status] || statusConfig['pending'];

        return (
            <span className="status-badge" style={{ backgroundColor: config.bgColor }}>
                <i className={`fas ${status === 'completed' ? 'fa-check' : status === 'failed' ? 'fa-times' : 'fa-clock'}`}></i>
                {config.text}
            </span>
        );
    };

    // Payment type badge
    const PaymentTypeBadge = ({ type }) => {
        return (
            <span className="payment-type-badge">
                {type || 'VNPay'}
            </span>
        );
    };

    return (
        <div className="transaction-management-container">
            {/* Header Section */}
            <div className="transaction-header">
                <h2 className="transaction-title">Quản lý giao dịch</h2>
            </div>

            {/* Search and Filter Section */}
            <div className="transaction-filters">
                <div className="search-section">
                    <label className="filter-label">Tìm kiếm</label>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm theo mã giao dịch, mã đơn, khách sạn, khách hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-section">
                    <label className="filter-label">Lọc theo trạng thái</label>
                    <select
                        className="status-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        <option value="completed">Thành công</option>
                        <option value="failed">Thất bại</option>
                        <option value="pending">Chờ thanh toán</option>
                    </select>
                </div>

                <button
                    className="clear-filter-btn"
                    onClick={handleClearFilter}
                    disabled={!searchTerm && statusFilter === 'all'}
                >
                    Xóa bộ lọc
                </button>
            </div>

            {/* Table Section */}
            <div className="transaction-table-wrapper">
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã GD</th>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Tên sản phẩm</th>
                            <th>Số tiền</th>
                            <th>Trạng thái</th>
                            <th>Ngày thanh toán</th>
                            <th>Ngày tạo</th>
                            <th>Loại thanh toán</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="11" className="loading-cell">
                                    <div className="loading-spinner"></div>
                                    <span>Đang tải dữ liệu...</span>
                                </td>
                            </tr>
                        ) : transactions.length > 0 ? (
                            transactions.map((transaction) => (
                                <tr key={transaction.orderId || transaction.stt}>
                                    <td>{transaction.stt || '-'}</td>
                                    <td>
                                        <a
                                            href="#"
                                            className="transaction-code-link"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleViewDetail(transaction);
                                            }}
                                        >
                                            {transaction.transactionId || '-'}
                                        </a>
                                    </td>
                                    <td>
                                        <a
                                            href="#"
                                            className="transaction-code-link"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleViewDetail(transaction);
                                            }}
                                        >
                                            {transaction.orderCode || '-'}
                                        </a>
                                    </td>
                                    <td>
                                        <div className="customer-info">
                                            <div className="customer-name">{transaction.customerName || '-'}</div>
                                            <div className="customer-email">{transaction.customerEmail || '-'}</div>
                                        </div>
                                    </td>
                                    <td className="product-names-cell">
                                        {transaction.productNames || '-'}
                                    </td>
                                    <td className="amount-cell">
                                        <strong>{formatCurrency(transaction.totalPrice || 0)}</strong>
                                    </td>
                                    <td>
                                        <StatusBadge status={transaction.paymentStatus} />
                                    </td>
                                    <td>{transaction.paidAt || '-'}</td>
                                    <td>{transaction.createdAt || '-'}</td>
                                    <td>
                                        <PaymentTypeBadge type={transaction.paymentMethod} />
                                    </td>
                                    <td>
                                        <button
                                            className="action-btn"
                                            onClick={() => handleViewDetail(transaction)}
                                            title="Xem chi tiết"
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="no-data-cell">
                                    Không có dữ liệu giao dịch
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination-wrapper">
                    <ReactPaginate
                        previousLabel="‹"
                        nextLabel="›"
                        breakLabel="..."
                        breakClassName="break-me"
                        pageCount={totalPages}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName="pagination"
                        activeClassName="active"
                        forcePage={currentPage - 1}
                    />
                </div>
            )}
        </div>
    );
};

export default Payment;
