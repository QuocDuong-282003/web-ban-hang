import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';
import ModalQuickView from '../components/common/ModalQuickView';
import ProductItem from '../components/product/ProductItem';
import { useSelector } from 'react-redux';
import { getProductByIds } from '../container/services/userService';
import { apiProducts } from '../data/productsData';
import { toast } from 'react-toastify';
// import './ListLikePage.css';

const sampleLikedProductIds = [1, 3, 5]; // Ví dụ

function ListLikePage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [likedProducts, setLikedProducts] = useState([]);
    const [showQuickViewModal, setShowQuickViewModal] = useState(false);
    const [selectedProductForModal, setSelectedProductForModal] = useState(null);
    const likedProductIds = useSelector(state => state.wishlist.itemIds);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLikeProducts = async () => {
            if (likedProductIds.length === 0) {
                setLikedProducts([]);
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const response = await getProductByIds(likedProductIds);
                setLikedProducts(response.data || []);
            } catch (error) {
                toast.error("Không thể tải danh sách sản phẩm yêu thích.");
                console.error("Lỗi khi tải sản phẩm yêu thích:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLikeProducts();
    }, [likedProductIds])
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
                    {isLoading ? (
                        <p style={{ textAlign: 'center' }}>Đang tải danh sách yêu thích...</p>
                    ) : likedProducts.length > 0 ? (
                        <div className="row">
                            {/* Tái sử dụng component ProductItem để hiển thị */}
                            {likedProducts.map(product => (
                                <div className="col-lg-3 col-md-4 col-sm-6 col-6 mb-4" key={product._id}>
                                    <ProductItem product={product} />
                                </div>
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