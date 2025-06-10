import React from 'react';
import { Link } from 'react-router-dom';

function NewsItem({ news }) {
    return (
        <div className="col-lg-3 col-md-6 col-sm-12 mb-20" style={{ marginBottom: '20px' }}>
            <Link to={`/news-detail/${news.id}`} className="product__new-item"> {/* Giả sử link là news-detail */}
                <div className="card" style={{ width: '100%' }}>
                    <img className="card-img-top" src={news.img} alt={news.name} />
                    <div className="card-body">
                        <h5 className="card-title custom__name-product title-news">
                            {news.name}
                        </h5>
                        <p className="card-text custom__name-product" style={{ fontWeight: 400 }}>{news.description}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default NewsItem;