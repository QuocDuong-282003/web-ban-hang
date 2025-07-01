// --- THAY THẾ TOÀN BỘ FILE: src/pages/ProductDetailPage/ProductDetailPage.js ---

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MobileMenu from '../../components/common/MobileMenu';
import GoToTop from '../../components/common/GoToTop';
import ProductItem from '../../components/product/ProductItem';
import { getProductById, getRelatedProducts } from '../../container/services/userService';

// Hàm render sao - Đặt ở ngoài component vì nó không phụ thuộc vào state/props
const renderStars = (rating) => {
    const stars = [];
    const numericRating = typeof rating === 'number' ? rating : 0;
    const fullStars = Math.floor(numericRating);
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push(<i key={i} className="fas fa-star text-warning"></i>);
        } else {
            stars.push(<i key={i} className="far fa-star text-secondary"></i>);
        }
    }
    return stars;
};

function ProductDetailPage() {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showAddedToCartAlert, setShowAddedToCartAlert] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchProductData = async () => {
            if (!productId) return;
            setIsLoading(true);
            try {
                const [productRes, relatedRes] = await Promise.all([
                    getProductById(productId),
                    getRelatedProducts(productId)
                ]);

                if (productRes && productRes.data) {
                    const productData = productRes.data;
                    setProduct(productData);
                    if (productData.images && productData.images.length > 0) {
                        setCurrentImage(productData.images[0]);
                    }
                    if (productData.options && productData.options.length > 0) {
                        setSelectedOption(productData.options[0]);
                    } else {
                        setSelectedOption(null);
                    }
                } else {
                    setProduct(null);
                    toast.error("Không tìm thấy sản phẩm.");
                }

                if (relatedRes && relatedRes.data) {
                    setRelatedProducts(relatedRes.data);
                }
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
                setProduct(null);
                toast.error("Có lỗi xảy ra, không thể tải sản phẩm.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProductData();
    }, [productId]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const handleImageClick = (imageSrc) => setCurrentImage(imageSrc);

    const handleQuantityChange = (amount) => {
        setQuantity(prev => {
            const newQuantity = prev + amount;
            if (newQuantity < 1) return 1;
            if (newQuantity > product.stock) {
                toast.warn(`Chỉ còn ${product.stock} sản phẩm có sẵn.`);
                return product.stock;
            }
            return newQuantity;
        });
    };

    const handleAddToCart = () => {
        if (!product || product.stock < 1) {
            toast.warn("Sản phẩm đã hết hàng!");
            return;
        }
        if (product.options && product.options.length > 0 && !selectedOption) {
            toast.warn("Vui lòng chọn một phân loại.");
            return;
        }
        console.log(`Đã thêm vào giỏ: ${product.name}, Tùy chọn: ${selectedOption}, Số lượng: ${quantity}`);
        setShowAddedToCartAlert(true);
    };

    const handleBuyNow = () => {
        if (!product || product.stock < 1) {
            toast.warn("Sản phẩm đã hết hàng!");
            return;
        }
        if (product.options && product.options.length > 0 && !selectedOption) {
            toast.warn("Vui lòng chọn một phân loại.");
            return;
        }

        const itemToBuy = {
            productId: product._id,
            name: product.name,
            price: product.finalPrice,
            quantity: quantity,
            image: currentImage,
            option: selectedOption,
        };

        localStorage.setItem('buy_now_item', JSON.stringify([itemToBuy]));
        navigate('/pay');
    };

    const closeCartAlert = () => setShowAddedToCartAlert(false);

    // .   trạng thái loading
    if (isLoading) {
        return (
            <div className="text-center p-5 vh-100 d-flex align-items-center justify-content-center">
                <h3>Đang tải chi tiết sản phẩm...</h3>
            </div>
        );
    }

    // . Hiển thị nếu không tìm thấy sản phẩm 
    if (!product) {
        return (
            <div className="text-center p-5 vh-100 d-flex align-items-center justify-content-center">
                <h3>Sản phẩm không tồn tại hoặc đã bị xóa.</h3>
            </div>
        );
    }

    // 3.  khi product đã có dữ liệu render giao diện chính
    const displayRating = (product.rating || 0).toFixed(1);
    const numReviews = product.numReviews || 0;
    const soldCount = product.sold || 0;

    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={isMobileMenuOpen ? toggleMobileMenu : null}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="container my-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb bg-light p-2 ">
                        <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                        <li className="breadcrumb-item"><Link to="/products">Sản phẩm</Link></li>
                        <li className="breadcrumb-item"><Link to={`/products?category=${product.category?._id}`}>{product.category?.name || 'Chưa phân loại'}</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
                    </ol>
                </nav>

                <div className="bg-white p-3 p-md-4">
                    <div className="row">
                        <div className="col-lg-5 col-md-5 mb-4 mb-md-0">
                            <div className="main-image-container position-relative mb-3">
                                <img
                                    src={currentImage || '/assets/img/placeholder.png'}
                                    alt={product.name}
                                    className="img-fluid w-100"
                                    style={{ height: '450px', objectFit: 'cover', border: '1px solid #eee' }}
                                />
                                {product.finalPrice < product.price && (
                                    <span className="badge badge-danger position-absolute" style={{ top: '10px', left: '10px', fontSize: '14px', padding: '5px 8px' }}>
                                        -{Math.round(((product.price - product.finalPrice) / product.price) * 100)}%
                                    </span>
                                )}
                            </div>
                            {product.images && product.images.length > 1 && (
                                <div className="d-flex flex-wrap">
                                    {product.images.map((img, index) => (
                                        <div key={index} className="p-1" style={{ flex: '0 0 20%' }}>
                                            <img
                                                src={img}
                                                alt={`thumb ${index + 1}`}
                                                className={`img-fluid w-100 cursor-pointer ${img === currentImage ? 'active-thumbnail' : ''}`}
                                                onClick={() => handleImageClick(img)}
                                                style={{ height: '80px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="col-lg-7 col-md-7">
                            <div className="product-info">
                                <h3 className="h4 font-weight-normal">
                                    <span className="badge badge-danger mr-2">Yêu thích</span>
                                    {product.name}
                                </h3>

                                <div className="d-flex align-items-center my-3 text-secondary small flex-wrap">
                                    <span className="text-warning font-weight-bold mr-1">{displayRating}</span>
                                    <span className="mr-2">{renderStars(product.rating)}</span>
                                    <div className="border-left pl-2 mr-2"><span>{numReviews}</span> Đánh giá</div>
                                    <div className="border-left pl-2"><span>{soldCount}</span> Đã bán</div>
                                </div>

                                <div className="bg-light p-3 my-3 d-flex align-items-center flex-wrap">
                                    {product.finalPrice < product.price && <del className="text-muted mr-3">{product.price.toLocaleString('vi-VN')}đ</del>}
                                    <h2 className="h2 mb-0 text-danger font-weight-bold">{product.finalPrice.toLocaleString('vi-VN')}đ</h2>
                                </div>

                                {product.options && product.options.length > 0 && (
                                    <div className="d-flex flex-wrap align-items-center mb-3">
                                        <div className="text-secondary mr-4" style={{ minWidth: '80px' }}>Phân loại</div>
                                        <div className="d-flex flex-wrap">
                                            {product.options.map(opt => (
                                                <button
                                                    key={opt}
                                                    className={`btn btn-outline-secondary m-1 ${selectedOption === opt ? 'active-option' : ''}`}
                                                    onClick={() => setSelectedOption(opt)}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="d-flex align-items-center my-4">
                                    <div className="text-secondary mr-4" style={{ minWidth: '80px' }}>Số Lượng</div>
                                    <div className="input-group" style={{ maxWidth: '150px' }}>
                                        <div className="input-group-prepend">
                                            <button className="btn btn-outline-secondary" type="button" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
                                        </div>
                                        <input type="text" className="form-control text-center" value={quantity} readOnly />
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-secondary" type="button" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>+</button>
                                        </div>
                                    </div>
                                    <span className="ml-3 text-secondary small">{product.stock} sản phẩm có sẵn</span>
                                </div>

                                <div className="mt-4">
                                    <button className="btn btn-lg btn-outline-danger mr-2" onClick={handleAddToCart} disabled={product.stock < 1}>
                                        <i className="fas fa-cart-plus mr-2"></i>Thêm Vào Giỏ Hàng
                                    </button>
                                    <button className="btn btn-lg btn-danger" onClick={handleBuyNow} disabled={product.stock < 1}>
                                        Mua Ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container my-4">
                <div className="bg-white p-4">
                    <h5 className="font-weight-bold text-uppercase text-secondary p-3 bg-light mb-3">Mô tả sản phẩm</h5>
                    <p className="text-secondary">{product.description || "Chưa có mô tả chi tiết."}</p>
                </div>
            </div>
            {relatedProducts && relatedProducts.length > 0 && (
                <div className="container my-4">
                    <h5 className="font-weight-bold text-uppercase">Sản phẩm tương tự</h5>
                    <div className="row mt-3">
                        {/* Lặp qua danh sách sản phẩm liên quan */}
                        {relatedProducts.map(rp => (
                            // Gán các class cột ở đây, không phải trong ProductItem
                            <div className="col-lg-3 col-md-4 col-6 mb-4" key={rp._id}>
                                <ProductItem product={rp} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showAddedToCartAlert && product && (
                <div id="alert-cart" className="alert alert-light position-fixed" style={{ top: '20px', right: '20px', zIndex: 1050, minWidth: '300px', boxShadow: '0 0.5rem 1rem rgba(0,0,0,.15)' }}>
                    <div className="alert-heading d-flex justify-content-between align-items-center">
                        <h4 className="h6 mb-0">Thêm vào giỏ hàng thành công!</h4>
                        <button type="button" className="close" onClick={closeCartAlert}><span>×</span></button>
                    </div>
                    <hr />
                    <div className="alert-body d-flex">
                        <img src={currentImage} alt={product.name} className="img-fluid mr-3" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                        <div>
                            <h5 className="h6 font-weight-bold mb-1">{product.name}</h5>
                            <span className="d-block small text-muted">Phân loại: {selectedOption}</span>
                            <span className="d-block small text-muted">Số lượng: {quantity}</span>
                        </div>
                    </div>
                    <hr />
                    <div className="alert-footer text-right">
                        <Link to="/cart" className="btn btn-danger" onClick={closeCartAlert}>Xem giỏ hàng</Link>
                    </div>
                </div>
            )}

            <div className={`overlay ${showAddedToCartAlert ? 'd-block' : 'd-none'}`} onClick={closeCartAlert} style={{ zIndex: 1040 }}></div>


            <Footer />
            <GoToTop />
        </div>
    );
}

export default ProductDetailPage;