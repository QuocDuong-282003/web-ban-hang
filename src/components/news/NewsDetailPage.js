import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../common/Header';
import Footer from '../common/Footer';
import MobileMenu from '../common/MobileMenu';
import GoToTop from '../common/GoToTop';

import { getNewsBySlug } from '../../container/services/userNews';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './NewsDetailPage.scss';
function NewsDetailPage() {
    // State cho layout
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State cho dữ liệu và trạng thái tải
    const { slug } = useParams(); // Lấy slug từ URL, "
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    useEffect(() => {
        const fetchArticleDetail = async () => {
            // Tự động cuộn lên đầu trang mỗi khi tải bài viết mới
            window.scrollTo(0, 0);

            if (!slug) {
                setIsLoading(false);
                return;
            };

            try {
                setIsLoading(true);
                const response = await getNewsBySlug(slug);
                setArticle(response.data.data);
            } catch (error) {
                console.error(`Lỗi khi tải bài viết với slug: ${slug}`, error);
                toast.error("Không tìm thấy bài viết hoặc đã có lỗi xảy ra.");
                setArticle(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticleDetail();
    }, [slug]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleContent = () => {
        setIsExpanded(!isExpanded);
    };
    // Xử lý trạng thái đang tải
    if (isLoading) {
        return (
            <div>
                <Header />
                <div style={{ textAlign: 'center', margin: '100px 0', fontSize: '18px' }}>Đang tải bài viết...</div>
                <Footer />
            </div>
        );
    }

    // Xử lý trạng thái không tìm thấy bài viết
    if (!article) {
        return (
            <div>
                <Header />
                <div style={{ textAlign: 'center', margin: '100px 0' }}>
                    <h2>404 - Không tìm thấy</h2>
                    <p>Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <Link to="/news">Quay lại trang tin tức</Link>
                </div>
                <Footer />
            </div>
        );
    }



    return (
        <div>
            {/* <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={toggleMobileMenu}></div> */}
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />


            <div className="container news-detail-container" >
                <div className="article-wrapper">

                    <div className="all-posts-link">
                        <Link to="/news" style={{ textDecoration: 'none', color: '#555' }}>← All Posts</Link>
                    </div>

                    <div className="article-header">

                        <div className="article-meta" >

                            <span className="author-icon" >
                                <svg width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 14C8.68629 14 6 16.6863 6 20H18C18 16.6863 15.3137 14 12 14Z" fill="#888" /></svg>
                            </span>
                            <span>{article.author}</span>
                            <span style={{ margin: '0 10px' }}>·</span>
                            <span>
                                {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>

                        </div>


                        <h1 className="article-title" >
                            {article.title}
                        </h1>
                        <p className="article-excerpt" >
                            {article.excerpt}
                        </p>
                    </div>
                    <div className="content-container">
                        <div
                            className="article-content"
                            style={{
                                maxHeight: isExpanded ? 'none' : '400px',
                                overflow: 'hidden',
                                position: 'relative',
                                transition: 'max-height 0.5s ease-in-out'
                            }}
                        >
                            <ReactMarkdown
                                children={article.content}
                                remarkPlugins={[remarkGfm]}
                            />
                            {!isExpanded && <div className="content-fade"></div>}
                        </div>
                        {article.content.length > 300 && (
                            <button onClick={toggleContent} className="toggle-content-btn">
                                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                            </button>
                        )}
                    </div>

                </div>
            </div>
            <Footer />
            <GoToTop />
        </div>
    );
}

export default NewsDetailPage;