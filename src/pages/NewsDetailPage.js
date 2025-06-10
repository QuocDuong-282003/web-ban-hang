import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';

import { apiNews } from '../data/newsData'; // Import dữ liệu
// import './NewsDetailPage.css'; // CSS riêng

function NewsDetailPage() {
    const { newsId } = useParams();
    const [newsArticle, setNewsArticle] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const foundArticle = apiNews.find(n => n.id.toString() === newsId);
        setNewsArticle(foundArticle);
    }, [newsId]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    if (!newsArticle) {
        return <div>Tin tức không tìm thấy!</div>;
    }

    // Giả sử newsArticle có trường `contentHtml` chứa HTML nội dung chi tiết
    // Hoặc bạn sẽ cần parse markdown, hoặc có cấu trúc dữ liệu chi tiết hơn.
    // Đây là ví dụ dựa trên HTML hiện tại của bạn.
    const exampleContentHtml = `
        <p>
            Mới đây Footpack và Soub đã hợp tác với nhau để tạo ra một phiên bản Nike Mercurial Vapor 14 được tùy chỉnh đặc biệt, lấy cảm hứng từ một
             trong những đôi giày yêu thích của tiền đạo người Pháp Marcus Thuram,
              đôi Jordan 1 Travis Scott x Fragment.
        </p>
        <p style="text-align: center;">
            <img src="./assets/img/product/new4.jpg" alt="">
        </p>
        <P>
            Tiền đạo của Borussia Mönchengladbach là một fan cứng của những đôi giày thể thao đặc biệt là dòng sản phẩm Nike Jordan, cũng vì lý do đó mà khi thương hiệu footpack của Pháp đề nghị sẽ "custom" cho Marcus một đôi Nike Mercurial Vapors 14, thì đôi Jordan 1 Travis Scott x Fragment,
             đã được chọn để trở thành nguồn cảm hứng cho phiên bản "custom" này, được tạo ra bởi nghệ sĩ thiết kế Soub.
        </P>
        <p style="text-align: center;">
            <img src="./assets/img/product/new5.jpg" alt="">
        </p>
        <P>
            Nike Mercurial Travis Scott có tone màu chủ đạo toàn màu trắng và phủ lên nó
             các tấm hình khối màu xanh tương đồng với Jordan 1 Travis Scott x Fragment.
              Dấu Swoosh lớn màu đen ở mặt ngoài với một chữ ký của Travis Scott - phía má trong là dấu Swoosh nhỏ hơn
             kiểu setup giống với bản phối "Recharge" được Nike cho ra mắt gần đây. 
        </P>
        <p style="text-align: center;">
            <img src="./assets/img/product/new6.jpg" alt="">
        </p>
        <p style="text-align: center;">
            <img src="./assets/img/product/new7.jpg" alt="">
        </p>
        <p>
            Ở trung tâm phần gót giày, dòng "Marcus Jack" được thiết kế khá "nguệch ngoạc",
             có lẽ để tạo dấu hiệu đặc trưng cho đôi giày.
             Đặt bên cạnh là logo của footpack ở mặt ngoài và logo Joaquim Soub ở mặt bên trong.
        </p>
        <p style="text-align: center;">
            <img src="./assets/img/product/new8.jpg" alt="">
        </p>
        <p>
            Theo dõi blog của P&T SHOP để biết được những thông tin mới nhất về
             những đôi giày bóng đá chính hãng đã và sắp có mặt trên thị trường toàn thế giới nhé.
            Ngoài ra các bạn có thể tham khảo thêm những đôi giày bóng đá chính hãng phiên bản
            dành cho mặt sân cỏ nhân tạo và Futsal tại <a href="/products">đây</a>.
        </p>
    `;


    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={isMobileMenuOpen ? toggleMobileMenu : null}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="content" style={{ marginTop: '30px' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12">
                            <div className="page-title">
                                <h1 className="title-head" style={{ fontSize: '30px' }}>
                                    <strong>{newsArticle.name}</strong>
                                </h1>
                            </div>
                            <div className="content-page">
                                <span className="time" style={{ fontSize: '18px', color: '#999' }}>
                                    <i className="far fa-clock" style={{ marginRight: '10px' }}></i>
                                    {newsArticle.date || "13/11/2021"} {/* Giả sử có date */}
                                </span>
                                <div dangerouslySetInnerHTML={{ __html: newsArticle.contentHtml || exampleContentHtml }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <GoToTop />
        </div>
    );
}

export default NewsDetailPage;