import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { handleLoginApi, trackLogin } from '../services/userService';
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

    // const handleSubmit = async (e) => {
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

            const res = await handleLoginApi(form.email, form.password);


            // Dùng destructuring để lấy ra cả user và token từ res.data
            const { user, token } = res.data;
            if (!user || user.role !== 'admin') {
                return setError('Chỉ tài khoản admin mới có quyền truy cập');
            }


            console.log("User đăng nhập:", user);
            console.log("Nhận được Token:", token);

            //  Lưu chuỗi token vào localStorage với key là "token"
            localStorage.setItem('token', token);


            //  dispatch(loginSuccess(user));
            dispatch(adminLoginSuccess({ user, token }));
            localStorage.setItem('authUser', JSON.stringify(user));
            await trackLogin(user.role);

            // 7. Chuyển hướng
            navigate(from);

        } catch (err) {
            const msg = err.response?.data?.message || 'Email hoặc mật khẩu không đúng.';
            setError(msg);
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
