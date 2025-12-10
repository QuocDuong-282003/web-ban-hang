import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { userLoginSuccess } from '../../container/redux/userAuthSlice';
import {
    registerWithEmail,
    verifyOTPAndRegister,
    forgotPasswordSendOTP,
    verifyOTPAndResetPassword,
    loginWithGoogleToken,
    getMe,
    handleLoginApi
} from '../../container/services/authService';
import './AuthModal.scss';

const AuthModal = ({ isOpen, onClose, onGuestMode }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [view, setView] = useState('main'); // 'main', 'email-login', 'email-register', 'forgot-password'

    // Form Data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otpCode, setOtpCode] = useState('');

    // UI States
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [showPassword, setShowPassword] = useState(false);

    // Messages
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // --- Helpers ---
    const setError = (field, message) => setErrors(prev => ({ ...prev, [field]: message }));
    const clearErrors = () => { setErrors({}); setSuccessMessage(''); };
    const clearFieldError = (field) => setErrors(prev => ({ ...prev, [field]: '' }));

    // Reset khi mở Modal
    useEffect(() => {
        if (isOpen) {
            setView('main');
            clearErrors();
            setLoading(false);
            setOtpSent(false);
            setCountdown(0);
            setEmail('');
            setPassword('');
            setName('');
            setOtpCode('');
        }
    }, [isOpen]);

    // Timer đếm ngược
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    // --- GOOGLE LOGIN ---
    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const response = await loginWithGoogleToken(credentialResponse.credential);
            if (response.message === 'Login success' && response.user) {
                const meResponse = await getMe();
                if (meResponse.success) {
                    dispatch(userLoginSuccess({ user: meResponse.user, token: null }));
                    navigate('/');
                }
            } else {
                alert(response.message || 'Đăng nhập Google thất bại.');
            }
        } catch (error) {
            console.error(error);
            alert('Lỗi đăng nhập Google.');
        }
    };

    const triggerGoogleLogin = () => {
        onClose();
        setTimeout(() => {
            const wrapper = document.getElementById('google-login-wrapper-hidden');
            if (wrapper) wrapper.querySelector('div[role="button"]')?.click();
        }, 50);
    };

    // --- EMAIL LOGIN ---
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        clearErrors();

        try {
            // BƯỚC 1: Gọi API login - backend sẽ cấp token
            const res = await handleLoginApi(email, password);
            const data = res.data; // Axios response structure

            if (res.status === 200 && data.user) {
                // BƯỚC 2: Lưu token vào localStorage trước (nếu có)
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                // BƯỚC 3: Đợi một chút để backend kịp set cookie (nếu dùng HttpOnly cookie)
                await new Promise(resolve => setTimeout(resolve, 200));

                // BƯỚC 4: Sau khi login thành công (có token/cookie), mới gọi /me để lấy thông tin đầy đủ
                try {
                    const me = await getMe();
                    if (me.success && me.user) {
                        // Backend dùng cookie → token = null
                        dispatch(userLoginSuccess({ user: me.user, token: null }));
                    } else {
                        // Fallback: dùng user từ response login
                        dispatch(userLoginSuccess({ user: data.user, token: data.token }));
                    }
                } catch (meError) {
                    // Nếu /me fail, vẫn dùng user từ response login
                    console.log('getMe failed, using login response:', meError);
                    console.log('Error details:', meError.response?.data);
                    dispatch(userLoginSuccess({ user: data.user, token: data.token }));
                }
                onClose();
                navigate('/');
            } else {
                setError('general', data.message || 'Sai thông tin đăng nhập');
            }
        } catch (error) {
            console.error('Login error:', error);
            console.error('Login error response:', error.response?.data);
            const errorMsg = error.response?.data?.message ||
                error.response?.data?.msg ||
                'Lỗi kết nối server';
            setError('general', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // --- REGISTER FLOW ---
    const handleRegisterProcess = async (e) => {
        e.preventDefault();

        // GIAI ĐOẠN 1: Gửi thông tin -> Nhận OTP
        if (!otpSent) {
            clearErrors();
            if (!name || !email || !password) return setError('general', 'Vui lòng điền đủ thông tin');
            if (password.length < 6) return setError('password', 'Mật khẩu tối thiểu 6 ký tự');

            setLoading(true);
            try {
                // Gọi API: /api/auth/register
                const res = await registerWithEmail(email, name, password);
                if (res.success) {
                    setOtpSent(true);
                    setCountdown(60);
                    setSuccessMessage(res.message || 'Mã OTP đã được gửi vào email.');
                } else {
                    setError('general', res.message || 'Không thể gửi OTP');
                }
            } catch (error) {
                setError('general', error.response?.data?.message || 'Lỗi gửi OTP. Email có thể đã tồn tại.');
            } finally {
                setLoading(false);
            }
        }
        // GIAI ĐOẠN 2: Nhập OTP -> Hoàn tất
        else {
            clearErrors();
            if (!otpCode || otpCode.length !== 6) return setError('otpCode', 'Mã OTP gồm 6 số');

            setLoading(true);
            try {
                // Hiển thị loading ít nhất 3 giây để user biết đang xác nhận
                const [apiResponse] = await Promise.all([
                    verifyOTPAndRegister(email, otpCode, name, password),
                    new Promise(resolve => setTimeout(resolve, 3000)) // Delay 3 giây
                ]);

                const res = apiResponse;
                console.log('Verify OTP Response:', res);

                // Kiểm tra đăng ký thành công
                const isSuccess = res.success === true ||
                    res.message === 'Đăng ký thành công' ||
                    res.message === 'Xác thực thành công! Đăng ký hoàn tất.' ||
                    res.verified === true ||
                    res.user ||
                    (res.data && res.data.user);

                if (isSuccess) {
                    // Đăng ký thành công → Chuyển về trang login
                    // Email đã được giữ trong state (sẽ hiển thị sẵn)
                    // Password sẽ được xóa để user phải nhập lại mật khẩu đã tạo
                    const savedEmail = email; // Lưu email trước khi reset
                    setPassword(''); // Xóa password để user phải nhập lại
                    setOtpCode(''); // Xóa OTP code
                    setOtpSent(false); // Reset OTP state
                    setEmail(savedEmail); // Giữ lại email để hiển thị sẵn

                    // Sử dụng successMessage từ response, hoặc fallback
                    const message = res.successMessage ||
                        res.message ||
                        '✅ Xác thực email thành công! Vui lòng đăng nhập bằng email và mật khẩu vừa tạo.';

                    // Xóa các lỗi cũ TRƯỚC khi set successMessage
                    setErrors({});
                    // Sau đó set successMessage
                    setSuccessMessage(message);

                    setView('email-login'); // Chuyển về trang login
                } else {
                    // Đăng ký thất bại
                    setError('general', res.message || res.msg || res.data?.message || 'Đăng ký thất bại');
                }
            } catch (error) {
                console.error('Register error:', error);
                console.error('Error response:', error.response?.data);
                const errorMsg = error.response?.data?.message ||
                    error.response?.data?.msg ||
                    error.message ||
                    'Mã OTP không đúng hoặc đã hết hạn';
                setError('otpCode', errorMsg);
            } finally {
                setLoading(false);
            }
        }
    };

    // --- FORGOT PASSWORD FLOW ---
    const handleForgotSendOTP = async () => {
        clearErrors();
        if (!email) return setError('email', 'Vui lòng nhập email');

        setLoading(true);
        try {
            // Gọi API: /api/auth/forgot-password-send-otp
            const res = await forgotPasswordSendOTP(email);
            if (res.success) {
                setOtpSent(true);
                setCountdown(60);
                setSuccessMessage(res.msg || 'Mã OTP khôi phục đã được gửi.'); // Backend trả về 'msg' ở dòng 1007 authController
            } else {
                setError('general', res.msg || 'Không thể gửi OTP');
            }
        } catch (error) {
            setError('general', error.response?.data?.msg || 'Email không tồn tại hoặc lỗi hệ thống.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        clearErrors();
        if (!otpCode || !password) return setError('general', 'Vui lòng nhập đủ thông tin');
        if (password.length < 6) return setError('password', 'Mật khẩu mới phải > 6 ký tự');

        setLoading(true);
        try {
            // Gọi API: /api/auth/verify-forgot-password-otp
            const res = await verifyOTPAndResetPassword(email, otpCode, password);
            if (res.success) {
                setSuccessMessage('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
                setTimeout(() => {
                    setView('email-login'); // Chuyển về trang đăng nhập
                    setOtpSent(false);
                    setPassword('');
                    setOtpCode('');
                    clearErrors();
                }, 2000);
            } else {
                setError('general', res.msg || 'Lỗi đổi mật khẩu');
            }
        } catch (error) {
            setError('general', error.response?.data?.msg || 'OTP sai hoặc hết hạn');
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER ---
    const isLoginView = view === 'email-login' || view === 'forgot-password';
    const isRegisterView = view === 'email-register';
    const activeTab = isLoginView ? 'login' : isRegisterView ? 'signup' : null;

    return (
        <>
            {/* Google Hidden Button */}
            <div id="google-login-wrapper-hidden" style={{ position: 'fixed', top: '-9999px', visibility: 'hidden' }}>
                <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => { }} useOneTap={false} />
            </div>

            {isOpen && (
                <div className="auth-modal-overlay" onClick={onClose}>
                    <div className="auth-modal" onClick={e => e.stopPropagation()}>
                        <button className="auth-modal-close" onClick={onClose}>×</button>

                        <div className="auth-modal-container">
                            {/* LEFT SIDE - DECORATIVE */}
                            <div className="auth-modal-left">
                                <div className="auth-decorative-shapes">
                                    <div className="shape shape-1"></div>
                                    <div className="shape shape-2"></div>
                                    <div className="shape shape-3"></div>
                                </div>
                                <div className="auth-welcome-text">
                                    <h1 className="auth-welcome-title">
                                        <span className="auth-welcome-line-1">Chào mừng tới</span>
                                        <span className="auth-welcome-line-2">F&T Shop</span>
                                    </h1>
                                </div>
                            </div>

                            {/* RIGHT SIDE - FORM */}
                            <div className="auth-modal-right">
                                <div className="auth-modal-content">
                                    <p className="auth-subtitle">Chúng tôi có một ưu đãi vô cùng hấp dẫn!</p>

                                    {/* TABS - Only show when in login or register view */}
                                    {(isLoginView || isRegisterView) && (
                                        <div className="auth-tabs">
                                            <button
                                                type="button"
                                                className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                                                onClick={() => { setView('email-login'); clearErrors(); }}
                                            >
                                                Login
                                            </button>
                                            <button
                                                type="button"
                                                className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
                                                onClick={() => { setView('email-register'); clearErrors(); setOtpSent(false); }}
                                            >
                                                Sign up
                                            </button>
                                        </div>
                                    )}

                                    {/* VIEW: MAIN */}
                                    {view === 'main' && (
                                        <>
                                            <div className="auth-btn-google-wrapper">
                                                <button className="auth-btn-google-custom" onClick={triggerGoogleLogin}>
                                                    <svg viewBox="0 0 24 24" width="20" height="20">
                                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                    </svg>
                                                    <span>Google</span>
                                                </button>
                                            </div>
                                            <button className="auth-btn-email-custom" onClick={() => setView('email-login')}>
                                                <svg className="email-icon-custom" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <span>Đăng nhập bằng Email</span>
                                            </button>
                                            <div className="auth-links-section">
                                                <a href="#reg" className="auth-link-primary" onClick={e => { e.preventDefault(); setView('email-register'); }}>Đăng ký tài khoản mới</a>
                                            </div>

                                            <div className="auth-promo-section">
                                                <p className="auth-promo-text">
                                                    Giá thấp hơn và nhiều phần thưởng đang chờ bạn. Mở khóa ưu đãi bằng cách đăng nhập!
                                                </p>
                                                <p className="auth-terms-text">
                                                    Bằng cách tiếp tục, bạn đồng ý với{' '}
                                                    <a href="#terms" className="auth-link-terms" onClick={e => { e.preventDefault(); }}>Điều khoản và Điều kiện</a>
                                                    {' '}này và bạn đã được thông báo về{' '}
                                                    <a href="#privacy" className="auth-link-terms" onClick={e => { e.preventDefault(); }}>Chính sách bảo vệ dữ liệu</a>
                                                    {' '}của chúng tôi.
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    {/* VIEW: LOGIN */}
                                    {view === 'email-login' && (
                                        <form onSubmit={handleEmailLogin} className="auth-form">
                                            {successMessage && <div className="auth-message auth-message-success">{successMessage}</div>}
                                            {errors.general && <div className="auth-message auth-message-error">{errors.general}</div>}

                                            <div className="auth-form-group">
                                                <label>Email / Username</label>
                                                <input type="email" value={email} onChange={e => { setEmail(e.target.value); clearFieldError('email'); }} required />
                                            </div>
                                            <div className="auth-form-group">
                                                <label>Password</label>
                                                <input type="password" value={password} onChange={e => { setPassword(e.target.value); clearFieldError('password'); }} required />
                                            </div>

                                            <div className="auth-forgot-password">
                                                <a href="#forgot" className="auth-link-forgot" onClick={e => { e.preventDefault(); setView('forgot-password'); }}>Forgot password?</a>
                                            </div>

                                            <button className="auth-submit-btn" disabled={loading}>{loading ? 'Đang xử lý...' : 'Login'}</button>

                                            <div className="auth-divider">
                                                <span>OR</span>
                                            </div>

                                            <button type="button" className="auth-btn-google-custom" onClick={triggerGoogleLogin}>
                                                <svg viewBox="0 0 24 24" width="20" height="20">
                                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                                <span>Google</span>
                                            </button>

                                            <div className="auth-signup-prompt">
                                                <span>Don't have an account? </span>
                                                <a href="#signup" className="auth-link-signup" onClick={e => { e.preventDefault(); setView('email-register'); }}>Sign up</a>
                                            </div>
                                        </form>
                                    )}

                                    {/* VIEW: REGISTER */}
                                    {view === 'email-register' && (
                                        <form onSubmit={handleRegisterProcess} className="auth-form">
                                            {successMessage && <div className="auth-message auth-message-success">{successMessage}</div>}
                                            {errors.general && <div className="auth-message auth-message-error">{errors.general}</div>}

                                            {!otpSent ? (
                                                <>
                                                    <div className="auth-form-group">
                                                        <label>Tên hiển thị</label>
                                                        <input type="text" value={name} onChange={e => { setName(e.target.value); clearFieldError('name'); }} required />
                                                    </div>
                                                    <div className="auth-form-group">
                                                        <label>Email</label>
                                                        <input type="email" value={email} onChange={e => { setEmail(e.target.value); clearFieldError('email'); }} required />
                                                    </div>
                                                    <div className="auth-form-group">
                                                        <label>Password</label>
                                                        <div style={{ position: 'relative' }}>
                                                            <input type={showPassword ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); clearFieldError('password'); }} required />
                                                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                                                style={{ position: 'absolute', right: 14, top: 14, cursor: 'pointer', color: '#9ca3af' }}
                                                                onClick={() => setShowPassword(!showPassword)}></i>
                                                        </div>
                                                        {errors.password && <div className="auth-field-error">{errors.password}</div>}
                                                    </div>
                                                    <button className="auth-submit-btn" disabled={loading}>{loading ? 'Đang gửi...' : 'Sign up'}</button>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-center text-muted">OTP đã gửi đến <strong>{email}</strong></p>
                                                    <div className="auth-form-group">
                                                        <label>Mã OTP {countdown > 0 && `(${countdown}s)`}</label>
                                                        <input value={otpCode} onChange={e => setOtpCode(e.target.value)} style={{ textAlign: 'center', letterSpacing: '4px' }} maxLength={6} />
                                                        {errors.otpCode && <div className="auth-field-error">{errors.otpCode}</div>}
                                                    </div>
                                                    <button className="auth-submit-btn" disabled={loading}>{loading ? 'Đang xử lý...' : 'Xác thực & Hoàn tất'}</button>
                                                    {countdown === 0 && <span className="auth-link text-center d-block mt-2" onClick={() => { setOtpSent(false); }}>Gửi lại mã?</span>}
                                                </>
                                            )}
                                        </form>
                                    )}

                                    {/* VIEW: FORGOT PASSWORD */}
                                    {view === 'forgot-password' && (
                                        <div className="auth-form">
                                            {successMessage && <div className="auth-message auth-message-success">{successMessage}</div>}
                                            {errors.general && <div className="auth-message auth-message-error">{errors.general}</div>}

                                            {!otpSent ? (
                                                <>
                                                    <div className="auth-form-group">
                                                        <label>Nhập Email của bạn</label>
                                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                                                    </div>
                                                    <button className="auth-submit-btn" onClick={handleForgotSendOTP} disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi mã OTP'}</button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="auth-form-group">
                                                        <label>Mã OTP</label>
                                                        <input value={otpCode} onChange={e => setOtpCode(e.target.value)} maxLength={6} style={{ textAlign: 'center' }} />
                                                    </div>
                                                    <div className="auth-form-group">
                                                        <label>Mật khẩu mới</label>
                                                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                                                    </div>
                                                    <button className="auth-submit-btn" onClick={handleResetPassword} disabled={loading}>{loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}</button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AuthModal;