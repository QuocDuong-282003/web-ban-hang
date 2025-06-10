import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { handleLoginApi, trackLogin } from '../services/userService';
import { loginSuccess } from '../redux/authSlice';

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
            const user = res.data.user;

            if (user.role !== 'admin') {
                return setError(' Chỉ tài khoản admin mới có quyền truy cập');
            }
            console.log("chekc user", user)

            dispatch(loginSuccess(user));
            localStorage.setItem('authUser', JSON.stringify(user)); // nếu cần
            await trackLogin(user.role);
            // navigate('/system/dashboard');
            navigate(from);
        } catch (err) {
            const msg = err.response?.data?.message || 'Đăng nhập thất bại';
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
