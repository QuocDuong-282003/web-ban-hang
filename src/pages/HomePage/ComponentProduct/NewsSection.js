import React from 'react';
import { Link } from 'react-router-dom';

function NewsSection({ newsItems }) {
    if (!newsItems || newsItems.length === 0) return null;

    return (
        <div className="shoesnews">
            <div className="container">
                <h3 className="shoesnews__title">Tin tức</h3>
                <div className="row">

                    {newsItems.map(newsItem => (
                        <div className="col-lg-4 col-md-4 col-sm-12 mb-20" key={newsItem._id}>

                            <Link to={`/news-detail/${newsItem.slug}`} className="product__new-item">
                                <div className="card" style={{ width: '100%', height: '100%' }}>

                                    <img className="card-img-top" src={newsItem.imageBase64} alt={newsItem.title} style={{ height: "230px", objectFit: "cover" }} />
                                    <div className="card-body">
                                        <h5 className="card-title description title-news">{newsItem.title}</h5>
                                        <p className="card-text description" style={{ fontWeight: 400 }}>{newsItem.excerpt}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="shoesnews__all">
                    <Link to="/news" className="shoesnews__all-tittle">Xem tất cả</Link> <i className="fi-rs-angle-right"></i>
                </div>
            </div>
        </div>
    );
}

export default NewsSection;