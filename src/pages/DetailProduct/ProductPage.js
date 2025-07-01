import React, { useState, useEffect, useCallback } from 'react';
// SỬA 1: Import useNavigate thay cho useHistory
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ProductFilter from '../../components/product/ProductFilter';
import ProductItem from '../../components/product/ProductItem';
import { getFilteredProducts } from '../../container/services/userService';
import { toast } from 'react-toastify';

const sortOptions = [
    { value: 'popular', label: 'Sản phẩm nổi bật' },
    { value: 'best-selling', label: 'Bán chạy nhất' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá: Tăng dần' },
    { value: 'price-desc', label: 'Giá: Giảm dần' },
    { value: 'name-asc', label: 'Tên: A-Z' },
    { value: 'name-desc', label: 'Tên: Z-A' },
    { value: 'oldest', label: 'Cũ nhất' },
];

function ProductPage() {
    const location = useLocation();
    // SỬA 2: Dùng useNavigate() thay cho useHistory()
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const getFiltersFromURL = useCallback(() => {
        const params = queryString.parse(location.search);
        return {
            priceRange: params.priceRange || '',
            brands: params.brands ? params.brands.split(',') : [],
            sort: params.sort || 'popular',
            page: parseInt(params.page) || 1
        };
    }, [location.search]);

    const [filters, setFilters] = useState(getFiltersFromURL);

    useEffect(() => {
        const fetchAndSet = async () => {
            const currentFilters = getFiltersFromURL();
            setFilters(currentFilters);
            setIsLoading(true);
            try {
                const response = await getFilteredProducts(currentFilters);
                console.log('check response', response)
                setProducts(response.data.data || []);
                setPagination(response.data.pagination || {});
            } catch (error) { toast.error("Lỗi: Không thể tải danh sách sản phẩm."); }
            finally { setIsLoading(false); }
        }
        fetchAndSet();
    }, [location.search, getFiltersFromURL]);

    const updateURL = (newFilters) => {
        const currentFilters = getFiltersFromURL();
        const finalFilters = { ...currentFilters, ...newFilters };
        const stringified = queryString.stringify(finalFilters, {
            skipEmptyString: true, skipNull: true, arrayFormat: 'comma'
        });
        // SỬA 3: Dùng navigate() thay cho history.push()
        navigate({ pathname: '/products', search: stringified });
    };

    // SỬA 4: Bỏ history ra khỏi dependency của useCallback vì nó không còn tồn tại
    const handleFilterChange = useCallback((changedFilters) => {
        updateURL({ ...changedFilters, page: 1 });
    }, [getFiltersFromURL]); // Dependency bây giờ chỉ cần getFiltersFromURL và updateURL

    const handleSortChange = (e) => {
        updateURL({ sort: e.target.value, page: 1 });
    };

    const handlePageChange = (page) => {
        updateURL({ page });
    };

    return (
        <div>
            <Header />
            <div className="container" style={{ marginTop: '30px' }}>
                <div className="row">
                    <div className="col-lg-3">
                        <ProductFilter onFilterChange={handleFilterChange} initialFilters={filters} />
                    </div>
                    <div className="col-lg-9">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h1>Tất cả sản phẩm</h1>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px' }}>Sắp xếp theo:</span>
                                <select value={filters.sort} onChange={handleSortChange}>
                                    {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            {isLoading ? (
                                <div className="col-12 text-center"><p>Đang tải...</p></div>
                            ) : (products && products.length > 0) ? (

                                products.map(product => (

                                    <div className="col-lg-4 col-md-6 col-sm-6 col-6 mb-4" key={product._id}>
                                        <ProductItem product={product} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center"><p>Không tìm thấy sản phẩm nào.</p></div>
                            )}
                        </div>
                        {/* Phân trang */}
                        {!isLoading && pagination.totalPages > 1 && (
                            <nav style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
                                <ul className="pagination">
                                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                                        <li key={i + 1} className={`page-item ${i + 1 === pagination.currentPage ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default ProductPage;