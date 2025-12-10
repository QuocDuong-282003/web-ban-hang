import React, { useState, useEffect } from 'react';
import './GoToTop.scss';

function GoToTop() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div id="go-to-top" style={{ display: isVisible ? 'block' : 'none' }}>
            <button onClick={scrollToTop} className="btn-gototop" aria-label="Go to top">
                <i className="fas fa-arrow-up"></i>
            </button>
        </div>
    );
}

export default GoToTop;