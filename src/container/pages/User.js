import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserModal from '../pages/Modal/UserModal';
import { toast } from 'react-toastify';
import './User.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchItem, setSearchItem] = useState('');
    // const [searchKeyWord, setSearchKeyWord] = useState('');
    const USERS_PER_PAGE = 15;

    // Lấy danh sách user từ API
    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Lỗi khi lấy user:', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Lọc theo từ khóa tìm kiếm
    const filteredUsers = users.filter(user => {
        const keyword = searchItem.toLowerCase();
        return (
            user.name.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword)
        );
    });
    // lọc khi btn
    // const handleSearch = () => {
    //     setSearchItem(searchKeyWord);
    //     setCurrentPage(1);// rest vè page đầu khi tìm kiếm
    // }

    // Tính phân trang sau khi lọc
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

    // Xử lý chuyển trang
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Mở modal xác nhận xoá
    const handleDeleteClick = (userId) => {
        setSelectedUserId(userId);
        setShowModal(true);
    };

    // Xác nhận xoá người dùng
    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${selectedUserId}`);
            const updated = users.filter(user => user._id !== selectedUserId);
            setUsers(updated);

            const newTotalPages = Math.ceil(updated.length / USERS_PER_PAGE);
            if (currentPage > newTotalPages) {
                setCurrentPage(prev => Math.max(prev - 1, 1));
            }

            toast.success("Xóa tài khoản thành công!");
            setShowModal(false);
            setSelectedUserId(null);
        } catch (err) {
            toast.error("Xóa người dùng thất bại! Vui lòng thử lại.");
            console.error('Xóa thất bại:', err);
        }
    };

    return (
        <div className="container-user" style={{ padding: 20 }}>
            <h1>Danh sách người dùng</h1>
            <div className="top-bar">
                <h3 className="page-title">Tổng số bản ghi: {filteredUsers.length}</h3>
                <div className="search-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Nhập để tìm kiếm..."
                        value={searchItem}
                        onChange={(searchUser) => setSearchItem(searchUser.target.value)}
                    // onKeyDown={(searchUser) => {
                    //     if (searchUser.key === 'Enter') handleSearch();
                    // }}
                    />
                    {/* <button className="search-btn" onClick={() => handleSearch()}>Tìm kiếm</button> */}
                </div>
            </div>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Email</th>
                        <th>Tên</th>
                        <th>Quyền</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user, index) => (
                        <tr key={user._id}>
                            <td>{startIndex + index + 1}</td>
                            <td>{user.email}</td>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                            <td>{new Date(user.createdAt).toLocaleString()}</td>
                            <td>
                                <button className="btn-success" onClick={() => handleDeleteClick(user._id)}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Phân trang */}
            <div style={{ marginTop: 20 }}>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>◀</button>
                <span style={{ margin: '0 10px' }}>Trang {currentPage} / {totalPages || 1}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>▶</button>
            </div>

            {/* Modal xác nhận xoá */}
            <UserModal
                open={showModal}
                message="Bạn có chắc chắn muốn xóa tài khoản này không?"
                onConfirm={handleConfirmDelete}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
};

export default UserList;
