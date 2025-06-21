import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MobileMenu from '../../components/common/MobileMenu';
import GoToTop from '../../components/common/GoToTop';
import { toast } from 'react-toastify';
import { handleRegisterApi } from '../../container/services/userService';


function RegistrationPage() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, password_confirmation } = formData;

        if (password !== password_confirmation) {
            return toast.error("Mật khẩu không khớp!");
        }

        try {
            await handleRegisterApi(email, password, name);
            toast.success('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại.';
            toast.error(errorMessage);
        }
    };

    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={toggleMobileMenu}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="container">
                <div className="registration__form" style={{ padding: "40px 0" }}>
                    <div className="row justify-content-center">
                        <div className="col-sm-12 col-lg-6">
                            <form onSubmit={handleSubmit} className="form" id="form-register">
                                <h3 className="heading">ĐĂNG KÍ</h3>
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Tên đầy đủ</label>
                                    <input id="name" name="name" type="text" placeholder="VD: Quốc Trung" className="form-control" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input id="email" name="email" type="text" placeholder="VD: email@domain.com" className="form-control" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                                    <input id="password" name="password" type="password" placeholder="Nhập mật khẩu" className="form-control" value={formData.password} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password_confirmation" className="form-label">Nhập lại mật khẩu</label>
                                    <input id="password_confirmation" name="password_confirmation" type="password" placeholder="Nhập lại mật khẩu" className="form-control" value={formData.password_confirmation} onChange={handleChange} required />
                                </div>
                                <button type="submit" className="form-submit btn-blocker" style={{ borderRadius: 'unset' }}>Đăng ký</button>
                                <p style={{ fontSize: '16px', margin: '10px 0', textAlign: 'center' }}>Bạn đã có tài khoản? <Link to="/login" style={{ color: 'black', fontWeight: 'bold' }}>Đăng nhập</Link></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <GoToTop />
        </div>
    );
}

export default RegistrationPage;