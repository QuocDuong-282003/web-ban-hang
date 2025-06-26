import React from 'react';
import { Link } from 'react-router-dom';

// Component này nhận một prop là `news`, chứa thông tin của một bài viết
function NewsItem({ news }) {
    // Nếu không có dữ liệu news (để phòng lỗi), không render gì cả
    if (!news) {
        return null;
    }

    return (
        // Sử dụng class cột của Bootstrap để nó tự động sắp xếp trên lưới
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            {/* Link sẽ điều hướng đến trang chi tiết với slug tương ứng */}
            <Link to={`/news-detail/${news.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ width: '100%', height: '100%', border: '1px solid #eee' }}>
                    {/* Ảnh bài viết, lấy từ trường `imageBase64` */}
                    <img
                        className="card-img-top"
                        src={news.imageBase64}
                        alt={news.title}
                        style={{ height: "230px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                        {/* Tiêu đề bài viết, lấy từ trường `title` */}
                        <h5 className="card-title" style={{ minHeight: '50px', fontWeight: 'bold' }}>
                            {news.title}
                        </h5>
                        {/* Đoạn trích, lấy từ trường `excerpt` */}
                        <p className="card-text">{news.excerpt}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default NewsItem;