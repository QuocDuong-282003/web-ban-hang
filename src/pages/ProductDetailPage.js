import React, { Component, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MobileMenu from '../components/common/MobileMenu';
import GoToTop from '../components/common/GoToTop';
import ProductItem from '../components/product/ProductItem'; // Để hiển thị sản phẩm liên quan

import { apiProducts } from '../data/productsData'; // Import dữ liệu

function ProductDetailPage() {
    const { productId } = useParams(); // Lấy productId từ URL
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [currentImage, setCurrentImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [showAddedToCartAlert, setShowAddedToCartAlert] = useState(false);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {

        const foundProduct = apiProducts.find(p => p.id.toString() === productId);
        setProduct(foundProduct);
        if (foundProduct && foundProduct.img) {
            setCurrentImage(foundProduct.img);
            // Tìm sản phẩm liên quan (ví dụ: cùng category nhưng khác id)
            const related = apiProducts.filter(
                p => p.category === foundProduct.category && p.id.toString() !== productId
            ).slice(0, 4); // Lấy 4 sản phẩm
            setRelatedProducts(related);
        }


    }, [productId]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleImageClick = (imageSrc) => {
        setCurrentImage(imageSrc);
    };

    const handleQuantityChange = (amount) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };
    const handleDirectQuantityInput = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1) {
            setQuantity(value);
        } else if (e.target.value === "") { /* Allow empty for typing */ }
    };


    const handleAddToCart = () => {
        // Logic thêm vào giỏ hàng
        console.log(`Added to cart: ${product.name}, Quantity: ${quantity}, Color: ${selectedColor}, Size: ${selectedSize}`);
        setShowAddedToCartAlert(true);
        const overlay = document.querySelector('.overlay1');
        if (overlay) overlay.style.display = 'block';

        setTimeout(() => {
            setShowAddedToCartAlert(false);
            if (overlay) overlay.style.display = 'none';
        }, 7000);
    };
    const closeCartAlert = () => {
        setShowAddedToCartAlert(false);
        const overlay = document.querySelector('.overlay1');
        if (overlay) overlay.style.display = 'none';
    }


    if (!product) {
        return <div>Sản phẩm không tìm thấy!</div>;
    }

    return (
        <div>
            <div className={`overlay ${isMobileMenuOpen ? '' : 'hidden'}`} onClick={isMobileMenuOpen ? toggleMobileMenu : null}></div>
            <MobileMenu isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
            <Header />

            <div className="container">
                <div className="product__detail">
                    <div className="row product__detail-row">
                        <div className="col-lg-6 col-12 daonguoc">
                            <div className="img-product">
                                <ul className="all-img">
                                    {product.gallery && product.gallery.map((imgSrc, index) => (
                                        <li className="img-item" key={index}>
                                            <img src={imgSrc} className="small-img" alt={`Thumbnail ${index + 1}`} onClick={() => handleImageClick(imgSrc)} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div id="main-img" style={{ cursor: 'pointer' }} >
                                {/* Image zoom component sẽ thay thế img này */}
                                <img src={currentImage} className="big-img" alt={product.name} id="img-main" />
                                {product.oldPrice && product.price < product.oldPrice && (
                                    <div className="sale-off sale-off-2">
                                        <span className="sale-off-percent">{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</span>
                                        <span className="sale-off-label">GIẢM</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="product__name">
                                <h2>{product.name}</h2>
                            </div>
                            <div className="status-product">
                                Trạng thái: <b>{product.inStock ? 'Còn hàng' : 'Hết hàng'}</b>
                            </div>
                            <div className="infor-oder">
                                Loại sản phẩm: <b>{product.category || "Chưa rõ"}</b>
                            </div>
                            <div className="product__price">
                                <h2>{product.price.toLocaleString('vi-VN')}đ</h2>
                            </div>
                            {product.oldPrice && (
                                <div className="price-old">
                                    Giá gốc:
                                    <del>{product.oldPrice.toLocaleString('vi-VN')}đ</del>
                                    <span className="discount">(-{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%)</span>
                                </div>
                            )}

                            {/* Color Selector */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="product__color d-flex" style={{ alignItems: 'center' }}>
                                    <div className="title" style={{ fontSize: '16px', marginRight: '10px' }}>Màu:</div>
                                    <div className="select-swap d-flex">
                                        {product.colors.map(color => (
                                            <div className="circlecheck" key={color.id}>
                                                <input
                                                    type="radio"
                                                    id={`color-${color.id}`}
                                                    name="selector-color"
                                                    value={color.id}
                                                    checked={selectedColor === color.id}
                                                    onChange={() => setSelectedColor(color.id)}
                                                />
                                                <label htmlFor={`color-${color.id}`} style={{ backgroundColor: color.hex, border: selectedColor === color.id ? `2px solid #000` : `2px solid ${color.hex}` }}></label>
                                                <div className="outer-circle"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selector */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="product__size d-flex" style={{ alignItems: 'center' }}>
                                    <div className="title" style={{ fontSize: '16px', marginRight: '10px' }}>Kích thước:</div>
                                    <div className="select-swap">
                                        {product.sizes.map(size => (
                                            <div className="swatch-element" data-value={size.name} key={size.id}>
                                                <input
                                                    type="radio"
                                                    className="variant-1"
                                                    id={`swatch-size-${size.id}`}
                                                    name="size-selector"
                                                    value={size.id}
                                                    checked={selectedSize === size.id}
                                                    onChange={() => setSelectedSize(size.id)}
                                                />
                                                <label htmlFor={`swatch-size-${size.id}`} className={`sd ${selectedSize === size.id ? 'selected' : ''}`}><span>{size.name}</span></label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="product__wrap">
                                <div className="product__amount">
                                    <label htmlFor="text_so_luong">Số lượng: </label>
                                    <input type="button" value="-" className="control" onClick={() => handleQuantityChange(-1)} />
                                    <input
                                        type="text"
                                        value={quantity}
                                        className="text-input"
                                        id="text_so_luong"
                                        onChange={handleDirectQuantityInput}
                                        onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                                    />
                                    <input type="button" value="+" className="control" onClick={() => handleQuantityChange(1)} />
                                </div>
                                <button className="add-cart" onClick={handleAddToCart}>Thêm vào giỏ</button>
                            </div>
                            <div className="product__shopnow">
                                <button className="shopnow" onClick={() => alert('Mua ngay')}>Mua ngay</button>
                                <span className="home-product-item__like home-product-item__like--liked"> {/* Logic cho like */}
                                    <i className="home-product-item__like-icon-empty far fa-heart" style={{ fontSize: '24px', marginTop: '7px' }}></i>
                                    <i className="home-product-item__like-icon-fill fas fa-heart" style={{ fontSize: '24px', marginTop: '7px' }}></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product__describe">
                <div className="container">
                    <h2 className="product__describe-heading">Mô tả</h2>
                    <div className="row">
                        <div className="col-1 d-none d-md-block"></div> {/* For spacing on larger screens */}
                        <div className="col-md-11 col-12">
                            <h3 className="name__product">{product.name}</h3>
                            <div dangerouslySetInnerHTML={{ __html: product.fullDescription || "Chưa có mô tả chi tiết." }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comment Section - Sẽ cần state và logic để xử lý comment */}
            <div className="product__comment">
                {/* ... (Code bình luận như trong HTML gốc, nhưng sẽ cần state và logic) ... */}
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="product__relateto">
                    <div className="container">
                        <h3 className="product__relateto-heading">Sản phẩm liên quan</h3>
                        <div className="row">
                            {relatedProducts.map(rp => (
                                <ProductItem key={rp.id} product={rp} onQuickView={() => { }} /> // onQuickView có thể không cần ở đây
                            ))}
                        </div>
                        <div className="seemore">
                            <Link to="/products">Xem thêm</Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert Cart Modal */}
            {showAddedToCartAlert && product && (
                <div id="alert-cart" className="alert" style={{ display: 'block' }}>
                    <div className="alert__heading">
                        <h4>Thêm vào giỏ hàng</h4>
                    </div>
                    <div className="alert__body">
                        <img src={product.img} alt={product.name} className="alert__body-img" />
                        <div>
                            <h5 className="alert__body-name">{product.name}</h5>
                            <span className="alert__body-amount">Số lượng: {quantity}</span>
                            <h6 className="alert__body-price">{(product.price * quantity).toLocaleString('vi-VN')} VNĐ</h6>
                        </div>
                    </div>
                    <div className="alert__footer">
                        <Link to="/cart" className="click__cart" style={{ borderRadius: '4px' }} onClick={closeCartAlert}>Xem giỏ hàng</Link>
                    </div>
                </div>
            )}
            <div className="overlay1" style={{ display: showAddedToCartAlert ? 'block' : 'none' }} onClick={closeCartAlert}></div>


            <Footer />
            <GoToTop />
        </div>
    );
}

export default ProductDetailPage;