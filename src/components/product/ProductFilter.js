import React, { useState, useEffect, useCallback } from 'react';
import { getFilterOptions } from '../../container/services/userService'; // Điều chỉnh đường dẫn nếu cần
import { debounce } from 'lodash';

function ProductFilter({ onFilterChange, initialFilters }) {
    const [priceRange, setPriceRange] = useState(initialFilters.priceRange || '');
    const [selectedBrands, setSelectedBrands] = useState(initialFilters.brands || []);
    const [brandOptions, setBrandOptions] = useState([]);

    const priceOptions = [
        { label: 'Dưới 1,000,000đ', value: '0-999999' },
        { label: '1,000,000đ - 2,000,000đ', value: '1000000-2000000' },
        { label: '2,000,000đ - 4,000,000đ', value: '2000001-4000000' },
        { label: 'Trên 4,000,000đ', value: '4000001-999999999' }
    ];

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await getFilterOptions();
                // Thêm bước kiểm tra response có tồn tại hay không
                if (response && response.data) {
                    setBrandOptions(response.data.brands || []);
                } else {
                    console.error("API getFilterOptions không trả về dữ liệu.");
                }
            } catch (error) {
                console.error("Lỗi tải tùy chọn lọc:", error.response?.data || error.message);
            }
        };
        fetchOptions();
    }, []);
    // Dùng debounce để tránh gọi API liên tục khi người dùng click nhanh
    const debouncedOnFilterChange = useCallback(debounce(onFilterChange, 400), [onFilterChange]);

    useEffect(() => {
        debouncedOnFilterChange({ priceRange, brands: selectedBrands });
    }, [priceRange, selectedBrands, debouncedOnFilterChange]);

    // Cập nhật state nội bộ khi URL thay đổi (người dùng back/forward trình duyệt)
    useEffect(() => {
        setPriceRange(initialFilters.priceRange || '');
        setSelectedBrands(initialFilters.brands || []);
    }, [initialFilters]);

    const handleBrandChange = (e) => {
        const { value, checked } = e.target;
        setSelectedBrands(prev => checked ? [...prev, value] : prev.filter(b => b !== value));
    };

    return (
        <div className="product-filter-sidebar">
            <h4>Khoảng giá</h4>
            <ul className="filter-list" style={{ listStyle: 'none', paddingLeft: 0 }}>
                {priceOptions.map(opt => (
                    <li key={opt.value}><label><input type="radio" name="priceRange" value={opt.value} checked={priceRange === opt.value} onChange={(e) => setPriceRange(e.target.value)} /> {opt.label}</label></li>
                ))}
                <li><label><input type="radio" name="priceRange" value="" checked={!priceRange} onChange={(e) => setPriceRange('')} /> Tất cả</label></li>
            </ul>

            <h4 style={{ marginTop: '20px' }}>Thương hiệu</h4>
            <ul className="filter-list" style={{ listStyle: 'none', paddingLeft: 0 }}>
                {brandOptions.map(brand => (
                    <li key={brand}><label><input type="checkbox" value={brand} checked={selectedBrands.includes(brand)} onChange={handleBrandChange} /> {brand}</label></li>
                ))}
            </ul>
        </div>
    );
}
export default ProductFilter;