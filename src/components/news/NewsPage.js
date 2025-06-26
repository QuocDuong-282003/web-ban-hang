import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Import các component layout chung
import Header from '../common/Header';
import Footer from '../common/Footer';
import MobileMenu from '../common/MobileMenu';
import GoToTop from '../common/GoToTop';

// Import hàm API
import { getAllNewClient } from '../../container/services/userNews';

// BƯỚC 1: IMPORT COMPONENT CON `NewsItem`
import NewsItem from './NewsItem';

function NewsPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [newsList, setNewsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllNews = async () => {
            try {
                setIsLoading(true);
                const response = await getAllNewClient();
                setNewsList(response.data.data);
            } catch (error) {
                console.error("Lỗi khi tải trang tin tức:", error);
                toast.error("Không thể tải dữ liệu tin tức.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllNews();
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={toggleMobileMenu}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="container">
                <h1 style={{ textAlign: 'center', margin: '40px 0', textTransform: 'uppercase' }}>Tin tức</h1>

                <div className="row mb-20" style={{ minHeight: '400px' }}>
                    {isLoading ? (
                        <div style={{ textAlign: 'center', width: '100%' }}>
                            <p>Đang tải tin tức...</p>
                        </div>
                    ) : (


                        newsList.map(newsItem => (
                            <NewsItem key={newsItem._id} news={newsItem} />
                        ))
                    )}

                    {!isLoading && newsList.length === 0 && (
                        <div style={{ textAlign: 'center', width: '100%' }}>
                            <p>Hiện chưa có bài viết nào.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
            <GoToTop />
        </div>
    );
}

export default NewsPage;