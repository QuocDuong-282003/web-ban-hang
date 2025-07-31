import React from 'react';
import { Link } from 'react-router-dom';

function PopularProductsSection({ products }) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="product_popular" style={{ marginTop: '30px' }}>
            <h3 className="product__popular title-product">Sản phẩm phổ biến</h3>
            <div className="row">
                {products.map(product => (

                    <div className="col-lg-4 col-md-6 mb-4" key={product._id}>

                        <div className="card h-100" style={{ width: '100%' }}>

                            <img
                                className="card-img-top"
                                src={product.imageBase64 || './assets/img/placeholder.png'}
                                alt={product.name}

                                style={{ height: '350px', objectFit: 'cover' }}
                            />

                            <div className="card-body d-flex flex-column">
                                <h4 className="card-title">{product.name}</h4>

                                <p className="card-text description flex-grow-1" style={{ fontWeight: 400 }}>
                                    {product.description}
                                </p>
                                <Link to="/products" className="btn btn-buynow mt-auto align-self-start">
                                    Xem ngay <i className="fas fa-arrow-right"></i>
                                </Link>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PopularProductsSection;