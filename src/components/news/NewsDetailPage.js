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
function NewsDetailPage() {
    // State cho layout
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State cho dữ liệu và trạng thái tải
    const { slug } = useParams(); // Lấy slug từ URL, ví dụ: "the-one-thing-i-would-tell..."
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
                setArticle(response.data);
            } catch (error) {
                console.error(`Lỗi khi tải bài viết với slug: ${slug}`, error);
                toast.error("Không tìm thấy bài viết hoặc đã có lỗi xảy ra.");
                setArticle(null); // Reset lại state nếu có lỗi
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticleDetail();
    }, [slug]); // Effect sẽ chạy lại mỗi khi `slug` trên URL thay đổi

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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

    // Render nội dung bài viết khi đã có dữ liệu
    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={toggleMobileMenu}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            {/* Container chính cho bài viết, giới hạn chiều rộng để dễ đọc */}
            <div className="container" style={{ marginTop: '50px', maxWidth: '800px', padding: '0 20px' }}>
                <div className="article-wrapper">
                    {/* 1. Link "All Posts" */}
                    <div className="all-posts-link" style={{ marginBottom: '40px' }}>
                        <Link to="/news" style={{ textDecoration: 'none', color: '#555' }}>← All Posts</Link>
                    </div>

                    <div className="article-header">
                        {/* 2. Phần thông tin meta */}
                        <div className="article-meta" style={{ display: 'flex', alignItems: 'center', color: '#555', marginBottom: '20px' }}>
                            {/* Icon người dùng (dùng ký tự hoặc SVG/icon) */}
                            <span className="author-icon" style={{ marginRight: '10px' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 14C8.68629 14 6 16.6863 6 20H18C18 16.6863 15.3137 14 12 14Z" fill="#888" /></svg>
                            </span>
                            <span>{article.author}</span>
                            <span style={{ margin: '0 10px' }}>·</span>
                            <span>
                                {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>

                        {/* 3. Tiêu đề lớn */}
                        <h1 className="article-title" style={{ fontSize: '48px', lineHeight: '1.2', marginBottom: '20px', fontWeight: 'bold' }}>
                            {article.title}
                        </h1>

                        {/* 4. Đoạn tóm tắt/phụ đề */}
                        <p className="article-excerpt" style={{ fontSize: '20px', color: '#666', marginBottom: '40px', fontStyle: 'italic' }}>
                            {article.excerpt}
                        </p>
                    </div>

                    {/* 5. Nội dung chi tiết */}
                    {/* Dùng dangerouslySetInnerHTML để render nội dung HTML từ backend */}
                    <div
                        className="article-content"
                        // Nếu bạn dùng CSS từ github-markdown-css, hãy thêm class này để có style đẹp:
                        // className="article-content markdown-body"
                        style={{ fontSize: '18px', lineHeight: '1.7' }}
                    >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {article.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
            <Footer />
            <GoToTop />
        </div>
    );
}

export default NewsDetailPage;