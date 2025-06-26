import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MobileMenu from '../../components/common/MobileMenu';
import GoToTop from '../../components/common/GoToTop';
import OrderItem from '../../components/account/OrderItem';

import { updateUserProfile, changeUserPassword } from '../../container/services/userService';
import { userLoginSuccess } from '../../container/redux/userAuthSlice';

function AccountManagementPage() {
    const { user } = useSelector(state => state.userAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const [profileData, setProfileData] = useState({
        name: '', email: '', address: '', phone: ''
    });

    // State cho form đổi mật khẩu
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    // Mock data for orders, giữ nguyên
    const [orders, setOrders] = useState([]); // Cần lấy từ API sau
    const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                address: user.address || '',
                phone: user.phone || ''
            });
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateUserProfile(profileData);
            const updatedUser = response.data.user;
            dispatch(userLoginSuccess({ user: updatedUser, token: localStorage.getItem('token') }));
            toast.success("Cập nhật thông tin thành công!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Cập nhật thất bại.");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword.length < 6) {
            return toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
        }
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            return toast.error("Mật khẩu mới không khớp!");
        }

        try {
            await changeUserPassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Đổi mật khẩu thành công!");
            setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại.");
        }
    };

    // Các hàm cho modal chi tiết đơn hàng (giữ nguyên)
    const handleShowOrderDetail = (order) => { /* Logic của bạn */ };
    const handleCloseOrderDetail = () => { /* Logic của bạn */ };

    if (!user) {
        return null; // Hoặc một màn hình loading
    }

    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={toggleMobileMenu}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="container">
                <div className="wrapper">
                    <div className="row">
                        <div className="col-md-4 col-12">
                            <div className="heading">
                                <img src="/assets/img/product/noavatar.png" alt="User Avatar" className="heading-img" />
                                <span className="heading-name_acc">{user.name}</span>
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
                                <div className="tab-content active">
                                    <div className="heading-edit-account">
                                        <h2>Hồ sơ của tôi</h2>
                                        <form onSubmit={handleProfileSubmit}>
                                            {/* ... các input của form profile ... */}
                                            <div className="form-group"><label htmlFor="name" className="form-label">Tên đầy đủ</label><input id="name" name="name" type="text" className="form-control" value={profileData.name} onChange={handleProfileChange} /></div>
                                            <div className="form-group"><label htmlFor="email" className="form-label">Email</label><input id="email" name="email" type="email" className="form-control" value={profileData.email} disabled /></div>
                                            <div className="form-group"><label htmlFor="address" className="form-label">Địa chỉ</label><input id="address" name="address" type="text" className="form-control" value={profileData.address} onChange={handleProfileChange} /></div>
                                            <div className="form-group"><label htmlFor="phone" className="form-label">Số điện thoại</label><input id="phone" name="phone" type="tel" className="form-control" value={profileData.phone} onChange={handleProfileChange} /></div>
                                            <button type="submit" className="form-submit">Lưu</button>
                                        </form>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'password' && (
                                <div className="tab-content active">
                                    <div className="heading-edit-password"><h2>Đổi lại mật khẩu</h2></div>
                                    <form onSubmit={handlePasswordSubmit}>
                                        <div className="form-group">
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <label className="form-label">Mật khẩu cũ</label>
                                                <span onClick={() => setShowOldPassword(!showOldPassword)} style={{ cursor: 'pointer' }}><i className={`fas ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i></span>
                                            </div>
                                            <input name="oldPassword" type={showOldPassword ? "text" : "password"} placeholder="Nhập mật khẩu cũ" className="form-control" value={passwordData.oldPassword} onChange={handlePasswordChange} required />
                                        </div>
                                        <div className="form-group">
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <label className="form-label">Mật khẩu mới</label>
                                                <span onClick={() => setShowNewPassword(!showNewPassword)} style={{ cursor: 'pointer' }}><i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i></span>
                                            </div>
                                            <input name="newPassword" type={showNewPassword ? "text" : "password"} placeholder="Nhập mật khẩu mới" className="form-control" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                                        </div>
                                        <div className="form-group">
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <label className="form-label">Xác nhận mật khẩu mới</label>
                                                <span onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} style={{ cursor: 'pointer' }}><i className={`fas ${showConfirmNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i></span>
                                            </div>
                                            <input name="confirmNewPassword" type={showConfirmNewPassword ? "text" : "password"} placeholder="Xác nhận mật khẩu mới" className="form-control" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required />
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
