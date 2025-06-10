import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';
import ModalQuickView from '../components/common/ModalQuickView';
import ProductItem from '../components/product/ProductItem'; // Component con
import ProductFilter from '../components/product/ProductFilter'; // Component con
import MobileFilter from '../components/product/MobileFilter'; // Component con

import { apiProducts } from '../data/productsData'; // Import dữ liệu sản phẩm
// import './ProductPage.css'; // CSS riêng cho trang này

function ProductPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showQuickViewModal, setShowQuickViewModal] = useState(false);
    const [selectedProductForModal, setSelectedProductForModal] = useState(null);

    const [products, setProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // Số sản phẩm mỗi trang/lần load
    const [filters, setFilters] = useState({
        priceRange: null,
        brands: [],
        sizes: []
    });
    const [sortOption, setSortOption] = useState('default');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        // Giả lập fetch data
        setProducts(apiProducts);
    }, []);

    useEffect(() => {
        let filtered = [...products];

        // Apply price range filter
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            filtered = filtered.filter(p => p.price >= min && p.price <= max);
        }

        // Apply brand filter
        if (filters.brands.length > 0) {
            filtered = filtered.filter(p => filters.brands.includes(p.brand));
        }

        // Apply size filter
        if (filters.sizes.length > 0) {
            filtered = filtered.filter(p => p.size && p.size.some(s => filters.sizes.includes(s)));
        }

        // Apply sorting
        switch (sortOption) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'best-selling':
                filtered.sort((a, b) => b.sales - a.sales);
                break;
            default:
                // No sort or default sort (e.g., by ID or original order)
                break;
        }

        setDisplayedProducts(filtered.slice(0, currentPage * itemsPerPage));

    }, [products, filters, sortOption, currentPage]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        // Overlay logic
    };

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

    const handleLoadMore = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handleFilterChange = (newFilters) => {
        setCurrentPage(1); // Reset to first page on filter change
        setFilters(newFilters);
    };

    const handleSortChange = (newSortOption, buttonText) => {
        setCurrentPage(1); // Reset to first page on sort change
        setSortOption(newSortOption);
        // Cập nhật text của nút sort (cần ref hoặc state riêng nếu nút sort là component con)
        const sortButton = document.getElementById('sort-button-text');
        if (sortButton) sortButton.textContent = buttonText;
    };

    const toggleMobileFilter = () => {
        setIsMobileFilterOpen(!isMobileFilterOpen);
        const overlay = document.querySelector('.overlay2');
        if (overlay) overlay.classList.toggle('hidden', isMobileFilterOpen);
    };

    // Hàm này được gọi từ MobileFilter component khi áp dụng filter
    const applyMobileFilters = (mobileFilters) => {
        handleFilterChange(mobileFilters); // Sử dụng lại logic filter chung
        toggleMobileFilter(); // Đóng mobile filter
    };

    const allProductsLoaded = displayedProducts.length >= products.filter(p => {
        // Re-apply filters to get the total count of filterable products
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            if (p.price < min || p.price > max) return false;
        }
        if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
        if (filters.sizes.length > 0 && !(p.size && p.size.some(s => filters.sizes.includes(s)))) return false;
        return true;
    }).length;


    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen || showQuickViewModal || isMobileFilterOpen ? '' : 'hidden'}`}
                onClick={isMobileMenuOpen ? toggleMobileMenu : (showQuickViewModal ? closeQuickView : toggleMobileFilter)}>
            </div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="product">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-12 hidden-xs hidden-sm">
                            <ProductFilter onFilterChange={handleFilterChange} initialFilters={filters} />
                        </div>
                        <div className="col-lg-9 col-12">
                            <div className="sort-wrap row">
                                <div className="sort-left col-12 col-lg-6">
                                    <h1 className="coll-name">Tất cả sản phẩm</h1>
                                </div>
                                <div className="sort-right col-12 col-lg-6">
                                    <div className="sortby">
                                        <label htmlFor="sort-dropdown">Sắp xếp theo:</label>
                                        <div className="dropdown">
                                            <button type="button" className="btn btn-dark dropdown-toggle" data-toggle="dropdown" id="sort-button-text">
                                                Sản phẩm nổi bật
                                            </button>
                                            <div className="dropdown-menu">
                                                <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleSortChange('price-asc', 'Giá: Tăng dần') }}>Giá: Tăng dần</a>
                                                <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleSortChange('price-desc', 'Giá: Giảm dần') }}>Giá: Giảm dần</a>
                                                <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleSortChange('name-asc', 'Tên A-Z') }}>Tên A-Z</a>
                                                <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleSortChange('name-desc', 'Tên Z-A') }}>Tên Z-A</a>
                                                <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleSortChange('oldest', 'Cũ nhất') }}>Cũ nhất</a>
                                                <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleSortChange('newest', 'Mới nhất') }}>Mới nhất</a>
                                                <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleSortChange('best-selling', 'Bán chạy nhất') }}>Bán chạy nhất</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sortby2 hidden" style={{ float: 'right' }}> {/* Desktop: hidden, Mobile: block (controlled by CSS) */}
                                        <div className="dropdown">
                                            <button className="btn btn-dark dropdown-toggle" id="filter" onClick={toggleMobileFilter}>
                                                Lọc sản phẩm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row row-product" id="products">
                                {displayedProducts.map(product => (
                                    <ProductItem key={product.id} product={product} onQuickView={openQuickView} />
                                ))}
                                {displayedProducts.length === 0 && <p>Không tìm thấy sản phẩm nào.</p>}
                            </div>
                            {!allProductsLoaded && (
                                <div className="loadmore">
                                    <button style={{ cursor: 'pointer' }} className="loadmore-btn" onClick={handleLoadMore}>Tải thêm</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <MobileFilter
                isOpen={isMobileFilterOpen}
                onClose={toggleMobileFilter}
                onApplyFilters={applyMobileFilters}
                initialFilters={filters}
            />

            <Footer />
            <GoToTop />
            <ModalQuickView product={selectedProductForModal} show={showQuickViewModal} handleClose={closeQuickView} />
        </div>
    );
}

export default ProductPage;