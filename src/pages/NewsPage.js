import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';
import NewsItem from '../components/news/NewsItem'; // Component con

import { apiNews } from '../data/newsData'; // Import dữ liệu
// import './NewsPage.css'; // CSS riêng

function NewsPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [newsList, setNewsList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Số tin tức mỗi trang/lần load

    useEffect(() => {
        // Giả lập fetch data
        setNewsList(apiNews);
    }, []);

    const displayedNews = newsList.slice(0, currentPage * itemsPerPage);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleLoadMore = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const allNewsLoaded = displayedNews.length >= newsList.length;

    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={isMobileMenuOpen ? toggleMobileMenu : null}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className=""> {/* Bỏ class rỗng nếu không cần */}
                <div className="container">
                    <div className="row mb-20" style={{ margin: '20px 0' }} id="news-container">
                        {displayedNews.map(newsItem => (
                            <NewsItem key={newsItem.id} news={newsItem} />
                        ))}
                        {displayedNews.length === 0 && <p>Không có tin tức nào.</p>}
                    </div>
                </div>
            </div>
            {!allNewsLoaded && (
                <div className="loadmore">
                    <button className="loadmore-btn" style={{ cursor: 'pointer' }} onClick={handleLoadMore}>Tải thêm</button>
                </div>
            )}

            <Footer />
            <GoToTop />
        </div>
    );
}

export default NewsPage;