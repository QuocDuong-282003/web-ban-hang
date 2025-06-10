import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';
import ModalQuickView from '../components/common/ModalQuickView';
import ProductItem from '../components/product/ProductItem'; // Tái sử dụng ProductItem

import { apiProducts } from '../data/productsData'; // Lấy dữ liệu sản phẩm mẫu
// import './ListLikePage.css';

// Giả sử danh sách ID sản phẩm yêu thích được lưu ở đâu đó (localStorage, context, state)
const sampleLikedProductIds = [1, 3, 5]; // Ví dụ

function ListLikePage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [likedProducts, setLikedProducts] = useState([]);
    const [showQuickViewModal, setShowQuickViewModal] = useState(false);
    const [selectedProductForModal, setSelectedProductForModal] = useState(null);

    useEffect(() => {
        // Lọc sản phẩm yêu thích từ apiProducts
        const favoriteItems = apiProducts.filter(product => sampleLikedProductIds.includes(product.id));
        setLikedProducts(favoriteItems);
    }, []); // Chạy một lần khi component mount

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const openQuickView = (product) => {
        setSelectedProductForModal(product);
        setShowQuickViewModal(true);
        // Overlay logic
    };

    const closeQuickView = () => {
        setShowQuickViewModal(false);
        setSelectedProductForModal(null);
        // Overlay logic
    };

    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen || showQuickViewModal ? '' : 'hidden'}`}
                onClick={isMobileMenuOpen ? toggleMobileMenu : (showQuickViewModal ? closeQuickView : null)}>
            </div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="listlike" style={{ paddingTop: '30px', paddingBottom: '30px' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Danh Sách Yêu Thích</h2>
                    {likedProducts.length > 0 ? (
                        <div className="row">
                            {likedProducts.map(product => (
                                <ProductItem key={product.id} product={product} onQuickView={openQuickView} />
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center' }}>Bạn chưa có sản phẩm yêu thích nào.</p>
                    )}
                </div>
            </div>

            <Footer />
            <GoToTop />
            <ModalQuickView product={selectedProductForModal} show={showQuickViewModal} handleClose={closeQuickView} />
        </div>
    );
}

export default ListLikePage;