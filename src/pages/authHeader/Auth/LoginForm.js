
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { handleLoginApi } from '../../../container/services/userService';
import { userLoginSuccess, userLoginFailure } from '../../../container/redux/userAuthSlice';

function LoginForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const toggleShowPassword = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await handleLoginApi(formData.email, formData.password);
            const { user, token } = response.data;

            // Dispatch action lên Redux, slice sẽ tự động cập nhật state và localStorage
            dispatch(userLoginSuccess({ user, token }));
            console.log("chekc login ", response.data)
            console.log("chekc login ", response.token)
            toast.success(`Chào mừng ${user.name} đã quay trở lại!`);
            navigate('/');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Email hoặc mật khẩu không đúng.';
            dispatch(userLoginFailure(errorMessage));
            toast.error(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form" id="form-login">
            <h3 className="heading">ĐĂNG NHẬP</h3>
            <Link to="/forgot-password" className="form__forgot-password">
                Bạn quên mật khẩu?
            </Link>

            <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input id="email" name="email" type="text" placeholder="VD: email@domain.com" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group matkhau">
                <label htmlFor="password" className="form-label">Mật khẩu</label>
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu" className="form-control" value={formData.password} onChange={handleChange} required />
                <span className="show-hide" onClick={toggleShowPassword} style={{ cursor: 'pointer' }}>
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
            </div>

            <button type="submit" className="form-submit btn-blocker" style={{ borderRadius: 'unset' }}>
                ĐĂNG NHẬP <i className="fas fa-arrow-right" style={{ fontSize: '16px', marginLeft: '10px' }}></i>
            </button>


        </form>
    );
}

export default LoginForm;