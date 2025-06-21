
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MobileMenu from '../../components/common/MobileMenu';
import GoToTop from '../../components/common/GoToTop';
import { handleLoginApi } from '../../container/services/userService';
import { userLoginSuccess, userLoginFailure } from '../../container/redux/userAuthSlice';
import LoginForm from './Auth/LoginForm';
import RegisterPrompt from './Auth/RegisterPrompt';

function LoginPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={toggleMobileMenu}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="container">
                <div className="login__form">
                    <div className="row">
                        <div className="col-sm-12 col-lg-6">
                            <LoginForm />
                        </div>

                        <div className="col-sm-12 col-lg-6">
                            <RegisterPrompt />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <GoToTop />
        </div>
    );
}

export default LoginPage;