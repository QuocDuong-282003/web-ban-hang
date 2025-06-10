import React, { useState, useEffect } from 'react';
// import './ModalQuickView.css'; // Tạo file CSS nếu cần

// Giả sử bạn truyền product vào modal này qua props
function ModalQuickView({ product, show, handleClose }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null); // or a default color
    const [selectedSize, setSelectedSize] = useState(null); // or a default size
    const [currentImage, setCurrentImage] = useState('');

    useEffect(() => {
        if (product && product.images && product.images.length > 0) {
            setCurrentImage(product.images[0]); // Set default image
        }
        setQuantity(1); // Reset quantity when product changes or modal opens
    }, [product]);


    if (!show || !product) {
        return null;
    }

    const handleQuantityChange = (amount) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };

    const handleDirectQuantityInput = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1) {
            setQuantity(value);
        } else if (e.target.value === "") {
            // Allow empty for typing, but maybe default to 1 on blur if still empty
        }
    };

    const handleImageClick = (imageSrc) => {
        setCurrentImage(imageSrc);
    };

    // Giả sử product.images là một array of image URLs
    // Giả sử product.colors là array [{id: 'red', name: 'Red', hex: '#ff0000'}, ...]
    // GiảSử product.sizes là array [{id: 's', name: 'S'}, ...]

    return (
        <div className="modal" id="myModalQuickView" style={{ display: show ? 'block' : 'none' }} onClick={handleClose}>
            <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}> {/* Prevent closing on content click */}
                <div className="modal-content ">
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-6 col-12">
                                <div className="mb-2 main-img-2">
                                    <img src={currentImage || (product.img || './assets/img/product/ars1.jpg')} alt={product.name} id="img-main-modal" />
                                </div>
                                {product.gallery && product.gallery.length > 0 && (
                                    <ul className="all-img-2">
                                        {product.gallery.map((imgSrc, index) => (
                                            <li className="img-item-2" key={index}>
                                                <img
                                                    src={imgSrc}
                                                    alt={`${product.name} - view ${index + 1}`}
                                                    onClick={() => handleImageClick(imgSrc)}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="col-md-6 col-12">
                                <div className="info-product">
                                    <h3 className="product-name">
                                        <a href={`/product/${product.id}`} title={product.name}>{product.name || "Tên sản phẩm"}</a>
                                    </h3>
                                    <div className="status-product">
                                        Trạng thái: <b>{product.inStock ? 'Còn hàng' : 'Hết hàng'}</b>
                                    </div>
                                    <div className="infor-oder">
                                        Loại sản phẩm: <b>{product.category || "Chưa rõ"}</b>
                                    </div>
                                    <div className="price-product">
                                        <div className="special-price">
                                            <span>{(product.price || 0).toLocaleString('vi-VN')}đ</span>
                                        </div>
                                        {product.oldPrice && (
                                            <div className="price-old">
                                                Giá gốc:
                                                <del>{product.oldPrice.toLocaleString('vi-VN')}đ</del>
                                                <span className="discount">(-{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%)</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-description" dangerouslySetInnerHTML={{ __html: product.shortDescription || "Mô tả ngắn..." }}>
                                    </div>

                                    {/* Color Selector */}
                                    {product.colors && product.colors.length > 0 && (
                                        <div className="product__color d-flex" style={{ alignItems: 'center' }}>
                                            <div className="title" style={{ fontSize: '16px', marginRight: '10px' }}>Màu:</div>
                                            <div className="select-swap d-flex">
                                                {product.colors.map(color => (
                                                    <div className="circlecheck" key={color.id}>
                                                        <input
                                                            type="radio"
                                                            id={`color-${color.id}-modal`}
                                                            name="selector-color-modal"
                                                            value={color.id}
                                                            checked={selectedColor === color.id}
                                                            onChange={() => setSelectedColor(color.id)}
                                                            style={{ backgroundColor: color.hex }} // For actual color display
                                                        />
                                                        <label htmlFor={`color-${color.id}-modal`} style={{ borderColor: color.hex }}></label>
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
                                                            id={`swatch-size-${size.id}-modal`}
                                                            name="size-selector-modal"
                                                            value={size.id}
                                                            checked={selectedSize === size.id}
                                                            onChange={() => setSelectedSize(size.id)}
                                                        />
                                                        <label htmlFor={`swatch-size-${size.id}-modal`} className="sd"><span>{size.name}</span></label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="product__wrap">
                                        <div className="product__amount">
                                            <label htmlFor="text_so_luong_modal">Số lượng: </label>
                                            <input type="button" value="-" className="control" onClick={() => handleQuantityChange(-1)} />
                                            <input
                                                type="text"
                                                value={quantity}
                                                className="text-input"
                                                id="text_so_luong_modal"
                                                onChange={handleDirectQuantityInput}
                                                onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                                            />
                                            <input type="button" value="+" className="control" onClick={() => handleQuantityChange(1)} />
                                        </div>
                                    </div>
                                    <div className="product__shopnow">
                                        <button className="shopnow2" onClick={() => alert(`Mua ${quantity} sản phẩm ${product.name}`)}>Mua ngay</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="btn-default btn-close" onClick={handleClose}>
                        <i className="fas fa-times-circle"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalQuickView;