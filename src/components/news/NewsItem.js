import React from 'react';
import { Link } from 'react-router-dom';

function NewsItem({ news }) {
    if (!news) {
        return null;
    }

    return (
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <Link to={`/news-detail/${news.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ width: '100%', height: '100%', border: '1px solid #eee' }}>
                    <img
                        className="card-img-top"
                        src={news.imageBase64}
                        alt={news.title}
                        style={{ height: "230px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                        <h5 className="card-title" style={{ minHeight: '50px', fontWeight: 'bold' }}>
                            {news.title}
                        </h5>
                        <p className="card-text">{news.excerpt}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default NewsItem;