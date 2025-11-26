
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MobileMenu from '../../components/common/MobileMenu';
import GoToTop from '../../components/common/GoToTop';
import AuthModal from '../../components/auth/AuthModal';

function LoginPage() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false); // Không tự động mở modal
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={toggleMobileMenu}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Đăng nhập hoặc Đăng ký</h2>
                    <p>Vui lòng sử dụng modal đăng nhập ở trên</p>
                    <button 
                        onClick={() => setShowAuthModal(true)}
                        style={{ 
                            padding: '12px 24px', 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}
                    >
                        Mở Modal Đăng Nhập
                    </button>
                </div>
            </div>

            <AuthModal 
                isOpen={showAuthModal} 
                onClose={() => {
                    setShowAuthModal(false);
                    navigate('/');
                }}
                onGuestMode={() => {
                    navigate('/');
                }}
            />

            <Footer />
            <GoToTop />
        </div>
    );
}

export default LoginPage;