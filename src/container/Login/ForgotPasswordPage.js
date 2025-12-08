import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    checkEmailExist,
    updatePasswordUser
} from '../services/authService';
import './ForgotPasswordPage.css';
const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState('verify'); // verify | reset | done
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        const exists = await checkEmailExist(email);
        if (exists) {
            setStep('reset');
            setMessage('');
        } else {
            setMessage(' Email không tồn tại trong hệ thống.');
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();

        if (newPassword !== repeatPassword) {
            return setMessage(' Mật khẩu nhập lại không khớp.');
        }

        const updated = await updatePasswordUser(email, newPassword);
        if (updated) {
            setStep('done');
            setTimeout(() => navigate('/system/login'), 2000);
        } else {
            setMessage(' Cập nhật mật khẩu thất bại.');
        }
    };

    return (
        <div className="container" style={{ maxWidth: 500, margin: 'auto', paddingTop: 40 }}>
            <h1>Khôi phục mật khẩu</h1>
            <p>Vui lòng nhập email để đặt lại mật khẩu</p>
            <hr />

            {step === 'verify' && (
                <form onSubmit={handleVerify}>
                    <label htmlFor="email"><b>Email</b></label>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {message && <p style={{ color: 'red' }}>{message}</p>}

                    <div className="clearfix" style={{ marginTop: 20 }}>
                        <button type="submit" className="signupbtn">Tiếp tục</button>
                    </div>
                </form>
            )}

            {step === 'reset' && (
                <form onSubmit={handleReset}>
                    <label htmlFor="psw"><b>Mật khẩu mới</b></label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        name="psw"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <label htmlFor="psw-repeat"><b>Nhập lại mật khẩu</b></label>
                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        name="psw-repeat"
                        required
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />

                    <label>
                        <input type="checkbox" defaultChecked name="remember" style={{ marginBottom: 15 }} />
                        Ghi nhớ tôi
                    </label>

                    <p>Khi đặt lại mật khẩu bạn đồng ý với <a href="#" style={{ color: 'dodgerblue' }}>Chính sách & Bảo mật</a>.</p>

                    {message && <p style={{ color: 'red' }}>{message}</p>}

                    <div className="clearfix" style={{ marginTop: 20 }}>
                        <button type="button" className="cancelbtn" onClick={() => navigate('/system/login')}>Hủy</button>
                        <button type="submit" className="signupbtn">Đặt lại mật khẩu</button>
                    </div>
                </form>
            )}

            {step === 'done' && (
                <p style={{ color: 'green' }}> Mật khẩu đã được cập nhật. Đang chuyển về trang đăng nhập...</p>
            )}
        </div>
    );
};

export default ForgotPasswordPage;
