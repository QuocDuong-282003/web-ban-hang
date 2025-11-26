import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';
import ModalQuickView from '../components/common/ModalQuickView';
import { Link } from 'react-router-dom';
import PolicySection from '../components/Home/PolicySection';
import './HomePage.scss';

// Dữ liệu mẫu (trong thực tế, bạn sẽ fetch từ API hoặc import từ file data)
const sampleProducts = {
    popular: [
        { id: 'joma_super', name: 'Joma Super Regate', img: './assets/img/product/addidas1.jpg', description: 'Phần trên được sản xuất bằng cách sử dụng sợi nhỏ, nylon và TPU...', detailLink: '/product-detail/joma_super' },
        { id: 'stan_smith', name: 'Adidas Stan Smith', img: './assets/img/product/stansmith.jpg', description: 'Đúng chất kinh điển. Trước đây, Stan Smith từng là ngôi sao...', detailLink: '/product-detail/stan_smith' },
        { id: 'ultraboost', name: 'Nike UltraBoost', img: './assets/img/product/ult1.jpg', description: 'Trải nghiệm sự thoải mái và hoàn trả năng lượng tối ưu...', detailLink: '/product-detail/ultraboost' }
    ],
    new: [
        { id: 'ambush1', name: 'Áo bloolyn', img: './assets/img/product/ambush1.jpg', oldPrice: 1200000, price: 1000000, rating: 3, sold: 79, discount: 17, detailLink: '/product-detail/ambush1', gallery: ['./assets/img/product/ambush1.jpg', './assets/img/product/ambush2.png'], shortDescription: 'Mô tả ngắn áo bloolyn.', inStock: true, category: 'Áo', colors: [{ id: 'black', name: 'Đen', hex: '#000000' }], sizes: [{ id: 'M', name: 'M' }] },
        { id: 'hoodie1', name: 'Hoodie Adidas', img: './assets/img/product/aohoodie1.jpg', oldPrice: 950000, price: 750000, rating: 4, sold: 102, discount: 21, detailLink: '/product-detail/hoodie1', gallery: ['./assets/img/product/aohoodie1.jpg'], shortDescription: 'Mô tả ngắn hoodie.', inStock: true, category: 'Áo', colors: [{ id: 'grey', name: 'Xám', hex: '#808080' }], sizes: [{ id: 'L', name: 'L' }] },
        { id: 'jacket1', name: 'Áo khoác adidas', img: './assets/img/product/Ao_Gio_Adicolor_Classics_DJen_GN2780_21_model.jpg', oldPrice: 1500000, price: 1300000, rating: 5, sold: 65, discount: 13, detailLink: '/product-detail/jacket1', gallery: [], shortDescription: 'Mô tả ngắn áo khoác.', inStock: false, category: 'Áo', colors: [{ id: 'black', name: 'Đen', hex: '#000000' }], sizes: [{ id: 'XL', name: 'XL' }] },
        { id: 'gymwear1', name: 'Đồ gym', img: './assets/img/product/áo-ngực-thun-gân-medium-support-3-sọc-believe-this.jpg', oldPrice: 800000, price: 650000, rating: 4, sold: 92, discount: 19, detailLink: '/product-detail/gymwear1', gallery: [], shortDescription: 'Mô tả ngắn đồ gym.', inStock: true, category: 'Đồ thể thao', colors: [{ id: 'pink', name: 'Hồng', hex: '#FFC0CB' }], sizes: [{ id: 'S', name: 'S' }] }
    ],
    hot: [ // Thêm dữ liệu mẫu cho sản phẩm hot
        { id: 'vaymidi1', name: 'Quần giả váy', img: './assets/img/product/vaymidi1.jpg', oldPrice: 700000, price: 550000, rating: 4.5, sold: 150, discount: 21, detailLink: '/product-detail/vaymidi1', gallery: [], shortDescription: 'Mô tả ngắn quần giả váy.', inStock: true, category: 'Váy', colors: [{ id: 'white', name: 'Trắng', hex: '#FFFFFF' }], sizes: [{ id: 'M', name: 'M' }] },
        { id: 'ultra_hot', name: 'Giày Ultra Hot', img: './assets/img/product/ult1.jpg', oldPrice: 2200000, price: 2000000, rating: 5, sold: 180, discount: 9, detailLink: '/product-detail/ultra_hot', gallery: [], shortDescription: 'Mô tả ngắn giày ultra.', inStock: true, category: 'Giày', colors: [{ id: 'blue', name: 'Xanh dương', hex: '#0000FF' }], sizes: [{ id: '40', name: '40' }] },
    ],
    youMayLike: [ // Thêm dữ liệu mẫu
        { id: 'sandal1', name: 'Giày Sandal Duramo', img: './assets/img/product/sandalduramo1.jpg', oldPrice: 600000, price: 450000, rating: 4, sold: 95, discount: 25, detailLink: '/product-detail/sandal1', gallery: [], shortDescription: 'Mô tả ngắn sandal.', inStock: true, category: 'Giày dép', colors: [{ id: 'black', name: 'Đen', hex: '#000000' }], sizes: [{ id: '39', name: '39' }] },
        { id: 'stansmith_golf', name: 'Adidas Stan Smith Golf', img: './assets/img/product/stansmithgolf2.jpg', oldPrice: 2500000, price: 2200000, rating: 4.5, sold: 60, discount: 12, detailLink: '/product-detail/stansmith_golf', gallery: [], shortDescription: 'Mô tả ngắn stan smith golf.', inStock: false, category: 'Giày dép', colors: [{ id: 'white_green', name: 'Trắng/Xanh', hex: '#FFFFFF' }], sizes: [{ id: '41', name: '41' }] },
    ]
};

const sampleNews = [
    { id: 'news1', title: 'Tin tức về giày puma', img: './assets/img/product/new2.jpg', excerpt: 'Trong phạm vi bài viết ngày hôm nay, hãy cùng Thanh Hùng Futsal khám phá...', detailLink: '/news-detail/news1' },
    { id: 'news2', title: 'Người sáng lập đế chế puma', img: './assets/img/product/new1.jpg', excerpt: '"PUMA ra mắt KING TOP DASSLER phiên bản giới hạn...', detailLink: '/news-detail/news2' },
    { id: 'news3', title: 'Thông tin bên lề Uero', img: './assets/img/product/new3.jpg', excerpt: '"Bóng đá đã trở lại", câu nói tưởng chừng bình thường nhưng lại vô cùng ý nghĩa...', detailLink: '/news-detail/news3' }
];


function HomePage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showQuickViewModal, setShowQuickViewModal] = useState(false);
    const [selectedProductForModal, setSelectedProductForModal] = useState(null);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        const overlay = document.querySelector('.overlay');
        if (overlay) {
            overlay.classList.toggle('hidden', !isMobileMenuOpen);
        }
    };

    const openQuickView = (product) => {
        setSelectedProductForModal(product);
        setShowQuickViewModal(true);
        const overlay = document.querySelector('.overlay');
        if (overlay) overlay.classList.remove('hidden');
    };

    const closeQuickView = () => {
        setShowQuickViewModal(false);

    };

    useEffect(() => {
        // Initialize Bootstrap Carousel
        const carousel = document.querySelector('#demo');
        if (window.bootstrap && carousel) { // Check if bootstrap is loaded
            // new window.bootstrap.Carousel(carousel, { // Using Bootstrap 5 syntax
            //     interval: 3000,
            //     ride: 'carousel'
            // });
        } else if (window.jQuery && window.jQuery.fn.carousel) { // Fallback for Bootstrap 4
            window.jQuery('#demo').carousel({
                interval: 3000
            });
        }
    }, []);


    const renderStars = (rating) => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<i key={i} className="home-product-item__star--gold fas fa-star"></i>);
            } else if (i - 0.5 === rating) {
                stars.push(<i key={i} className="home-product-item__star--gold fas fa-star-half-alt"></i>);
            }
            else {
                stars.push(<i key={i} className="fas fa-star" style={{ color: "#d5d5d5" }}></i>);
            }
        }
        return stars;
    };


    return (
        <div style={{ backgroundColor: 'rgb(248, 242, 236)' }}>

            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="container">
                {/* Slide show */}
                <div className="row">
                    <section className="awe-section-1">
                        <div className="mt-4 top-sliders col-md-12">
                            <div className="slideshow">
                                <div id="demo" className="carousel slide" data-ride="carousel" data-interval="3000">
                                    <ul className="carousel-indicators">
                                        <li data-target="#demo" data-slide-to="0" className="active"></li>
                                        <li data-target="#demo" data-slide-to="1"></li>
                                        <li data-target="#demo" data-slide-to="2"></li>
                                    </ul>
                                    <div className="carousel-inner">
                                        <div className="carousel-item active">
                                            <img src="./assets/img/slideshow/1.jpg" alt="Los Angeles" className="d-block w-100" />
                                            <div className="carousel-caption">
                                                <Link to="/products" className="click-slideshow">Xem chi tiết</Link>
                                            </div>
                                        </div>
                                        <div className="carousel-item">
                                            <img src="./assets/img/slideshow/2.jpg" alt="Chicago" className="d-block w-100" />
                                            <div className="carousel-caption">
                                                <Link to="/products" className="click-slideshow">Xem chi tiết</Link>
                                            </div>
                                        </div>
                                        <div className="carousel-item">
                                            <img src="./assets/img/slideshow/3.jpg" alt="New York" className="d-block w-100" />
                                            <div className="carousel-caption">
                                                <Link to="/products" className="click-slideshow">Xem chi tiết</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <a className="carousel-control-prev" href="#demo" role="button" data-slide="prev">
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="sr-only">Previous</span>
                                    </a>
                                    <a className="carousel-control-next" href="#demo" role="button" data-slide="next">
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="sr-only">Next</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Product Sections */}
                <div className="product">
                    <div className="container">
                        {/* Popular Products */}
                        <div className="product_popular">
                            <h3 className="product__popular title-product">Sản phẩm phổ biến</h3>
                            <div className="row">
                                {sampleProducts.popular.map(product => (
                                    <div className="col-lg-4 col-md-6 col-sm-12 mb-20" key={product.id}>
                                        <div className="card">
                                            <img className="card-img-top" src={product.img} alt={product.name} />
                                            <div className="card-body">
                                                <h4 className="card-title">{product.name}</h4>
                                                <p className="card-text description">{product.description}</p>
                                                <Link to={product.detailLink} title={product.name} className="btn btn-buynow">
                                                    Xem ngay
                                                    <i className="fas fa-arrow-right"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* New Products */}
                        <div className="product__new">
                            <h3 className="product__ne title-product">Sản phẩm mới</h3>
                            <div className="row">
                                {sampleProducts.new.map(product => (
                                    <div className="col-lg-3 col-md-6 col-sm-12 mb-20" key={product.id}>
                                        <Link to={product.detailLink} className="product__new-item">
                                            <div className="card">
                                                <div>
                                                    <img className="card-img-top" src={product.img} alt={product.name} />
                                                    <form action="" className="hover-icon hidden-sm hidden-xs">
                                                        <input type="hidden" />
                                                        <button
                                                            type="button"
                                                            className="btn-add-to-cart"
                                                            title="Mua ngay"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                alert('Thêm vào giỏ: ' + product.name);
                                                            }}
                                                        >
                                                            <i className="fas fa-cart-plus"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            data-toggle="modal"
                                                            data-target="#myModalQuickView"
                                                            className="quickview"
                                                            title="Xem nhanh"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                openQuickView(product);
                                                            }}
                                                        >
                                                            <i className="fas fa-search"></i>
                                                        </button>
                                                    </form>
                                                </div>
                                                <div className="card-body">
                                                    <h5 className="card-title description">{product.name}</h5>
                                                    <div className="product__price">
                                                        <p className="card-text price-color product__price-old">{product.oldPrice.toLocaleString('vi-VN')} đ</p>
                                                        <p className="card-text price-color product__price-new">{product.price.toLocaleString('vi-VN')} đ</p>
                                                    </div>
                                                    <div className="home-product-item__action">
                                                        <span className="home-product-item__like home-product-item__like--liked">
                                                            <i className="home-product-item__like-icon-empty far fa-heart"></i>
                                                            <i className="home-product-item__like-icon-fill fas fa-heart"></i>
                                                        </span>
                                                        <div className="home-product-item__rating">
                                                            {renderStars(product.rating)}
                                                        </div>
                                                        <span className="home-product-item__sold">{product.sold} đã bán</span>
                                                    </div>
                                                    <div className="sale-off">
                                                        <span className="sale-off-percent">{product.discount}%</span>
                                                        <span className="sale-off-label">GIẢM</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hot Products */}
                        <div className="product__sale"> {/* Original class was product__sale, reusing for "hot" */}
                            <h3 className="product__sale title-product">Top sản phẩm hot</h3>
                            <div className="row">
                                {sampleProducts.hot.map(product => (
                                    <div className="col-lg-3 col-md-6 col-sm-12 mb-20" key={product.id}>
                                        <Link to={product.detailLink} className="product__new-item">
                                            <div className="card">
                                                <div>
                                                    <img className="card-img-top" src={product.img} alt={product.name} />
                                                    <form action="" className="hover-icon hidden-sm hidden-xs">
                                                        <input type="hidden" />
                                                        <button
                                                            type="button"
                                                            className="btn-add-to-cart"
                                                            title="Mua ngay"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                alert('Thêm vào giỏ: ' + product.name);
                                                            }}
                                                        >
                                                            <i className="fas fa-cart-plus"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            data-toggle="modal"
                                                            data-target="#myModalQuickView"
                                                            className="quickview"
                                                            title="Xem nhanh"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                openQuickView(product);
                                                            }}
                                                        >
                                                            <i className="fas fa-search"></i>
                                                        </button>
                                                    </form>
                                                </div>
                                                <div className="card-body">
                                                    <h5 className="card-title description">{product.name}</h5>
                                                    <div className="product__price">
                                                        <p className="card-text price-color product__price-old">{product.oldPrice.toLocaleString('vi-VN')} đ</p>
                                                        <p className="card-text price-color product__price-new">{product.price.toLocaleString('vi-VN')} đ</p>
                                                    </div>
                                                    <div className="home-product-item__action">
                                                        <span className="home-product-item__like home-product-item__like--liked">
                                                            <i className="home-product-item__like-icon-empty far fa-heart"></i>
                                                            <i className="home-product-item__like-icon-fill fas fa-heart"></i>
                                                        </span>
                                                        <div className="home-product-item__rating">
                                                            {renderStars(product.rating)}
                                                        </div>
                                                        <span className="home-product-item__sold">{product.sold} đã bán</span>
                                                    </div>
                                                    <div className="sale-off">
                                                        <span className="sale-off-percent">{product.discount}%</span>
                                                        <span className="sale-off-label">GIẢM</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Policy Section <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */}
                        <PolicySection />


                        {/* You May Like Products */}
                        <div className="product__yml">
                            <h3 className="product__yml title-product">Có thể bạn sẽ thích</h3>
                            <div className="row">
                                {sampleProducts.youMayLike.map(product => (
                                    <div className="col-lg-3 col-md-6 col-sm-12 mb-20" key={product.id}>
                                        <Link to={product.detailLink} className="product__new-item">
                                            <div className="card">
                                                <div>
                                                    <img className="card-img-top" src={product.img} alt={product.name} />
                                                    <form action="" className="hover-icon hidden-sm hidden-xs">
                                                        <input type="hidden" />
                                                        <button
                                                            type="button"
                                                            className="btn-add-to-cart"
                                                            title="Mua ngay"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                alert('Thêm vào giỏ: ' + product.name);
                                                            }}
                                                        >
                                                            <i className="fas fa-cart-plus"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            data-toggle="modal"
                                                            data-target="#myModalQuickView"
                                                            className="quickview"
                                                            title="Xem nhanh"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                openQuickView(product);
                                                            }}
                                                        >
                                                            <i className="fas fa-search"></i>
                                                        </button>
                                                    </form>
                                                </div>
                                                <div className="card-body">
                                                    <h5 className="card-title description">{product.name}</h5>
                                                    <div className="product__price">
                                                        <p className="card-text price-color product__price-old">{product.oldPrice.toLocaleString('vi-VN')} đ</p>
                                                        <p className="card-text price-color product__price-new">{product.price.toLocaleString('vi-VN')} đ</p>
                                                    </div>
                                                    <div className="home-product-item__action">
                                                        <span className="home-product-item__like home-product-item__like--liked">
                                                            <i className="home-product-item__like-icon-empty far fa-heart"></i>
                                                            <i className="home-product-item__like-icon-fill fas fa-heart"></i>
                                                        </span>
                                                        <div className="home-product-item__rating">
                                                            {renderStars(product.rating)}
                                                        </div>
                                                        <span className="home-product-item__sold">{product.sold} đã bán</span>
                                                    </div>
                                                    <div className="sale-off">
                                                        <span className="sale-off-percent">{product.discount}%</span>
                                                        <span className="sale-off-label">GIẢM</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* News Section */}
                <div className="shoesnews">
                    <div className="container">
                        <h3 className="shoesnews__title">Tin tức</h3>
                        <div className="row">
                            {sampleNews.map(newsItem => (
                                <div className="col-lg-4 col-md-4 col-sm-12 mb-20" key={newsItem.id}>
                                    <Link to={newsItem.detailLink} className="product__new-item">
                                        <div className="card">
                                            <img className="card-img-top" src={newsItem.img} alt={newsItem.title} />
                                            <div className="card-body">
                                                <h5 className="card-title description title-news">{newsItem.title}</h5>
                                                <p className="card-text description">{newsItem.excerpt}</p>
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
            </div>

            <Footer />
            <GoToTop />
            <ModalQuickView product={selectedProductForModal} show={showQuickViewModal} handleClose={closeQuickView} />
        </div>
    );
}

export default HomePage;