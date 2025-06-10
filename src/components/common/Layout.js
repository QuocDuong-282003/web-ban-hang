// src/components/Layout/Layout.js
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';

const Layout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showGoToTop, setShowGoToTop] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowGoToTop(window.scrollY > 200);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const closeMobileMenuViaOverlay = () => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            <div
                className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`}
                onClick={closeMobileMenuViaOverlay}
            ></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header toggleMobileMenu={toggleMobileMenu} />
            <main>
                <Outlet />
            </main>
            <Footer />
            {showGoToTop && (
                <div id="go-to-top">
                    <button onClick={scrollToTop} className="btn-gototop"><i className="fas fa-arrow-up"></i></button>
                </div>
            )}
        </>
    );
};

export default Layout;