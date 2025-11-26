import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useClientSideSearch } from "../../hooks/useClientSideSearch";
import { getAllContact, deleteContact, updateStatus } from '../../services/userService';
import ReactPaginate from 'react-paginate';
import './ContactTable.scss';
const contactFilterFn = (contact, searchTerm) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
        contact.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        contact.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        contact.phone.toLowerCase().includes(lowerCaseSearchTerm)
    );
};

const ContactTable = () => {
    const [allContact, setAllContact] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    // Fetch dữ liệu chỉ một lần
    useEffect(() => {
        const fetchAllContact = async () => {
            setIsLoading(true);
            try {
                const response = await getAllContact();
                setAllContact(response.data.data || response.data || []);
            } catch (error) {
                toast.error('Không thể tải danh sách liên hệ!');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllContact();
    }, []);

    // Bước 1: Dùng useMemo để lọc theo status VÀ tính số đếm
    const { newCount, repliedCount, filteredByStatus } = useMemo(() => {
        if (!allContact) return { newCount: 0, repliedCount: 0, filteredByStatus: [] };

        const newCount = allContact.filter(c => c.status === 'new').length;
        const repliedCount = allContact.filter(c => c.status === 'replied').length;

        if (filterStatus === 'all') {
            return { newCount, repliedCount, filteredByStatus: allContact };
        }
        const filteredList = allContact.filter(c => c.status === filterStatus);
        return { newCount, repliedCount, filteredByStatus: filteredList };

    }, [allContact, filterStatus]);


    const {
        items: paginatedAndSearchedContacts,
        searchTerm,
        setSearchTerm,
        totalPage,
        currentPage,
        goToPage
    } = useClientSideSearch(filteredByStatus, 10, contactFilterFn);


    // Hàm Xóa - Đã Tối Ưu
    const handleDeleteContact = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa liên hệ này?')) {
            try {
                await deleteContact(id);
                toast.success('Đã xóa thành công!');
                setAllContact(prev => prev.filter(c => c._id !== id));
            } catch (error) {
                toast.error('Xóa thất bại');
            }
        }
    };

    const handleUpdateStatus = async (contactId, status) => {
        try {
            const response = await updateStatus(contactId, status);

            toast.success('Xử lý thành công!');
            setAllContact(prev =>
                prev.map(c => (c._id === contactId ? response.data.data : c))
            );

        } catch (error) {
            toast.error('Xử lý thất bại! Vui lòng thử lại!');
        }
    };
    const handlePageClick = (event) => goToPage(event.selected + 1);
    return (
        <div className="list-container">
            <div className="list-header">
                <h2 className="list-title">Danh sách Liên Hệ</h2>
                <div className="header-actions">
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email, sđt..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input" />
                </div>
            </div>

            <div className="list-filters" >
                <button onClick={() => setFilterStatus('all')} className={filterStatus === 'all' ? 'active' : ''}>
                    Tất cả ({allContact.length})
                </button>
                <button onClick={() => setFilterStatus('new')} className={filterStatus === 'new' ? 'active' : ''}>
                    Cần xử lý ({newCount})
                </button>
                <button onClick={() => setFilterStatus('replied')} className={filterStatus === 'replied' ? 'active' : ''}>
                    Đã giải quyết ({repliedCount})
                </button>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>SĐT</th>
                        <th>Nội dung</th>
                        <th>Ngày gửi</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr><td colSpan="8" className="loading-cell">Đang tải...</td></tr>
                    ) : paginatedAndSearchedContacts.length > 0 ? (
                        paginatedAndSearchedContacts.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1 + (currentPage - 1) * 10}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.phone}</td>
                                <td style={{ maxWidth: '200px', whiteSpace: 'pre-wrap' }}>{item.content}</td>
                                <td>{new Date(item.createdAt || item.startDate).toLocaleDateString('vi-VN')}</td>

                                <td>
                                    <span className={`status-${item.status}`}>{item.status === 'new' ? 'Cần xử lý' : 'Đã giải quyết'}
                                    </span>
                                </td>
                                <td className="btn-contact-button">
                                    <button className="btn-danger" onClick={() => handleDeleteContact(item._id)}>Xóa</button>
                                    {item.status === 'new' &&
                                        <button className="btn-warning" onClick={() => handleUpdateStatus(item._id, 'replied')}>Đã giải quyết</button>
                                    }
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="8" className="no-data-cell">Không có dữ liệu.</td></tr>
                    )}
                </tbody>
            </table>

            {/* Phân trang */}
            {totalPage > 1 && (
                <ReactPaginate
                    previousLabel={'<'}
                    nextLabel={'>'}
                    pageCount={totalPage}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination-container'}
                    activeClassName={'active'}
                    forcePage={currentPage - 1}
                />
                // <div className="pagination-container">
                //     {Array.from({ length: totalPage }, (_, i) => (
                //         <button key={i} onClick={() => goToPage(i + 1)} disabled={i + 1 === currentPage}>
                //             {i + 1}
                //         </button>
                //     ))}
                // </div>
            )}
        </div>
    );
};

export default ContactTable;