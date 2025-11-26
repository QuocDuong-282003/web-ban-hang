import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { userLoginSuccess } from '../../container/redux/userAuthSlice';
import {
    sendOTP,
    loginWithOTP,
    registerWithOTP,
    registerWithEmail,
    verifyOTPAndRegister,
    loginWithGoogleToken,
    getMe,
    handleLoginApi
} from '../../container/services/userService';
import './AuthModal.scss';

const AuthModal = ({ isOpen, onClose, onGuestMode }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [view, setView] = useState('main'); // main, email-login, email-register, otp-login, otp-register
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0); // Timer đếm ngược
    const [showPassword, setShowPassword] = useState(false);
    const googleLoginRef = useRef(null); // Ref để trigger Google login button

    // Error messages state - hiển thị dưới các input
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        name: '',
        otpCode: '',
        general: '' // Lỗi chung không liên quan đến field cụ thể
    });
    const [successMessage, setSuccessMessage] = useState(''); // Thông báo thành công

    // Helper function để set error cho một field
    const setError = (field, message) => {
        setErrors(prev => ({ ...prev, [field]: message }));
    };

    // Helper function để clear tất cả errors
    const clearErrors = () => {
        setErrors({
            email: '',
            password: '',
            name: '',
            otpCode: '',
            general: ''
        });
        setSuccessMessage('');
    };

    // Helper function để clear error của một field khi user bắt đầu nhập
    const clearFieldError = (field) => {
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    if (!isOpen) return null;

    // ============ GOOGLE OAUTH2 LOGIN ============
    /**
     * Handle Google login success
     * This function is called when user successfully authenticates with Google
     * 
     * Flow:
     * 1. Receive id_token from Google OAuth popup
     * 2. Send id_token to backend /api/auth/google
     * 3. Backend verifies token, creates/finds user, sets HttpOnly cookie
     * 4. Get user info from /api/me endpoint (reads from cookie)
     * 5. Update Redux state with user info
     * 6. Show success message and close modal
     */
    const handleGoogleLoginSuccess = async (credentialResponse) => {
        setLoading(true);
        clearErrors(); // Clear previous errors
        try {
            // Step 1: Send Google id_token to backend
            // The credential is an ID token from Google that we need to verify on the backend
            const response = await loginWithGoogleToken(credentialResponse.credential);

            // Step 2: Check if backend successfully verified the token and created JWT
            if (response.message === 'Login success' && response.user) {
                // Step 3: Get user info from /api/me endpoint
                // This endpoint reads the JWT from HttpOnly cookie that was set by backend
                const meResponse = await getMe();

                // Step 4: Check if we got user info successfully
                if (meResponse.success && meResponse.user) {
                    // Step 5: Update Redux state with user info
                    // Note: We don't store token in localStorage because it's in HttpOnly cookie
                    dispatch(userLoginSuccess({
                        user: meResponse.user,
                        token: null // Token is in HttpOnly cookie, not accessible via JavaScript
                    }));

                    // Step 6: Close modal and navigate (không cần thông báo, đóng modal là đủ)
                    onClose(); // Close modal
                    navigate('/'); // Navigate to home page
                } else {
                    // If we can't get user info, show error
                    setError('general', 'Đăng nhập thành công nhưng không thể lấy thông tin người dùng.');
                }
            } else {
                // Backend returned an error
                setError('general', response.message || 'Đăng nhập Google thất bại.');
            }
        } catch (error) {
            // Handle any errors during the login process
            console.error('Google login error:', error);

            // Extract error message from response or use default
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Không thể đăng nhập bằng Google. Vui lòng thử lại.';
            setError('general', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle Google login error
     * This function is called if Google authentication fails (user cancels, etc.)
     */
    const handleGoogleLoginError = () => {
        setError('general', 'Đăng nhập Google thất bại. Vui lòng thử lại.');
        setLoading(false);
    };

    /**
     * Trigger Google login programmatically
     * This function clicks the hidden GoogleLogin button
     */
    const triggerGoogleLogin = () => {
        // Find and click the GoogleLogin button
        const googleButton = document.querySelector('[data-testid="google-login-button"]');
        if (googleButton) {
            googleButton.click();
        } else {
            // Fallback: try to find any button inside GoogleLogin component
            setTimeout(() => {
                const buttons = document.querySelectorAll('button, div[role="button"]');
                buttons.forEach(btn => {
                    if (btn.textContent?.includes('Google') || btn.querySelector('svg')) {
                        btn.click();
                    }
                });
            }, 100);
        }
    };

    // ============ EMAIL + PASSWORD LOGIN ============
    /**
     * Handle email login with password
     * Flow:
     * 1. Send email and password to backend /api/login
     * 2. Backend verifies credentials and returns token
     * 3. Get user info from /api/me endpoint (reads from cookie if backend sets it)
     * 4. Update Redux state with user info
     */
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        clearErrors(); // Clear previous errors

        try {
            // Validate input
            let hasError = false;
            if (!email) {
                setError('email', 'Vui lòng nhập email');
                hasError = true;
            }
            if (!password) {
                setError('password', 'Vui lòng nhập mật khẩu');
                hasError = true;
            }
            if (hasError) {
                setLoading(false);
                return;
            }

            // Call API login
            const response = await handleLoginApi(email, password);
            const data = response.data;

            if (response.status === 200 && data.user) {
                // Login successful
                // Try to get user info from cookie (if backend sets HttpOnly cookie)
                try {
                    const meResponse = await getMe();
                    if (meResponse.success && meResponse.user) {
                        // Backend sets HttpOnly cookie - use cookie-based auth
                        dispatch(userLoginSuccess({
                            user: meResponse.user,
                            token: null // Token is in HttpOnly cookie
                        }));
                    } else {
                        // Backend doesn't set cookie - use token from response
                        dispatch(userLoginSuccess({
                            user: data.user,
                            token: data.token
                        }));
                    }
                } catch (error) {
                    // If /api/me fails, use token from login response
                    dispatch(userLoginSuccess({
                        user: data.user,
                        token: data.token
                    }));
                }

                // Đóng modal và navigate (không cần thông báo)
                onClose();
                navigate('/');
            } else {
                setError('general', data.message || 'Email hoặc mật khẩu không đúng');
            }
        } catch (error) {
            console.error('Email login error:', error);
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Đăng nhập thất bại. Vui lòng thử lại.';
            setError('general', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Send OTP
    const handleSendOTP = async (type) => {
        clearErrors(); // Clear previous errors

        if (!email) {
            setError('email', 'Vui lòng nhập email');
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('email', 'Email không hợp lệ');
            return false;
        }

        setLoading(true);
        try {
            const response = await sendOTP(email, type);

            // Kiểm tra response thành công
            if (response && response.status === 200 && response.data) {
                setOtpSent(true);
                setCountdown(60); // Bắt đầu đếm ngược 60 giây
                setSuccessMessage(response.data.message || 'Mã OTP đã được gửi đến email của bạn');

                // Timer đếm ngược
                const timer = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
                return true;
            } else {
                setError('general', response?.data?.message || 'Không thể gửi OTP');
                return false;
            }
        } catch (error) {
            // Xử lý lỗi chi tiết
            let errorMessage = 'Không thể gửi OTP. Vui lòng thử lại sau.';

            if (error.response) {
                // Có response từ server
                const responseData = error.response.data;
                errorMessage = responseData?.message || error.message || 'Lỗi không xác định';
            } else if (error.request) {
                // Request đã được gửi nhưng không có response
                errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
            } else {
                // Lỗi khi setup request
                errorMessage = error.message || 'Lỗi không xác định';
            }

            setError('general', errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async (type) => {
        if (countdown > 0) {
            setError('general', `Vui lòng đợi ${countdown} giây trước khi gửi lại`);
            return;
        }
        await handleSendOTP(type);
    };

    // Login with OTP
    const handleLoginWithOTP = async (e) => {
        e.preventDefault();
        clearErrors(); // Clear previous errors

        if (!otpCode) {
            setError('otpCode', 'Vui lòng nhập mã OTP');
            return;
        }
        setLoading(true);
        try {
            const response = await loginWithOTP(email, otpCode);
            dispatch(userLoginSuccess({ user: response.data.user, token: response.data.token }));
            onClose();
            navigate('/');
        } catch (error) {
            setError('otpCode', error.response?.data?.message || 'Mã OTP không đúng');
        } finally {
            setLoading(false);
        }
    };

    // Register with OTP
    const handleRegisterWithOTP = async (e) => {
        e.preventDefault();
        clearErrors(); // Clear previous errors

        let hasError = false;
        if (!name) {
            setError('name', 'Vui lòng nhập tên');
            hasError = true;
        }
        if (!otpCode) {
            setError('otpCode', 'Vui lòng nhập mã OTP');
            hasError = true;
        }
        if (hasError) return;

        setLoading(true);
        try {
            const response = await registerWithOTP(name, email, otpCode);
            dispatch(userLoginSuccess({ user: response.data.user, token: response.data.token }));
            onClose();
            navigate('/');
        } catch (error) {
            setError('general', error.response?.data?.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    const resetView = () => {
        setView('main');
        setEmail('');
        setPassword('');
        setName('');
        setOtpCode('');
        setOtpSent(false);
        setCountdown(0);
        setShowPassword(false);
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="auth-modal-header">
                    <h2 className="auth-modal-title">Chúng tôi có một ưu đãi vô cùng hấp dẫn!</h2>
                    <button className="auth-modal-close" onClick={onClose}>×</button>
                </div>

                {/* Body */}
                <div className="auth-modal-body">
                    {view === 'main' && (
                        <>
                            {/* Google Login Button - Modern Design */}
                            <div className="auth-btn-google-wrapper">
                                {/* Custom Google Button */}
                                <button
                                    className="auth-btn-google-custom"
                                    onClick={triggerGoogleLogin}
                                    disabled={loading}
                                    type="button"
                                >
                                    <div className="google-logo-container">
                                        {/* Google Logo - Official Colors */}
                                        <svg className="google-logo" viewBox="0 0 24 24" width="20" height="20">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        <span className="google-text">Google</span>
                                    </div>
                                    <span className="google-badge">Đã sử dụng gần đây</span>
                                </button>

                                {/* Hidden GoogleLogin Component - For actual OAuth flow */}
                                <div className="google-login-hidden" ref={googleLoginRef}>
                                    <GoogleLogin
                                        onSuccess={handleGoogleLoginSuccess}
                                        onError={handleGoogleLoginError}
                                        useOneTap={false}
                                        theme="outline"
                                        size="large"
                                        text="signin_with"
                                        shape="rectangular"
                                        logo_alignment="left"
                                        locale="vi"
                                    />
                                </div>
                            </div>

                            {/* Email Login Button - Modern Design */}
                            <button
                                className="auth-btn-email-custom"
                                onClick={() => setView('email-login')}
                            >
                                <svg className="email-icon-custom" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>Email</span>
                            </button>

                            {/* Register with Email Link */}
                            <div className="auth-links-section">
                                <a
                                    href="#register"
                                    className="auth-link-primary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setView('email-register');
                                    }}
                                >
                                    Đăng ký bằng Email
                                </a>
                            </div>

                            {/* Other Options */}
                            <div className="auth-other-options">
                                <a
                                    href="#other"
                                    className="auth-link-secondary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // Show OTP options or other methods
                                    }}
                                >
                                    Các lựa chọn khác
                                </a>
                            </div>

                            {/* Promotional Text */}
                            <p className="auth-promo-text">
                                Giá thấp hơn và nhiều phần thưởng đang chờ bạn. Mở khóa ưu đãi bằng cách đăng nhập!
                            </p>

                            {/* Terms & Privacy */}
                            <p className="auth-legal-text">
                                Bằng cách tiếp tục, bạn đồng ý với{' '}
                                <strong>
                                    <a href="/chinh-sach/dieu-khoan" className="auth-link-inline">Điều khoản và Điều kiện</a>
                                </strong>
                                {' '}này và bạn đã được thông báo về{' '}
                                <strong>
                                    <a href="/chinh-sach/bao-mat" className="auth-link-inline">Chính sách bảo vệ dữ liệu</a>
                                </strong>
                                {' '}của chúng tôi.
                            </p>

                            {/* Guest Mode */}
                            <a
                                href="#guest"
                                className="auth-guest-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (onGuestMode) onGuestMode();
                                    onClose();
                                }}
                            >
                                Tìm kiếm với tư cách là khách
                            </a>
                        </>
                    )}

                    {/* Email Login Form */}
                    {view === 'email-login' && (
                        <form onSubmit={handleEmailLogin} className="auth-form">
                            <button type="button" className="auth-back-btn" onClick={resetView}>← Quay lại</button>
                            <h3>Đăng nhập bằng Email</h3>

                            {/* General error message */}
                            {errors.general && (
                                <div className="auth-message auth-message-error">
                                    {errors.general}
                                </div>
                            )}

                            <div className="auth-form-group">
                                <label htmlFor="login-email">Email</label>
                                <input
                                    id="login-email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        clearFieldError('email');
                                    }}
                                    className={errors.email ? 'auth-input-error' : ''}
                                    required
                                />
                                {errors.email && <div className="auth-field-error">{errors.email}</div>}
                            </div>

                            <div className="auth-form-group">
                                <label htmlFor="login-password">Mật khẩu</label>
                                <input
                                    id="login-password"
                                    type="password"
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        clearFieldError('password');
                                    }}
                                    className={errors.password ? 'auth-input-error' : ''}
                                    required
                                />
                                {errors.password && <div className="auth-field-error">{errors.password}</div>}
                            </div>

                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>
                            <a href="#forgot" className="auth-link" onClick={(e) => {
                                e.preventDefault();
                                setView('forgot-password');
                            }}>Quên mật khẩu?</a>
                        </form>
                    )}

                    {/* Email Register Form - Email + Password + OTP */}
                    {view === 'email-register' && (
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            if (!otpSent) {
                                // ============ BƯỚC 1: GỬI OTP ============
                                clearErrors(); // Clear previous errors

                                // Validate input
                                let hasError = false;
                                if (!name) {
                                    setError('name', 'Vui lòng nhập tên đăng nhập');
                                    hasError = true;
                                }
                                if (!email) {
                                    setError('email', 'Vui lòng nhập email');
                                    hasError = true;
                                }
                                if (!password) {
                                    setError('password', 'Vui lòng nhập mật khẩu');
                                    hasError = true;
                                }

                                // Validate password length
                                if (password && password.length < 6) {
                                    setError('password', 'Mật khẩu phải có ít nhất 6 ký tự');
                                    hasError = true;
                                }

                                // Validate email format
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (email && !emailRegex.test(email)) {
                                    setError('email', 'Email không hợp lệ');
                                    hasError = true;
                                }

                                if (hasError) return;

                                setLoading(true);
                                try {
                                    // Gọi API POST /api/auth/register
                                    // Gửi email, name, password → Backend gửi OTP qua email
                                    const response = await registerWithEmail(email, name, password);

                                    if (response.success) {
                                        setOtpSent(true);
                                        setCountdown(60); // Bắt đầu đếm ngược 60 giây
                                        setSuccessMessage(response.message || 'Mã OTP đã được gửi đến email của bạn');

                                        // Timer đếm ngược
                                        const timer = setInterval(() => {
                                            setCountdown((prev) => {
                                                if (prev <= 1) {
                                                    clearInterval(timer);
                                                    return 0;
                                                }
                                                return prev - 1;
                                            });
                                        }, 1000);
                                    } else {
                                        setError('general', response.message || 'Không thể gửi OTP');
                                    }
                                } catch (error) {
                                    console.error('Register with email error:', error);
                                    const errorMessage = error.response?.data?.message ||
                                        error.message ||
                                        'Không thể gửi OTP. Vui lòng thử lại.';
                                    setError('general', errorMessage);
                                } finally {
                                    setLoading(false);
                                }
                            } else {
                                // ============ BƯỚC 2: VERIFY OTP VÀ ĐĂNG KÝ ============
                                clearErrors(); // Clear previous errors

                                if (!otpCode || otpCode.length !== 6) {
                                    setError('otpCode', 'Vui lòng nhập mã OTP 6 số');
                                    return;
                                }

                                setLoading(true);
                                try {
                                    // Gọi API POST /api/auth/verify-otp
                                    // Gửi email, code, name, password → Backend verify OTP và tạo user
                                    const response = await verifyOTPAndRegister(email, otpCode, name, password);

                                    if (response.message === 'Đăng ký thành công' && response.user) {
                                        // Đăng ký thành công - Backend đã set HttpOnly cookie
                                        // Lấy user info từ cookie
                                        const meResponse = await getMe();

                                        if (meResponse.success && meResponse.user) {
                                            dispatch(userLoginSuccess({
                                                user: meResponse.user,
                                                token: null // Token is in HttpOnly cookie
                                            }));
                                            onClose();
                                            navigate('/');
                                        } else {
                                            setError('general', 'Đăng ký thành công nhưng không thể lấy thông tin người dùng.');
                                        }
                                    } else {
                                        setError('general', response.message || 'Đăng ký thất bại');
                                    }
                                } catch (error) {
                                    console.error('Verify OTP and register error:', error);
                                    const errorMessage = error.response?.data?.message ||
                                        error.message ||
                                        'Mã OTP không đúng hoặc đã hết hạn';
                                    setError('otpCode', errorMessage);
                                } finally {
                                    setLoading(false);
                                }
                            }
                        }} className="auth-form">
                            <button type="button" className="auth-back-btn" onClick={() => {
                                resetView();
                                setCountdown(0);
                            }}>← Quay lại các lựa chọn</button>
                            <h3>Tạo tài khoản</h3>

                            {/* Success message */}
                            {successMessage && (
                                <div className="auth-message auth-message-success">
                                    {successMessage}
                                </div>
                            )}

                            {/* General error message */}
                            {errors.general && (
                                <div className="auth-message auth-message-error">
                                    {errors.general}
                                </div>
                            )}

                            {!otpSent ? (
                                <>
                                    <div className="auth-form-group">
                                        <label htmlFor="register-name">Tên đăng nhập</label>
                                        <input
                                            id="register-name"
                                            type="text"
                                            placeholder="Nhập tên đăng nhập"
                                            value={name}
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                clearFieldError('name');
                                            }}
                                            className={errors.name ? 'auth-input-error' : ''}
                                            required
                                        />
                                        {errors.name && <div className="auth-field-error">{errors.name}</div>}
                                    </div>

                                    <div className="auth-form-group">
                                        <label htmlFor="register-email">Email</label>
                                        <input
                                            id="register-email"
                                            type="email"
                                            placeholder="Nhập email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                clearFieldError('email');
                                            }}
                                            className={errors.email ? 'auth-input-error' : ''}
                                            required
                                        />
                                        {errors.email && <div className="auth-field-error">{errors.email}</div>}
                                    </div>

                                    <div className="auth-form-group">
                                        <label htmlFor="register-password">Mật khẩu</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                id="register-password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Nhập mật khẩu của bạn"
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    clearFieldError('password');
                                                }}
                                                className={errors.password ? 'auth-input-error' : ''}
                                                required
                                            />
                                            <span
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{
                                                    position: 'absolute',
                                                    right: '12px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    cursor: 'pointer',
                                                    color: '#999'
                                                }}
                                            >
                                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </span>
                                        </div>
                                        {errors.password && <div className="auth-field-error">{errors.password}</div>}
                                    </div>

                                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                                        {loading ? 'Đang gửi mã OTP...' : 'Đăng ký'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p style={{ color: '#666', marginBottom: '20px', textAlign: 'center' }}>
                                        Mã OTP đã được gửi đến email <strong>{email}</strong>
                                    </p>

                                    <div className="auth-form-group">
                                        <label htmlFor="register-otp">
                                            Mã OTP
                                            {countdown > 0 && (
                                                <span style={{
                                                    marginLeft: '8px',
                                                    color: '#667eea',
                                                    fontWeight: '600',
                                                    fontSize: '14px'
                                                }}>
                                                    (Còn lại: {countdown}s)
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            id="register-otp"
                                            type="text"
                                            placeholder="Nhập mã OTP 6 số"
                                            value={otpCode}
                                            onChange={(e) => {
                                                setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                                clearFieldError('otpCode');
                                            }}
                                            className={errors.otpCode ? 'auth-input-error' : ''}
                                            maxLength={6}
                                            required
                                            style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '8px' }}
                                        />
                                        {errors.otpCode && <div className="auth-field-error">{errors.otpCode}</div>}
                                    </div>

                                    <button type="submit" className="auth-submit-btn" disabled={loading || !otpCode}>
                                        {loading ? 'Đang xác thực...' : 'Xác thực và Đăng ký'}
                                    </button>

                                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                        {countdown > 0 ? (
                                            <span style={{ color: '#999', fontSize: '14px' }}>
                                                Gửi lại mã sau {countdown}s
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                className="auth-link"
                                                onClick={async () => {
                                                    // Gửi lại OTP với thông tin đã nhập
                                                    clearErrors();

                                                    let hasError = false;
                                                    if (!name || !email || !password) {
                                                        setError('general', 'Vui lòng nhập đầy đủ thông tin');
                                                        hasError = true;
                                                    }
                                                    if (password && password.length < 6) {
                                                        setError('password', 'Mật khẩu phải có ít nhất 6 ký tự');
                                                        hasError = true;
                                                    }
                                                    if (hasError) return;

                                                    setLoading(true);
                                                    try {
                                                        const response = await registerWithEmail(email, name, password);
                                                        if (response.success) {
                                                            setCountdown(60);
                                                            setSuccessMessage(response.message || 'Mã OTP đã được gửi lại');
                                                            const timer = setInterval(() => {
                                                                setCountdown((prev) => {
                                                                    if (prev <= 1) {
                                                                        clearInterval(timer);
                                                                        return 0;
                                                                    }
                                                                    return prev - 1;
                                                                });
                                                            }, 1000);
                                                        } else {
                                                            setError('general', response.message || 'Không thể gửi lại OTP');
                                                        }
                                                    } catch (error) {
                                                        setError('general', error.response?.data?.message || 'Không thể gửi lại OTP');
                                                    } finally {
                                                        setLoading(false);
                                                    }
                                                }}
                                                style={{ background: 'none', border: 'none', padding: 0 }}
                                                disabled={loading}
                                            >
                                                Gửi lại mã OTP
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}

                            <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e0e0e0' }}>
                                <span style={{ color: '#666' }}>Đã có tài khoản? </span>
                                <a
                                    href="#login"
                                    className="auth-link-inline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        resetView();
                                        setView('email-login');
                                    }}
                                >
                                    Đăng nhập
                                </a>
                            </div>
                        </form>
                    )}

                    {/* OTP Register */}
                    {view === 'otp-register' && (
                        <div className="auth-form">
                            <button type="button" className="auth-back-btn" onClick={() => setView('email-register')}>← Quay lại</button>
                            <h3>Đăng ký bằng OTP</h3>
                            <input
                                type="text"
                                placeholder="Tên đầy đủ"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={otpSent}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={otpSent}
                            />
                            {!otpSent ? (
                                <button
                                    type="button"
                                    className="auth-submit-btn"
                                    onClick={() => handleSendOTP('register')}
                                    disabled={loading || !email || !name}
                                >
                                    {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                                </button>
                            ) : (
                                <>
                                    <div className="auth-form-group">
                                        <label>
                                            Mã OTP
                                            {countdown > 0 && (
                                                <span style={{
                                                    marginLeft: '8px',
                                                    color: '#667eea',
                                                    fontWeight: '600',
                                                    fontSize: '14px'
                                                }}>
                                                    (Còn lại: {countdown}s)
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nhập mã OTP 6 số"
                                            value={otpCode}
                                            onChange={(e) => {
                                                setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                                clearFieldError('otpCode');
                                            }}
                                            className={errors.otpCode ? 'auth-input-error' : ''}
                                            maxLength={6}
                                            style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '8px' }}
                                        />
                                        {errors.otpCode && <div className="auth-field-error">{errors.otpCode}</div>}
                                    </div>
                                    <button
                                        type="button"
                                        className="auth-submit-btn"
                                        onClick={handleRegisterWithOTP}
                                        disabled={loading}
                                    >
                                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                                    </button>
                                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                        {countdown > 0 ? (
                                            <span style={{ color: '#999', fontSize: '14px' }}>
                                                Gửi lại mã sau {countdown}s
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                className="auth-link"
                                                onClick={() => {
                                                    setOtpSent(false);
                                                    setOtpCode('');
                                                    clearErrors();
                                                }}
                                                style={{ background: 'none', border: 'none', padding: 0 }}
                                            >
                                                Gửi lại mã OTP
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* OTP Login */}
                    {view === 'otp-login' && (
                        <div className="auth-form">
                            <button type="button" className="auth-back-btn" onClick={resetView}>← Quay lại</button>
                            <h3>Đăng nhập bằng OTP</h3>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={otpSent}
                            />
                            {!otpSent ? (
                                <button
                                    type="button"
                                    className="auth-submit-btn"
                                    onClick={() => handleSendOTP('login')}
                                    disabled={loading}
                                >
                                    {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                                </button>
                            ) : (
                                <>
                                    <div className="auth-form-group">
                                        <label>
                                            Mã OTP
                                            {countdown > 0 && (
                                                <span style={{
                                                    marginLeft: '8px',
                                                    color: '#667eea',
                                                    fontWeight: '600',
                                                    fontSize: '14px'
                                                }}>
                                                    (Còn lại: {countdown}s)
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nhập mã OTP 6 số"
                                            value={otpCode}
                                            onChange={(e) => {
                                                setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                                clearFieldError('otpCode');
                                            }}
                                            className={errors.otpCode ? 'auth-input-error' : ''}
                                            maxLength={6}
                                            style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '8px' }}
                                        />
                                        {errors.otpCode && <div className="auth-field-error">{errors.otpCode}</div>}
                                    </div>
                                    <button
                                        type="button"
                                        className="auth-submit-btn"
                                        onClick={handleLoginWithOTP}
                                        disabled={loading}
                                    >
                                        {loading ? 'Đang xác thực...' : 'Đăng nhập'}
                                    </button>
                                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                        {countdown > 0 ? (
                                            <span style={{ color: '#999', fontSize: '14px' }}>
                                                Gửi lại mã sau {countdown}s
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                className="auth-link"
                                                onClick={() => {
                                                    setOtpSent(false);
                                                    setOtpCode('');
                                                    clearErrors();
                                                }}
                                                style={{ background: 'none', border: 'none', padding: 0 }}
                                            >
                                                Gửi lại mã OTP
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Forgot Password */}
                    {view === 'forgot-password' && (
                        <div className="auth-form">
                            <button type="button" className="auth-back-btn" onClick={() => setView('email-login')}>← Quay lại</button>
                            <h3>Đặt lại mật khẩu</h3>

                            {/* Success message */}
                            {successMessage && (
                                <div className="auth-message auth-message-success">
                                    {successMessage}
                                </div>
                            )}

                            {/* General error message */}
                            {errors.general && (
                                <div className="auth-message auth-message-error">
                                    {errors.general}
                                </div>
                            )}

                            <div className="auth-form-group">
                                <label htmlFor="forgot-email">Email</label>
                                <input
                                    id="forgot-email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        clearFieldError('email');
                                    }}
                                    className={errors.email ? 'auth-input-error' : ''}
                                    disabled={otpSent}
                                />
                                {errors.email && <div className="auth-field-error">{errors.email}</div>}
                            </div>

                            {!otpSent ? (
                                <button
                                    type="button"
                                    className="auth-submit-btn"
                                    onClick={() => handleSendOTP('reset-password')}
                                    disabled={loading}
                                >
                                    {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                                </button>
                            ) : (
                                <>
                                    <div className="auth-form-group">
                                        <label>
                                            Mã OTP
                                            {countdown > 0 && (
                                                <span style={{
                                                    marginLeft: '8px',
                                                    color: '#667eea',
                                                    fontWeight: '600',
                                                    fontSize: '14px'
                                                }}>
                                                    (Còn lại: {countdown}s)
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nhập mã OTP 6 số"
                                            value={otpCode}
                                            onChange={(e) => {
                                                setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                                clearFieldError('otpCode');
                                            }}
                                            className={errors.otpCode ? 'auth-input-error' : ''}
                                            maxLength={6}
                                            style={{ textAlign: 'center', fontSize: '20px', letterSpacing: '8px' }}
                                        />
                                        {errors.otpCode && <div className="auth-field-error">{errors.otpCode}</div>}
                                    </div>

                                    <div className="auth-form-group">
                                        <label htmlFor="forgot-password">Mật khẩu mới</label>
                                        <input
                                            id="forgot-password"
                                            type="password"
                                            placeholder="Mật khẩu mới"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                clearFieldError('password');
                                            }}
                                            className={errors.password ? 'auth-input-error' : ''}
                                        />
                                        {errors.password && <div className="auth-field-error">{errors.password}</div>}
                                    </div>

                                    <button
                                        type="button"
                                        className="auth-submit-btn"
                                        onClick={async () => {
                                            setLoading(true);
                                            clearErrors();
                                            try {
                                                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/reset-password`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ email, otpCode, newPassword: password })
                                                });
                                                const data = await response.json();
                                                if (response.ok) {
                                                    setSuccessMessage('Đặt lại mật khẩu thành công!');
                                                    setTimeout(() => {
                                                        setView('email-login');
                                                        clearErrors();
                                                    }, 1500);
                                                } else {
                                                    setError('general', data.message || 'Đặt lại mật khẩu thất bại');
                                                }
                                            } catch (error) {
                                                setError('general', 'Đặt lại mật khẩu thất bại');
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                                    </button>

                                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                        {countdown > 0 ? (
                                            <span style={{ color: '#999', fontSize: '14px' }}>
                                                Gửi lại mã sau {countdown}s
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                className="auth-link"
                                                onClick={() => {
                                                    setOtpSent(false);
                                                    setOtpCode('');
                                                    clearErrors();
                                                }}
                                                style={{ background: 'none', border: 'none', padding: 0 }}
                                            >
                                                Gửi lại mã OTP
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Load Google Sign-In script
export default AuthModal;

