import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaCamera } from 'react-icons/fa';

import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MobileMenu from '../../components/common/MobileMenu';
import GoToTop from '../../components/common/GoToTop';

import MyOrdersPage from './MyOrdersPage';

import { updateUserProfile, changeUserPassword, uploadAvatar } from '../../container/services/userService';
import { userLoginSuccess } from '../../container/redux/userAuthSlice';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function AccountManagementPage() {
    const { user } = useSelector(state => state.userAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const query = useQuery();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(query.get('tab') || 'profile');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '/assets/img/product/noavatar.png');
    const fileInputRef = useRef(null);

    const [profileData, setProfileData] = useState({
        name: '', email: '', address: '', phone: ''
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                address: user.address || '',
                phone: user.phone || ''
            });
            setAvatarPreview(user.avatar || '/assets/img/product/noavatar.png');
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

    // Xử lý chọn file avatar và tự động upload
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            // Tự động upload khi chọn file
            try {
                const formData = new FormData();
                formData.append('avatar', file);
                const response = await uploadAvatar(formData);
                const updatedUser = response.data.user;
                dispatch(userLoginSuccess({ user: updatedUser, token: localStorage.getItem('token') }));
                toast.success("Cập nhật ảnh đại diện thành công!");
            } catch (error) {
                toast.error(error.response?.data?.message || "Cập nhật ảnh đại diện thất bại.");
            }
        }
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    if (!user) {
        return null;
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
                            {/* Avatar và tên user */}
                            <div className="heading" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{ position: 'relative', width: 80, height: 80 }}>
                                    <img
                                        src={avatarPreview}
                                        alt="User Avatar"
                                        className="heading-img"
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            border: '2px solid #f00'
                                        }}
                                        onClick={handleAvatarClick}
                                        title="Click để thay đổi ảnh đại diện"
                                    />
                                    <FaCamera
                                        onClick={handleAvatarClick}
                                        style={{
                                            position: 'absolute',
                                            bottom: 4,
                                            right: 4,
                                            background: '#fff',
                                            borderRadius: '50%',
                                            padding: 4,
                                            fontSize: 20,
                                            cursor: 'pointer',
                                            boxShadow: '0 0 4px #ccc'
                                        }}
                                        title="Đổi ảnh đại diện"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                                {/* Tên user không xuống dòng */}
                                <span className="heading-name_acc" style={{ fontWeight: 600, fontSize: 18, whiteSpace: 'nowrap' }}>
                                    {user.name}
                                </span>
                            </div>
                            <div className="menu-manager">
                                <div className={`my-profile-title ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                                    <div className="my-profile-icon"><i className="fas fa-user"></i></div>
                                    <div className="my-profile-name pr-3">Hồ sơ của tôi</div>
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
                            {/* Tab Hồ sơ của tôi */}
                            {activeTab === 'profile' && (
                                <div className="tab-content active">
                                    <div className="heading-edit-account">
                                        <h2>Hồ sơ của tôi</h2>
                                        <form onSubmit={handleProfileSubmit}>
                                            {/* ĐÃ BỎ PHẦN CẬP NHẬT AVATAR Ở ĐÂY */}
                                            <div className="form-group"><label htmlFor="name" className="form-label">Tên đầy đủ</label><input id="name" name="name" type="text" className="form-control" value={profileData.name} onChange={handleProfileChange} /></div>
                                            <div className="form-group"><label htmlFor="email" className="form-label">Email</label><input id="email" name="email" type="email" className="form-control" value={profileData.email} disabled /></div>
                                            <div className="form-group"><label htmlFor="address" className="form-label">Địa chỉ</label><input id="address" name="address" type="text" className="form-control" value={profileData.address} onChange={handleProfileChange} /></div>
                                            <div className="form-group"><label htmlFor="phone" className="form-label">Số điện thoại</label><input id="phone" name="phone" type="tel" className="form-control" value={profileData.phone} onChange={handleProfileChange} /></div>
                                            <button type="submit" className="form-submit">Lưu</button>
                                        </form>
                                    </div>
                                </div>
                            )}
                            {/* Tab Đổi mật khẩu */}
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
                                <div className="tab-content active">
                                    <MyOrdersPage />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <GoToTop />
        </div>
    );
}

export default AccountManagementPage;