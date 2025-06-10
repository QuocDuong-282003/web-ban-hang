import React, { useState, useEffect } from 'react';

function MobileFilter({ isOpen, onClose, onApplyFilters, initialFilters }) {
    const [priceRange, setPriceRange] = useState(initialFilters.priceRange || '');
    const [selectedBrands, setSelectedBrands] = useState(initialFilters.brands || []);
    const [selectedSizes, setSelectedSizes] = useState(initialFilters.sizes || []);

    // Update local state if initialFilters prop changes (e.g., when reopening)
    useEffect(() => {
        setPriceRange(initialFilters.priceRange || '');
        setSelectedBrands(initialFilters.brands || []);
        setSelectedSizes(initialFilters.sizes || []);
    }, [initialFilters, isOpen]);


    const priceOptions = [
        { label: 'Dưới 1,000,000đ', value: '0-1000000' },
        { label: '1,000,000đ-2,000,000đ', value: '1000000-2000000' },
        { label: '2,000,000đ-3,000,000đ', value: '2000000-3000000' },
        { label: '3,000,000đ-4,000,000đ', value: '3000000-4000000' },
        { label: 'Trên 4,000,000đ', value: '4000000-1000000000' }
    ];
    const brandOptions = ['Adidas', 'Nike', 'Puma', 'DESPORTE', 'X-MUNICH', 'GRAND SPORT'];
    const sizeOptions = ['37.5', '38', '38.5', 'X', 'XL', 'L', 'M', 'S', 'One Size', '5'];


    const handleApply = () => {
        onApplyFilters({
            priceRange: priceRange,
            brands: selectedBrands,
            sizes: selectedSizes
        });
    };

    const handleBrandChange = (e) => {
        const { value, checked } = e.target;
        setSelectedBrands(prev =>
            checked ? [...prev, value] : prev.filter(brand => brand !== value)
        );
    };

    const handleSizeChange = (e) => {
        const { value, checked } = e.target;
        setSelectedSizes(prev =>
            checked ? [...prev, value] : prev.filter(size => size !== value)
        );
    };

    if (!isOpen) return null;

    return (
        <div className={`filter-mobile ${isOpen ? 'active' : ''}`}>
            <div className="product__filter">
                {/* Price Filter */}
                <div className="product__filter-price">
                    <h4 className="product__filter-heading">Khoảng giá</h4>
                    <ul className="product__filter-ckeckbox">
                        {priceOptions.map(option => (
                            <li className="product__filter-item" key={`mobile-kg-${option.value}`}>
                                <label className="form-check-label" htmlFor={`mobile-kg-${option.value}`}>
                                    <input
                                        type="radio"
                                        className="form-check-input checkGiaMobile"
                                        id={`mobile-kg-${option.value}`}
                                        name="optradio-mobile"
                                        value={option.value}
                                        checked={priceRange === option.value}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                    />
                                    <span>{option.label}</span>
                                </label>
                            </li>
                        ))}
                        <li className="product__filter-item">
                            <label className="form-check-label" htmlFor="mobile-kg-all">
                                <input
                                    type="radio"
                                    className="form-check-input checkGiaMobile"
                                    id="mobile-kg-all"
                                    name="optradio-mobile"
                                    value="" // Empty value for "all"
                                    checked={priceRange === ''}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                />
                                <span>Tất cả</span>
                            </label>
                        </li>
                    </ul>
                </div>

                {/* Brand Filter */}
                <div className="product__filter-trademark">
                    <h4 className="product__filter-heading">Thương hiệu</h4>
                    <ul className="product__filter-ckeckbox">
                        {brandOptions.map(brand => (
                            <li className="product__filter-item" key={`mobile-th-${brand}`}>
                                <label className="form-check-label" htmlFor={`mobile-th-${brand}`}>
                                    <input
                                        type="checkbox"
                                        className="form-check-input checkThuongHieuMobile"
                                        id={`mobile-th-${brand}`}
                                        value={brand}
                                        checked={selectedBrands.includes(brand)}
                                        onChange={handleBrandChange}
                                    />
                                    <span>{brand}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Size Filter */}
                <div className="product__filter-size">
                    <h4 className="product__filter-heading">Size</h4>
                    <ul className="product__filter-ckeckbox">
                        {sizeOptions.map(size => (
                            <li className="product__filter-item" key={`mobile-size-${size}`}>
                                <label className="form-check-label" htmlFor={`mobile-size-${size}`}>
                                    <input
                                        type="checkbox"
                                        className="form-check-input checkSizeMobile"
                                        id={`mobile-size-${size}`}
                                        value={size}
                                        checked={selectedSizes.includes(size)}
                                        onChange={handleSizeChange}
                                    />
                                    <span>{size}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button onClick={handleApply} className="btn btn-primary btn-block mt-3">Áp dụng</button>
            <button onClick={onClose} className="btn btn-secondary btn-block mt-2">Đóng</button>
        </div>
    );
}

export default MobileFilter;