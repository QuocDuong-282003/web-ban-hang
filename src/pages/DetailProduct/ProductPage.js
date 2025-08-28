// import React, { useState, useEffect, useCallback } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import queryString from 'query-string';

// // Import components
// import Header from '../../components/common/Header';
// import Footer from '../../components/common/Footer';
// import ProductFilter from '../../components/product/ProductFilter';
// import ProductItem from '../../components/product/ProductItem';

// // Import services and hooks
// import { getFilteredProducts } from '../../container/services/userService';
// import { useClientSideSearch } from '../../container/hooks/useClientSideSearch';
// import { toast } from 'react-toastify';
// import { useMemo } from 'react';

// const sortOptions = [

//     { value: 'popular', label: 'Sản phẩm nổi bật' },
//     { value: 'best-selling', label: 'Bán chạy nhất' },
//     { value: 'newest', label: 'Mới nhất' },
//     { value: 'price-asc', label: 'Giá: Tăng dần' },
//     { value: 'price-desc', label: 'Giá: Giảm dần' },
//     { value: 'name-asc', label: 'Tên: A-Z' },
//     { value: 'name-desc', label: 'Tên: Z-A' },
//     { value: 'oldest', label: 'Cũ nhất' },
// ];

// const productSearchFn = (product, searchTerm) => {
//     if (!product || !product.name) {
//         return false;
//     }
//     return product.name.toLowerCase().includes(searchTerm);
// };

// function ProductPage() {
//     const location = useLocation();
//     const navigate = useNavigate();

//     const [serverFilteredProducts, setServerFilteredProducts] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     const getFiltersFromURL = useCallback(() => {
//         const params = queryString.parse(location.search);
//         return {
//             q: params.q || '',
//             page: parseInt(params.page) || 1,
//             priceRange: params.priceRange || '',
//             brands: params.brands ? params.brands.split(',') : [],
//             sort: params.sort || 'popular',
//         };
//     }, [location.search]);

//     const [filters, setFilters] = useState(getFiltersFromURL);


//     const {
//         items: displayedProducts,
//         totalPage,
//         goToPage,
//         setSearchTerm,
//         totalItems: totalClientFilteredItems,
//     } = useClientSideSearch(serverFilteredProducts, 12, productSearchFn);

//     const updateURL = useCallback((newFilters) => {
//         const currentFilters = getFiltersFromURL();
//         const finalFilters = { ...currentFilters, ...newFilters };

//         if (newFilters.priceRange !== undefined || newFilters.brands !== undefined || newFilters.sort !== undefined) {
//             finalFilters.page = 1;
//         }

//         const stringified = queryString.stringify(finalFilters, {
//             skipEmptyString: true, skipNull: true, arrayFormat: 'comma'
//         });
//         navigate({ pathname: '/products', search: stringified });
//     }, [getFiltersFromURL, navigate]); // Các phụ thuộc của updateURL là getFiltersFromURL và navigate

//     useEffect(() => {
//         const fetchServerData = async () => {
//             const currentFilters = getFiltersFromURL();
//             setFilters(currentFilters);
//             setIsLoading(true);

//             try {
//                 const serverParams = {
//                     priceRange: currentFilters.priceRange,
//                     brands: currentFilters.brands,
//                     sort: currentFilters.sort,
//                     page: currentFilters.page
//                 };

//                 const response = await getFilteredProducts(serverParams);
//                 setServerFilteredProducts(response.data.data || []);
//             } catch (error) {
//                 toast.error("Lỗi: Không thể tải danh sách sản phẩm.");
//                 setServerFilteredProducts([]);
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//         fetchServerData();
//     }, [filters.priceRange, filters.brands.join(','), filters.sort, getFiltersFromURL]);

//     useEffect(() => {
//         const currentFilters = getFiltersFromURL();
//         setSearchTerm(currentFilters.q || '');
//         goToPage(currentFilters.page);
//     }, [location.search, setSearchTerm, goToPage, getFiltersFromURL]);


//     const handleFilterChange = useCallback((changedFilters) => {
//         updateURL(changedFilters);
//     }, [updateURL]);

//     const handleSortChange = (e) => {
//         updateURL({ sort: e.target.value });
//     };

//     const handlePageChange = (page) => {
//         updateURL({ page });
//     };

//     return (
//         <div>
//             <Header />
//             <div className="container" style={{ marginTop: '30px' }}>
//                 <div className="row">
//                     <div className="col-lg-3">
//                         <ProductFilter onFilterChange={handleFilterChange} initialFilters={filters} />
//                     </div>
//                     <div className="col-lg-9">
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                             {filters.q ? (
//                                 <h1>Kết quả cho "{filters.q}"</h1>
//                             ) : (
//                                 <h1>Tất cả sản phẩm</h1>
//                             )}
//                             <div style={{ display: 'flex', alignItems: 'center' }}>
//                                 <span style={{ marginRight: '10px' }}>Sắp xếp theo:</span>
//                                 <select value={filters.sort} onChange={handleSortChange} className="form-control" style={{ width: 'auto' }}>
//                                     {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//                                 </select>
//                             </div>
//                         </div>
//                         <p>Tìm thấy {totalClientFilteredItems} sản phẩm phù hợp.</p>

//                         <div className="row">
//                             {isLoading ? (
//                                 <div className="col-12 text-center"><p>Đang tải sản phẩm...</p></div>
//                             ) : (displayedProducts && displayedProducts.length > 0) ? (
//                                 displayedProducts.map(product => (
//                                     <div className="col-lg-4 col-md-6 col-sm-6 col-6 mb-4" key={product._id}>
//                                         <ProductItem product={product} />
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="col-12 text-center"><p>Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn.</p></div>
//                             )}
//                         </div>

//                         {!isLoading && totalPage > 1 && (
//                             <nav style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
//                                 <ul className="pagination">
//                                     {Array.from({ length: totalPage }, (_, i) => (
//                                         <li key={i + 1} className={`page-item ${i + 1 === filters.page ? 'active' : ''}`}>
//                                             <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </nav>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// }

// export default ProductPage;


import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';

// Import components
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ProductFilter from '../../components/product/ProductFilter';
import ProductItem from '../../components/product/ProductItem';

// Import services and hooks
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
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const filters = useMemo(() => {
        const params = queryString.parse(location.search);
        return {
            q: params.q || '',
            page: parseInt(params.page) || 1,
            priceRange: params.priceRange || '',
            brands: params.brands ? params.brands.split(',') : [],
            sort: params.sort || 'popular',
        };
    }, [location.search]);

    useEffect(() => {
        const fetchServerData = async () => {
            setIsLoading(true);
            try {
                const serverParams = {
                    priceRange: filters.priceRange,
                    brands: filters.brands,
                    sort: filters.sort,
                    page: filters.page,
                    search: filters.q,
                    limit: 12,
                };

                const response = await getFilteredProducts(serverParams);

                setProducts(response.data.data || []);
                setPagination(response.data.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 });

            } catch (error) {
                toast.error("Lỗi: Không thể tải danh sách sản phẩm.");
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServerData();
    }, [location.search]);

    const updateURL = useCallback((newFilters) => {
        const currentParams = queryString.parse(location.search);
        const finalFilters = { ...currentParams, ...newFilters };

        if (
            newFilters.priceRange !== undefined ||
            newFilters.brands !== undefined ||
            newFilters.sort !== undefined ||
            newFilters.q !== undefined
        ) {
            finalFilters.page = 1;
        }

        const stringified = queryString.stringify(finalFilters, {
            skipEmptyString: true, skipNull: true, arrayFormat: 'comma'
        });
        navigate({ pathname: '/products', search: stringified });
    }, [location.search, navigate]);

    const handleSortChange = (e) => {
        updateURL({ sort: e.target.value });
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
                        <ProductFilter onFilterChange={updateURL} initialFilters={filters} />
                    </div>
                    <div className="col-lg-9">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            {filters.q ? (
                                <h1>Kết quả cho "{filters.q}"</h1>
                            ) : (
                                <h1>Tất cả sản phẩm</h1>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px' }}>Sắp xếp theo:</span>
                                <select value={filters.sort} onChange={handleSortChange} className="form-control" style={{ width: 'auto' }}>
                                    {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                        </div>
                        <p>Tìm thấy {pagination.totalItems} sản phẩm phù hợp.</p>

                        <div className="row">
                            {isLoading ? (
                                <div className="col-12 text-center"><p>Đang tải sản phẩm...</p></div>
                            ) : (products && products.length > 0) ? (
                                products.map(product => (
                                    <div className="col-lg-4 col-md-6 col-sm-6 col-6 mb-4" key={product._id}>
                                        <ProductItem product={product} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center"><p>Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn.</p></div>
                            )}
                        </div>

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