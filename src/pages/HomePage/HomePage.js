// --- THAY THẾ TOÀN BỘ FILE: src/pages/HomePage/HomePage.js ---

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Import các component layout chung
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MobileMenu from '../../components/common/MobileMenu';
import GoToTop from '../../components/common/GoToTop';
import ModalQuickView from '../../components/common/ModalQuickView';
import PolicySection from '../../components/Home/PolicySection';

// Import các component con của trang chủ
import PopularProductsSection from './ComponentProduct/PopularProductsSection';
import ProductGridSection from './ComponentProduct/ProductGridSection';
import NewsSection from './ComponentProduct/NewsSection';

// BƯỚC 1: IMPORT CÁC HÀM API TỪ SERVICE
import {
    getPopularProducts,
    getNewestProducts,
    getHotProducts,
    getYouMayLikeProducts,

} from '../../container/services/userService';
import { getAllNewClient } from '../../container/services/userNews';
// Giữ lại dữ liệu mẫu cho tin tức (vì chưa có API cho tin tức)
const sampleNews = [
    { id: 'news1', title: 'Tin tức về giày puma', img: './assets/img/product/new2.jpg', excerpt: 'Trong phạm vi bài viết ngày hôm nay, hãy cùng Thanh Hùng Futsal khám phá...', detailLink: '/news-detail/news1' },
    { id: 'news2', title: 'Người sáng lập đế chế puma', img: './assets/img/product/new1.jpg', excerpt: '"PUMA ra mắt KING TOP DASSLER phiên bản giới hạn...', detailLink: '/news-detail/news2' },
    { id: 'news3', title: 'Thông tin bên lề Uero', img: './assets/img/product/new3.jpg', excerpt: '"Bóng đá đã trở lại", câu nói tưởng chừng bình thường nhưng lại vô cùng ý nghĩa...', detailLink: '/news-detail/news3' }
];

function HomePage() {
    // State cho layout và modal 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showQuickViewModal, setShowQuickViewModal] = useState(false);
    const [selectedProductForModal, setSelectedProductForModal] = useState(null);

    //  STATE  LƯU DỮ LIỆU TỪ API 
    const [popularProducts, setPopularProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [hotProducts, setHotProducts] = useState([]);
    const [youMayLikeProducts, setYouMayLikeProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // State  quản lý trạng thái tải
    //sate news
    const [newItems, setNewsItems] = useState([]);
    //   useEffect GỌI API KHI COMPONENT ĐƯỢC TẢI
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {

                setIsLoading(true);
                const [
                    popularRes,
                    newRes,
                    hotRes,
                    youMayLikeRes,
                    newsRes
                ] = await Promise.all([
                    getPopularProducts(),
                    getNewestProducts(),
                    getHotProducts(),
                    getYouMayLikeProducts(), // Sử dụng hàm đã tạo cho mục "Có thể bạn sẽ thích"
                    getAllNewClient()
                ]);

                // Cập nhật state với dữ liệu nhận được từ API
                setPopularProducts(popularRes.data);
                setNewProducts(newRes.data);
                setHotProducts(hotRes.data);
                setYouMayLikeProducts(youMayLikeRes.data);
                setNewsItems(newsRes.data.data.slice(0, 3));

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu trang chủ:", error);
                toast.error("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.");
            } finally {
                // Dừng trạng thái loading dù API thành công hay thất bại
                setIsLoading(false);
            }
        };

        fetchAllProducts();
    }, []); // Mảng rỗng `[]` đảm bảo effect này chỉ chạy một lần duy nhất

    // Các hàm xử lý giao diện (giữ nguyên)
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const openQuickView = (product) => {
        setSelectedProductForModal(product);
        setShowQuickViewModal(true);
    };

    const closeQuickView = () => setShowQuickViewModal(false);

    return (
        <div style={{ backgroundColor: 'rgb(248, 242, 236)' }}>
            <div className={`overlay ${isMobileMenuOpen || showQuickViewModal ? '' : 'hidden'}`} onClick={isMobileMenuOpen ? toggleMobileMenu : closeQuickView}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="container">
                {/* Slide show (giữ nguyên) */}
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

                {/* BƯỚC 4: HIỂN THỊ "LOADING..." HOẶC CÁC SECTION SẢN PHẨM */}
                {isLoading ? (
                    <div className="text-center p-5"><h3>Đang tải sản phẩm...</h3></div>
                ) : (
                    <div className="product">
                        <div className="container">

                            {/* Truyền dữ liệu từ state (API) thay vì dữ liệu mẫu */}
                            <PopularProductsSection products={popularProducts} />

                            <ProductGridSection
                                title="Sản phẩm mới"
                                products={newProducts}
                                openQuickView={openQuickView}
                            />

                            <ProductGridSection
                                title="Top sản phẩm hot"
                                products={hotProducts}
                                openQuickView={openQuickView}
                            />

                            <PolicySection />

                            <ProductGridSection
                                title="Có thể bạn sẽ thích"
                                products={youMayLikeProducts}
                                openQuickView={openQuickView}
                            />
                        </div>
                    </div>
                )}

                {/* News Section (vẫn dùng dữ liệu mẫu) */}
                <NewsSection newsItems={newItems} />
            </div>

            <Footer />
            <GoToTop />
            <ModalQuickView product={selectedProductForModal} show={showQuickViewModal} handleClose={closeQuickView} />
        </div>
    );
}

export default HomePage;
