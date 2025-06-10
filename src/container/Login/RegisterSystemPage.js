import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleRegisterApi } from '../services/userService';
import './LoginSystemPage.css';

const RegisterSystemPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword, role } = form;

        if (!name || !email || !password || !confirmPassword)
            return setError('Vui lòng điền đầy đủ');

        if (password !== confirmPassword)
            return setError('Mật khẩu không khớp');

        try {
            await handleRegisterApi(email, password, name, role);
            setSuccess(' Tạo tài khoản thành công! Chuyển về đăng nhập...');
            setTimeout(() => navigate('/system/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-page" style={{ padding: 40 }}>
            <h2>Đăng ký tài khoản</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <input name="name" placeholder="Họ và tên" value={form.name} onChange={handleChange} /><br />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} /><br />
            <input type="password" name="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} /><br />
            <input type="password" name="confirmPassword" placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={handleChange} /><br />

            <label>Phân quyền:</label><br />
            <select name="role" value={form.role} onChange={handleChange}>
                <option value="user">Người dùng</option>
                <option value="admin">Quản trị viên</option>
            </select><br /><br />

            <button type="submit">Đăng ký</button>
        </form>
    );
};

export default RegisterSystemPage;
