import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';
//import Validator from '../utils/validator'; // Giả sử đã chuyển validator.js
// import './AccountManagementPage.css'; // CSS riêng nếu cần
import OrderItem from '../components/account/OrderItem'; // Component con

// Dữ liệu mẫu
const sampleUser = {
    fullname: 'Quốc Trung',
    email: 'abc@gmail.com',
    address: '86 Đinh Bộ Lĩnh Phường 26 Quận Bình Thạnh TP.HCM',
    sdt: '0912420530',
    avatar: './assets/img/product/noavatar.png'
};

const sampleOrders = [
    { id: '#1', date: '05-06-2021', total: 3000000, status: 'Đang xác nhận', statusColor: 'blue', items: [{ name: 'Adidas Smith', quantity: 3, price: 1000000, img: './assets/img/product/addidas1.jpg' }] },
    { id: '#2', date: '05-06-2021', total: 3000000, status: 'Đã giao', statusColor: 'green', items: [] },
    { id: '#3', date: '05-06-2021', total: 3000000, status: 'Đã hủy', statusColor: 'red', items: [] }
];


function AccountManagementPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'order', 'password'
    const [userData, setUserData] = useState(sampleUser);
    const [passwordData, setPasswordData] = useState({ old_password: '', 'password-new': '', 'password-confirm': '' });
    const [profileErrors, setProfileErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});
    const [orders, setOrders] = useState(sampleOrders);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);

    // State cho show/hide password
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);


    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleProfileChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };
    const handleAvatarChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            // Xử lý upload avatar ở đây, ví dụ:
            const reader = new FileReader();
            reader.onload = (event) => {
                setUserData({ ...userData, avatar: event.target.result }); // Hiển thị preview
            };
            reader.readAsDataURL(e.target.files[0]);
            // setUserData({ ...userData, avatarFile: e.target.files[0] }); // Lưu file để upload
        }
    };


    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        const tempErrors = {};
        if (!userData.fullname) tempErrors.fullname = "Vui lòng nhập họ tên";
        if (!userData.email) tempErrors.email = "Vui lòng nhập email";
        else if (!/\S+@\S+\.\S+/.test(userData.email)) tempErrors.email = "Email không hợp lệ";
        // Thêm các validate khác nếu cần
        setProfileErrors(tempErrors);
        if (Object.keys(tempErrors).length === 0) {
            console.log('Profile updated:', userData);
            alert('Cập nhật hồ sơ thành công!');
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        const tempErrors = {};
        if (!passwordData.old_password) tempErrors.old_password = "Vui lòng nhập mật khẩu cũ";
        if (!passwordData['password-new']) tempErrors['password-new'] = "Vui lòng nhập mật khẩu mới";
        else if (passwordData['password-new'].length < 6) tempErrors['password-new'] = "Mật khẩu mới phải có ít nhất 6 ký tự";
        if (passwordData['password-new'] !== passwordData['password-confirm']) tempErrors['password-confirm'] = "Mật khẩu xác nhận không khớp";

        setPasswordErrors(tempErrors);
        if (Object.keys(tempErrors).length === 0) {
            console.log('Password change request:', passwordData);
            alert('Đổi mật khẩu thành công! (Trong thực tế cần xác thực mật khẩu cũ)');
            setPasswordData({ old_password: '', 'password-new': '', 'password-confirm': '' });
        }
    };

    const handleShowOrderDetail = (order) => {
        setSelectedOrderDetails(order);
        setShowOrderDetailModal(true);
    };
    const handleCloseOrderDetail = () => {
        setShowOrderDetailModal(false);
        setSelectedOrderDetails(null);
    }


    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={isMobileMenuOpen ? toggleMobileMenu : null}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="container">
                <div className="wrapper">
                    <div className="row">
                        <div className="col-md-4 col-12">
                            <div className="heading">
                                <img src={userData.avatar} alt="User Avatar" className="heading-img" />
                                <span className="heading-name_acc">{userData.fullname}</span>
                            </div>
                            <div className="menu-manager">
                                <div className={`my-profile-title ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                                    <div className="my-profile-icon"><i className="fas fa-user"></i></div>
                                    <div className="my-profile-name">Hồ sơ của tôi</div>
                                </div>
                                <div className={`my-order-title ${activeTab === 'order' ? 'active' : ''}`} onClick={() => setActiveTab('order')}>
                                    <div className="my-order-icon"><i className="fas fa-shopping-bag"></i></div>
                                    <div className="my-order-name">Đơn hàng của tôi</div>
                                </div>
                                <div className={`my-password-title ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>
                                    <div className="my-password-icon"><i className="fas fa-key"></i></div>
                                    <div className="my-password-name">Đổi mật khẩu</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8 col-12">
                            {activeTab === 'profile' && (
                                <div className="tab-content active"> {/* Thêm class 'active' */}
                                    <div className="heading-edit-account">
                                        <h2>Hồ sơ của tôi</h2>
                                        <form onSubmit={handleProfileSubmit}>
                                            <div className="form-group">
                                                <label htmlFor="fullname" className="form-label">Tên đầy đủ</label>
                                                <input id="fullname" name="fullname" type="text" className="form-control" value={userData.fullname} onChange={handleProfileChange} />
                                                {profileErrors.fullname && <span className="form-message">{profileErrors.fullname}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <input id="email" name="email" type="email" className="form-control" value={userData.email} onChange={handleProfileChange} />
                                                {profileErrors.email && <span className="form-message">{profileErrors.email}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="address" className="form-label">Địa chỉ</label>
                                                <input id="address" name="address" type="text" className="form-control" value={userData.address} onChange={handleProfileChange} />
                                                {profileErrors.address && <span className="form-message">{profileErrors.address}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="sdt" className="form-label">Số điện thoại</label>
                                                <input id="sdt" name="sdt" type="tel" className="form-control" value={userData.sdt} onChange={handleProfileChange} />
                                                {profileErrors.sdt && <span className="form-message">{profileErrors.sdt}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="avatar" className="form-label">Cập nhật avatar</label>
                                                <input id="avatar" name="avatarFile" type="file" className="form-control" onChange={handleAvatarChange} accept="image/*" />
                                                {/* {profileErrors.avatar && <span className="form-message">{profileErrors.avatar}</span>} */}
                                            </div>
                                            <button type="submit" className="form-submit">Lưu</button>
                                        </form>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'password' && (
                                <div className="tab-content active"> {/* Thêm class 'active' */}
                                    <div className="heading-edit-password"><h2>Đổi lại mật khẩu</h2></div>
                                    <form onSubmit={handlePasswordSubmit}>
                                        <div className="form-group form-group-old-password">
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <label htmlFor="old_password" className="form-label">Mật khẩu cũ</label>
                                                <span className="show-hide" onClick={() => setShowOldPassword(!showOldPassword)} style={{ cursor: 'pointer' }}><i className={`fas ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i></span>
                                            </div>
                                            <input id="old_password" name="old_password" type={showOldPassword ? "text" : "password"} placeholder="Nhập mật khẩu cũ" className="form-control" value={passwordData.old_password} onChange={handlePasswordChange} />
                                            {passwordErrors.old_password && <span className="form-message">{passwordErrors.old_password}</span>}
                                        </div>
                                        <div className="form-group form-group-new-password">
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <label htmlFor="password-new" className="form-label">Mật khẩu mới</label>
                                                <span className="show-hide-two" onClick={() => setShowNewPassword(!showNewPassword)} style={{ cursor: 'pointer' }}><i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'} fa-eye-2`}></i></span>
                                            </div>
                                            <input id="password-new" name="password-new" type={showNewPassword ? "text" : "password"} placeholder="Nhập mật khẩu mới" className="form-control" value={passwordData['password-new']} onChange={handlePasswordChange} />
                                            {passwordErrors['password-new'] && <span className="form-message">{passwordErrors['password-new']}</span>}
                                        </div>
                                        <div className="form-group form-group-confirm-password">
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <label htmlFor="password-confirm" className="form-label">Xác nhận mật khẩu mới</label>
                                                <span className="show-hide-three" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} style={{ cursor: 'pointer' }}><i className={`fas ${showConfirmNewPassword ? 'fa-eye-slash' : 'fa-eye'} fa-eye-3`}></i></span>
                                            </div>
                                            <input id="password-confirm" name="password-confirm" type={showConfirmNewPassword ? "text" : "password"} placeholder="Xác nhận mật khẩu mới" className="form-control" value={passwordData['password-confirm']} onChange={handlePasswordChange} />
                                            {passwordErrors['password-confirm'] && <span className="form-message">{passwordErrors['password-confirm']}</span>}
                                        </div>
                                        <button type="submit" className="form-submit">Lưu</button>
                                    </form>
                                </div>
                            )}
                            {activeTab === 'order' && (
                                <div className="tab-content active"> {/* Thêm class 'active' */}
                                    <div className="heading-edit-password"><h2>Đơn hàng của bạn</h2></div>
                                    <div className="detail__my-order-content">
                                        <div className="my-order-heading d-none d-md-block"> {/* Hide on mobile */}
                                            <div className="row">
                                                <div className="col-2">MĐH</div>
                                                <div className="col-3">Ngày</div>
                                                <div className="col-3">Tổng tiền</div>
                                                <div className="col-2">Trạng thái</div>
                                                <div className="col-2">Chi tiết</div>
                                            </div>
                                        </div>
                                        <div className="my-order-body">
                                            {orders.length > 0 ? orders.map(order => (
                                                <OrderItem key={order.id} order={order} onShowDetail={handleShowOrderDetail} />
                                            )) : <p>Bạn chưa có đơn hàng nào.</p>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            {showOrderDetailModal && selectedOrderDetails && (
                <div className="modal fade show" style={{ display: 'block' }} id="orderDetailModal" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title">Chi tiết đơn hàng {selectedOrderDetails.id}</h3>
                                <button type="button" className="close" onClick={handleCloseOrderDetail} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ marginTop: '10px' }}>
                                <div className="body-one" style={{ marginBottom: '20px' }}>
                                    {/* Thông tin chi tiết đơn hàng */}
                                    <p><strong>Ngày đặt:</strong> {selectedOrderDetails.date}</p>
                                    <p><strong>Trạng thái:</strong> <span className={`btn-stt ${selectedOrderDetails.statusColor}`}>{selectedOrderDetails.status}</span></p>
                                    <hr />
                                    <p><strong>Tổng tiền hàng:</strong> {selectedOrderDetails.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString('vi-VN')} VNĐ</p>
                                    <p><strong>Phí ship:</strong> 30,000 VNĐ</p>
                                    <p><strong>Thành tiền:</strong> {selectedOrderDetails.total.toLocaleString('vi-VN')} VNĐ</p>
                                </div>
                                <div className="my-order-heading" style={{ fontWeight: 'bold' }}>
                                    <div className="row" style={{ textAlign: 'center' }}>
                                        <div className="col-4">Sản phẩm</div>
                                        <div className="col-2">Số lượng</div>
                                        <div className="col-3">Giá</div>
                                        <div className="col-3">Tổng</div>
                                    </div>
                                </div>
                                <div className="body-two">
                                    {selectedOrderDetails.items.map((item, index) => (
                                        <div className="row" style={{ textAlign: 'center', marginTop: '10px', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }} key={index}>
                                            <div className="col-4" style={{ display: 'flex', alignItems: 'center', textAlign: 'left' }}>
                                                <img src={item.img} alt={item.name} style={{ width: '50px', height: '50px', marginRight: '10px', border: '1px solid #ddd' }} />
                                                <h5 style={{ fontSize: '0.9rem', margin: 0 }}>{item.name}</h5>
                                            </div>
                                            <div className="col-2">{item.quantity}</div>
                                            <div className="col-3">{item.price.toLocaleString('vi-VN')} VNĐ</div>
                                            <div className="col-3">{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={handleCloseOrderDetail}>Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showOrderDetailModal && <div className="modal-backdrop fade show"></div>}


            <Footer />
            <GoToTop />
        </div>
    );
}

export default AccountManagementPage;