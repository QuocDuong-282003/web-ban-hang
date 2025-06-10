import React, { useState, useEffect } from 'react';

function ProductFilter({ onFilterChange, initialFilters }) {
    const [priceRange, setPriceRange] = useState(initialFilters.priceRange || '');
    const [selectedBrands, setSelectedBrands] = useState(initialFilters.brands || []);
    const [selectedSizes, setSelectedSizes] = useState(initialFilters.sizes || []);

    const [showPrice, setShowPrice] = useState(true);
    const [showBrand, setShowBrand] = useState(true);
    const [showSize, setShowSize] = useState(true);

    const priceOptions = [
        { label: 'Dưới 1,000,000đ', value: '0-1000000' },
        { label: '1,000,000đ-2,000,000đ', value: '1000000-2000000' },
        { label: '2,000,000đ-3,000,000đ', value: '2000000-3000000' },
        { label: '3,000,000đ-4,000,000đ', value: '3000000-4000000' },
        { label: 'Trên 4,000,000đ', value: '4000000-1000000000' } // Max large enough
    ];

    const brandOptions = ['Adidas', 'Nike', 'Puma', 'DESPORTE', 'X-MUNICH', 'GRAND SPORT'];
    const sizeOptions = ['37.5', '38', '38.5', 'X', 'XL', 'L', 'M', 'S', 'One Size', '5']; // Added more sizes

    useEffect(() => {
        // Đảm bảo chỉ gọi khi giá trị thực sự thay đổi
        if (typeof onFilterChange === 'function') {
            onFilterChange({
                priceRange: priceRange,
                brands: selectedBrands,
                sizes: selectedSizes
            });
        }
        // Không cần thêm `onFilterChange` vào dependency nếu nó thay đổi mỗi render
    }, [priceRange, selectedBrands, selectedSizes]);

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

    return (
        <div className="product__filter">
            <div className="product__filter-price">
                <h4 className="product__filter-heading" onClick={() => setShowPrice(!showPrice)} style={{ cursor: 'pointer' }}>
                    Khoảng giá <i className={`fi-rs-${showPrice ? 'minus' : 'plus'}`}></i>
                </h4>
                {showPrice && (
                    <ul className="product__filter-ckeckbox">
                        {priceOptions.map(option => (
                            <li className="product__filter-item" key={option.value}>
                                <label className="form-check-label" htmlFor={`kg-${option.value}`}>
                                    <input
                                        type="radio"
                                        className="form-check-input checkGia"
                                        id={`kg-${option.value}`}
                                        name="priceRangeFilter"
                                        value={option.value}
                                        checked={priceRange === option.value}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                    />
                                    <span>{option.label}</span>
                                </label>
                            </li>
                        ))}
                        <li className="product__filter-item">
                            <label className="form-check-label" htmlFor="kg-all">
                                <input
                                    type="radio"
                                    className="form-check-input checkGia"
                                    id="kg-all"
                                    name="priceRangeFilter"
                                    value="" // Empty value for "all"
                                    checked={priceRange === ''}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                />
                                <span>Tất cả</span>
                            </label>
                        </li>
                    </ul>
                )}
            </div>

            <div className="product__filter-trademark">
                <h4 className="product__filter-heading" onClick={() => setShowBrand(!showBrand)} style={{ cursor: 'pointer' }}>
                    Thương hiệu <i className={`fi-rs-${showBrand ? 'minus' : 'plus'}`}></i>
                </h4>
                {showBrand && (
                    <ul className="product__filter-ckeckbox">
                        {brandOptions.map(brand => (
                            <li className="product__filter-item" key={brand}>
                                <label className="form-check-label" htmlFor={`th-${brand}`}>
                                    <input
                                        type="checkbox"
                                        className="form-check-input checkthuonghieu"
                                        id={`th-${brand}`}
                                        value={brand}
                                        checked={selectedBrands.includes(brand)}
                                        onChange={handleBrandChange}
                                    />
                                    <span>{brand}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="product__filter-size">
                <h4 className="product__filter-heading" onClick={() => setShowSize(!showSize)} style={{ cursor: 'pointer' }}>
                    Size <i className={`fi-rs-${showSize ? 'minus' : 'plus'}`}></i>
                </h4>
                {showSize && (
                    <ul className="product__filter-ckeckbox">
                        {sizeOptions.map(size => (
                            <li className="product__filter-item" key={size}>
                                <label className="form-check-label" htmlFor={`size-${size}`}>
                                    <input
                                        type="checkbox"
                                        className="form-check-input checksize"
                                        id={`size-${size}`}
                                        value={size}
                                        checked={selectedSizes.includes(size)}
                                        onChange={handleSizeChange}
                                    />
                                    <span>{size}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ProductFilter;