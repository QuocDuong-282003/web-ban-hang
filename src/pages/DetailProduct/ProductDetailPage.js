import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import MobileMenu from '../../components/common/MobileMenu';
import GoToTop from '../../components/common/GoToTop';
import ProductItem from '../../components/product/ProductItem';
import ProductReviews from '../Comment/ProductReviews'; // <-- IMPORT COMPONENT MỚI

import { getProductById, getRelatedProducts, addToCart } from '../../container/services/userService';
import './ProductDetailPage.css';

const renderStars = (rating) => {
    const stars = [];
    const numericRating = typeof rating === 'number' ? rating : 0;
    for (let i = 0; i < 5; i++) {
        stars.push(<i key={i}
            className={`${i < numericRating ? 'fas' : 'far'} 
            fa-star ${i < numericRating ? 'text-warning' : 'text-secondary'}`}></i>);
    }
    return stars;
};

function ProductDetailPage() {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showAddedToCartAlert, setShowAddedToCartAlert] = useState(false);


    useEffect(() => {
        const fetchProductData = async () => {
            if (!productId) return;

            window.scrollTo(0, 0);
            setIsLoading(true);
            setProduct(null);

            try {
                const productRes = await getProductById(productId);

                if (productRes && productRes.data && productRes.data.data) {
                    const productData = productRes.data.data;
                    setProduct(productData);

                    if (Array.isArray(productData.images) && productData.images.length > 0) {
                        setCurrentImage(productData.images[0]);
                    }

                    if (Array.isArray(productData.variants) && productData.variants.length > 0) {
                        setSelectedVariant(productData.variants[0]);
                    } else {
                        setSelectedVariant(null);
                    }

                    if (productData.category?._id) {
                        const relatedRes = await getRelatedProducts(productData._id);
                        if (relatedRes && relatedRes.data) {
                            setRelatedProducts(relatedRes.data);
                        }
                    }
                } else {
                    toast.error("Không tìm thấy sản phẩm.");
                    setProduct(null);
                }
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
                toast.error("Có lỗi xảy ra, không thể tải sản phẩm.");
                setProduct(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductData();
    }, [productId]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const handleImageClick = (imageSrc) => setCurrentImage(imageSrc);

    const closeCartAlert = () => setShowAddedToCartAlert(false);

    const handleQuantityChange = (amount) => {
        setQuantity(prev => {
            const newQuantity = prev + amount;
            if (newQuantity < 1) return 1;

            const stockAvailable = selectedVariant?.stock ?? product?.stock ?? 0;
            if (newQuantity > stockAvailable) {
                toast.warn(`Chỉ còn ${stockAvailable} sản phẩm có sẵn.`);
                return stockAvailable > 0 ? stockAvailable : 1;
            }
            return newQuantity;
        });
    };

    const handleAddToCart = async () => {
        if (!product) return;

        if (Array.isArray(product.variants) && product.variants.length > 0 && !selectedVariant) {
            toast.warn("Vui lòng chọn một phân loại (size/màu).");
            return;
        }

        const stockAvailable = selectedVariant?.stock ?? product?.stock ?? 0;
        if (stockAvailable < 1) {
            toast.error("Sản phẩm đã hết hàng!");
            return;
        }

        setIsAddingToCart(true);
        try {
            const cartData = {
                productId: product._id,
                productVariantId: selectedVariant ? selectedVariant._id : undefined,
                quantity: quantity,
            };

            await addToCart(cartData);
            setShowAddedToCartAlert(true);
        } catch (error) {
            toast.error(error.response?.data?.message || "Thêm vào giỏ hàng thất bại. Vui lòng đăng nhập.");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = () => {
        if (!product) return;

        if (Array.isArray(product.variants) && product.variants.length > 0 && !selectedVariant) {
            toast.warn("Vui lòng chọn một phân loại (size/màu).");
            return;
        }

        const stockAvailable = selectedVariant?.stock ?? product?.stock ?? 0;
        if (stockAvailable < 1) {
            toast.error("Sản phẩm đã hết hàng!");
            return;
        }

        const itemToBuy = {
            productId: product._id,
            productVariantId: selectedVariant?._id,
            name: product.name,
            price: product.finalPrice,
            quantity: quantity,
            image: currentImage,
            option: selectedVariant ? (selectedVariant.size || selectedVariant.color) : null,
            itemTotal: product.finalPrice * quantity
        };
        sessionStorage.setItem('checkout_items', JSON.stringify([itemToBuy]));
        navigate('/pay');
    };

    if (isLoading) { return <div className="text-center p-5 vh-100"><h3>Đang tải...</h3></div>; }
    if (!product) { return <div className="text-center p-5 vh-100"><h3>Không tìm thấy sản phẩm.</h3></div>; }

    const stockAvailable = selectedVariant?.stock ?? product.stock;
    const optionText = selectedVariant ? `${selectedVariant.size || ''} ${selectedVariant.color || ''}`.trim() : null;

    return (
        <div className="product-detail-page">
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={toggleMobileMenu}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="container my-4">
                <div className="bg-white p-3 p-md-4">
                    <div className="row">
                        <div className="col-lg-5 col-md-5 mb-4 mb-md-0">
                            <div className="main-image-container position-relative mb-3">
                                <img src={currentImage || '/assets/img/placeholder.png'} alt={product.name} className="img-fluid w-100" style={{ height: '450px', objectFit: 'cover', border: '1px solid #eee' }} />
                                {product.finalPrice < product.price && (
                                    <span className="badge badge-danger position-absolute" style={{ top: '10px', left: '10px', fontSize: '14px' }}>
                                        -{Math.round(((product.price - product.finalPrice) / product.price) * 100)}%
                                    </span>
                                )}
                            </div>
                            {Array.isArray(product.images) && product.images.length > 1 && (
                                <div className="d-flex flex-wrap">
                                    {product.images.map((img, index) => (
                                        <div key={index} className="p-1" style={{ flex: '0 0 20%' }}>
                                            <img src={img} alt={`thumb ${index + 1}`} className={`img-fluid w-100 cursor-pointer ${img === currentImage ? 'active-thumbnail' : ''}`} onClick={() => handleImageClick(img)} style={{ height: '80px', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="col-lg-7 col-md-7">
                            <h3 className="h4 font-weight-normal">{product.name}</h3>
                            <div className="d-flex align-items-center my-3 text-secondary small flex-wrap">
                                <span className="text-warning font-weight-bold mr-1">{(product.rating || 0).toFixed(1)}</span>
                                <span className="mr-2">{renderStars(product.rating)}</span>
                                <div className="border-left pl-2 mr-2"><span>{product.numReviews || 0}</span> Đánh giá</div>
                                <div className="border-left pl-2"><span>{product.sold || 0}</span> Đã bán</div>
                            </div>
                            <div className="bg-light p-3 my-3 d-flex align-items-center flex-wrap">
                                {product.finalPrice < product.price && <del className="text-muted mr-3">{(product.price || 0).toLocaleString('vi-VN')}₫</del>}
                                <h2 className="h2 mb-0 text-danger font-weight-bold">{(product.finalPrice || 0).toLocaleString('vi-VN')}₫</h2>
                            </div>

                            {Array.isArray(product.variants) && product.variants.length > 0 && (
                                <div className="d-flex flex-wrap align-items-center mb-3">
                                    <div className="text-secondary mr-4" style={{ minWidth: '80px' }}>Phân loại</div>
                                    <div className="d-flex flex-wrap">
                                        {product.variants.map(variant => (
                                            <button key={variant._id} className={`btn btn-outline-secondary m-1 ${selectedVariant?._id === variant._id ? 'active' : ''}`} onClick={() => setSelectedVariant(variant)}>
                                                {variant.size || variant.color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="d-flex align-items-center my-4">
                                <div className="text-secondary mr-4" style={{ minWidth: '80px' }}>Số Lượng</div>
                                <div className="input-group" >
                                    <div className="input-group-prepend">
                                        <button className="btn btn-outline-secondary" type="button" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
                                    </div>
                                    <input type="text" className="form-control text-center" value={quantity} readOnly />
                                    <div className="input-group-append"><button className="btn btn-outline-secondary"
                                        type="button" onClick={() => handleQuantityChange(1)} disabled={quantity >= stockAvailable}>+</button>
                                    </div>
                                </div>
                                <span className="ml-3 text-secondary small">{stockAvailable} sản phẩm có sẵn</span>
                            </div>

                            <div className="mt-4">
                                <button className="btn btn-lg btn-outline-danger mr-2" onClick={handleAddToCart} disabled={stockAvailable < 1 || isAddingToCart}>
                                    {isAddingToCart ? 'Đang thêm...' : <><i className="fas fa-cart-plus mr-2"></i>Thêm Vào Giỏ Hàng</>}
                                </button>
                                <button className="btn btn-lg btn-danger" onClick={handleBuyNow} disabled={stockAvailable < 1}>
                                    Mua Ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 my-4">
                    <h5 className="font-weight-bold text-uppercase text-secondary p-3 bg-light mb-3">Mô tả sản phẩm</h5>
                    <div dangerouslySetInnerHTML={{ __html: product.description || "Chưa có mô tả chi tiết." }} />
                </div>

                <ProductReviews
                    productId={product._id}
                    productRating={product.rating || 0}
                    numReviews={product.numReviews || 0}
                />
                {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
                    <div className="my-4">
                        <h5 className="font-weight-bold text-uppercase">Sản phẩm tương tự</h5>
                        <div className="row mt-3">
                            {relatedProducts.map(rp => (
                                <div className="col-lg-3 col-md-4 col-6 mb-4" key={rp._id}>
                                    <ProductItem product={rp} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Popup thông báo */}
            {showAddedToCartAlert && product && (
                <>
                    <div id="alert-cart" className="alert alert-light position-fixed" style={{ top: '20px', right: '20px', zIndex: 1050, minWidth: '300px', boxShadow: '0 0.5rem 1rem rgba(0,0,0,.15)' }}>
                        <div className="alert-heading d-flex justify-content-between align-items-center">
                            <h4 className="h6 mb-0">Thêm vào giỏ hàng thành công!</h4>
                            <button type="button" className="close" onClick={closeCartAlert}><span>×</span></button>
                        </div>
                        <hr />
                        <div className="alert-body d-flex">
                            <img src={currentImage || '/assets/img/placeholder.png'} alt={product.name} className="img-fluid mr-3" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                            <div>
                                <h5 className="h6 font-weight-bold mb-1">{product.name}</h5>

                                {optionText && <span className="d-block small text-muted">Phân loại: {optionText}</span>}
                                <span className="d-block small text-muted">Số lượng: {quantity}</span>
                            </div>
                        </div>
                        <hr />
                        <div className="alert-footer text-right">
                            <Link to="/cart" className="btn btn-danger" onClick={closeCartAlert}>Xem giỏ hàng</Link>
                        </div>
                    </div>

                </>
            )}
            <div className={`overlay ${showAddedToCartAlert ? 'd-block' : 'd-none'}`} onClick={closeCartAlert} style={{ zIndex: 1040 }}></div>

            <Footer />
            <GoToTop />
        </div>
    );
}

export default ProductDetailPage;