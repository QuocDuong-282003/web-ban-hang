import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { handleAdminLoginApi } from '../services/authService';
import { trackLogin } from '../services/userService';
import { adminLoginSuccess } from '../redux/authSlice';
//const jwt = require('jsonwebtoken');
import './LoginSystemPage.css';
const LoginSystemPage = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/system/dashboard';

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    //     e.preventDefault();
    //     setError('');

    //     try {
    //         const res = await handleLoginApi(form.email, form.password);
    //         const user = res.data.user;

    //         dispatch(loginSuccess(user));
    //         localStorage.setItem('authUser', JSON.stringify(user)); // Lưu local nếu cần
    //         // if (user && user._id) {
    //         //     await trackLogin(user._id); // gọi service để backend tăng loginCount user
    //         // }

    //         navigate(from);
    //     } catch (err) {
    //         setError(err.response?.data?.message || 'Đăng nhập thất bại');
    //     }
    // };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await handleAdminLoginApi(form.email, form.password);

            // Dùng destructuring để lấy ra cả user và token từ res.data
            const { user, token } = res.data;

            // Kiểm tra role admin
            if (!user || user.role !== 'admin') {
                return setError('Chỉ tài khoản admin mới có quyền truy cập');
            }

            // Admin không cần verify email - backend nên tự động bypass verify cho admin
            // Nếu backend vẫn yêu cầu verify, cần sửa backend để bypass check verified cho admin role

            // Lưu token vào localStorage
            localStorage.setItem('token', token);

            // Dispatch action để lưu vào Redux
            dispatch(adminLoginSuccess({ user, token }));
            localStorage.setItem('authUser', JSON.stringify(user));

            // Track login
            await trackLogin(user.role);

            // Chuyển hướng
            navigate(from);

        } catch (err) {
            // Xử lý lỗi từ backend
            const errorMessage = err.response?.data?.message || err.response?.data?.msg || 'Email hoặc mật khẩu không đúng.';

            // Nếu lỗi là về email chưa verify, đây là vấn đề backend
            // Backend cần sửa để bypass verify check cho admin role
            if (errorMessage.includes('xác thực') || errorMessage.includes('verify') || errorMessage.includes('verified')) {
                setError('Lỗi: Tài khoản admin chưa được xác thực email. Vui lòng kiểm tra backend - admin không cần verify email.');
                console.error('Backend đang yêu cầu verify email cho admin. Cần sửa backend để bypass verify check cho admin role.');
            } else {
                setError(errorMessage);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-page" style={{ padding: 50 }}>
            <h2>Đăng nhập hệ thống</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                name="email"
                placeholder="Email"
                value={form.email}

                onChange={handleChange}
                required
            /><br />
            <input
                name="password"
                type="password"

                placeholder="Mật khẩu"
                value={form.password}
                onChange={handleChange}
                required
            /><br />
            <button type="submit">Đăng nhập</button>

            <div style={{ marginTop: 10 }}>
                <Link to="/system/forgot-password">Quên mật khẩu?</Link>
                <Link to="/system/register">Chưa có tài khoản? Đăng ký</Link>
            </div>
        </form>
    );
};

export default LoginSystemPage;
