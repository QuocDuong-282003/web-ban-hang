// import React, { useState, useEffect, useCallback } from 'react';
// import { getFilterOptions } from '../../container/services/userService'; // Điều chỉnh đường dẫn nếu cần
// import { debounce } from 'lodash';

// function ProductFilter({ onFilterChange, initialFilters }) {
//     const [priceRange, setPriceRange] = useState(initialFilters.priceRange || '');
//     const [selectedBrands, setSelectedBrands] = useState(initialFilters.brands || []);
//     const [brandOptions, setBrandOptions] = useState([]);

//     const priceOptions = [
//         { label: 'Dưới 1,000,000đ', value: '0-999999' },
//         { label: '1,000,000đ - 2,000,000đ', value: '1000000-2000000' },
//         { label: '2,000,000đ - 4,000,000đ', value: '2000001-4000000' },
//         { label: 'Trên 4,000,000đ', value: '4000001-999999999' }
//     ];

//     useEffect(() => {
//         const fetchOptions = async () => {
//             try {
//                 const response = await getFilterOptions();
//                 if (response && response.data) {
//                     setBrandOptions(response.data.brands || []);
//                 } else {
//                     console.error("API getFilterOptions không trả về dữ liệu.");
//                 }
//             } catch (error) {
//                 console.error("Lỗi tải tùy chọn lọc:", error.response?.data || error.message);
//             }
//         };
//         fetchOptions();
//     }, []);
//     const debouncedOnFilterChange = useCallback(debounce(onFilterChange, 400), [onFilterChange]);

//     useEffect(() => {
//         debouncedOnFilterChange({ priceRange, brands: selectedBrands });
//     }, [priceRange, selectedBrands, debouncedOnFilterChange]);

//     useEffect(() => {
//         setPriceRange(initialFilters.priceRange || '');
//         setSelectedBrands(initialFilters.brands || []);
//     }, [initialFilters]);

//     const handleBrandChange = (e) => {
//         const { value, checked } = e.target;
//         setSelectedBrands(prev => checked ? [...prev, value] : prev.filter(b => b !== value));
//     };

//     return (
//         <div className="product-filter-sidebar">
//             <h4>Khoảng giá</h4>
//             <ul className="filter-list" style={{ listStyle: 'none', paddingLeft: 0 }}>
//                 {priceOptions.map(opt => (
//                     <li key={opt.value}><label><input type="radio" name="priceRange" value={opt.value} checked={priceRange === opt.value} onChange={(e) => setPriceRange(e.target.value)} /> {opt.label}</label></li>
//                 ))}
//                 <li><label><input type="radio" name="priceRange" value="" checked={!priceRange} onChange={(e) => setPriceRange('')} /> Tất cả</label></li>
//             </ul>

//             <h4 style={{ marginTop: '20px' }}>Thương hiệu</h4>
//             <ul className="filter-list" style={{ listStyle: 'none', paddingLeft: 0 }}>
//                 {brandOptions.map(brand => (
//                     <li key={brand}>
//                         <label>
//                             <input type="checkbox" value={brand} checked={selectedBrands.includes(brand)} onChange={handleBrandChange} /> {brand}
//                         </label>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }
// export default ProductFilter;


import React, { useState, useEffect } from 'react';
import { getFilterOptions } from '../../container/services/userService'; // Giữ nguyên đường dẫn của bạn

// Bỏ debounce đi vì nó không cần thiết trong logic mới và có thể gây phức tạp
// import { debounce } from 'lodash';

function ProductFilter({ onFilterChange, initialFilters }) {
    // State vẫn được khởi tạo từ initialFilters để hiển thị đúng trạng thái ban đầu
    const [priceRange, setPriceRange] = useState(initialFilters.priceRange || '');
    const [selectedBrands, setSelectedBrands] = useState(initialFilters.brands || []);
    const [brandOptions, setBrandOptions] = useState([]);

    const priceOptions = [
        { label: 'Dưới 1,000,000đ', value: '0-999999' },
        { label: '1,000,000đ - 2,000,000đ', value: '1000000-2000000' },
        { label: '2,000,000đ - 4,000,000đ', value: '2000001-4000000' },
        { label: 'Trên 4,000,000đ', value: '4000001-999999999' }
    ];

    // useEffect này chỉ để lấy danh sách thương hiệu, không thay đổi gì
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await getFilterOptions();
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

    // === THAY ĐỔI QUAN TRỌNG NHẤT: Bỏ các useEffect gây lỗi ===
    // Chúng ta không cần các useEffect tự động gọi onFilterChange nữa.

    // === TẠO CÁC HÀM XỬ LÝ MỚI ĐỂ GỌI onFilterChange TRỰC TIẾP ===

    // Hàm này được gọi khi người dùng click vào radio button giá
    const handlePriceChange = (newPriceRange) => {
        // Cập nhật state nội bộ để thay đổi giao diện (tích vào radio button)
        setPriceRange(newPriceRange);

        // Gọi onFilterChange để báo cho component cha (ProductPage) rằng filter đã thay đổi
        // Gửi cả giá mới và thương hiệu hiện tại
        onFilterChange({ priceRange: newPriceRange, brands: selectedBrands });
    };

    // Hàm này được gọi khi người dùng click vào checkbox thương hiệu
    const handleBrandChange = (e) => {
        const { value, checked } = e.target;

        // Tính toán mảng thương hiệu mới
        const newBrands = checked
            ? [...selectedBrands, value]
            : selectedBrands.filter(b => b !== value);

        // Cập nhật state nội bộ để thay đổi giao diện (tick/bỏ tick checkbox)
        setSelectedBrands(newBrands);

        // Gọi onFilterChange để báo cho component cha
        // Gửi cả giá hiện tại và mảng thương hiệu mới
        onFilterChange({ priceRange: priceRange, brands: newBrands });
    };

    // useEffect này chỉ có một nhiệm vụ: đồng bộ state của component này với URL
    // khi người dùng điều hướng (ví dụ: nhấn nút back/forward trên trình duyệt).
    // Nó sẽ không gây ra vòng lặp gọi lại onFilterChange.
    useEffect(() => {
        setPriceRange(initialFilters.priceRange || '');
        setSelectedBrands(initialFilters.brands || []);
    }, [initialFilters.priceRange, initialFilters.brands.join(',')]); // Phụ thuộc vào các giá trị cụ thể, ổn định hơn


    return (
        <div className="product-filter-sidebar">
            <h4>Khoảng giá</h4>
            <ul className="filter-list" style={{ listStyle: 'none', paddingLeft: 0 }}>
                {priceOptions.map(opt => (
                    <li key={opt.value}>
                        <label>
                            <input
                                type="radio"
                                name="priceRange"
                                value={opt.value}
                                checked={priceRange === opt.value}
                                // Gọi hàm xử lý mới khi có sự kiện onChange
                                onChange={() => handlePriceChange(opt.value)}
                            /> {opt.label}
                        </label>
                    </li>
                ))}
                <li>
                    <label>
                        <input
                            type="radio"
                            name="priceRange"
                            value=""
                            checked={!priceRange}
                            // Gọi hàm xử lý mới khi có sự kiện onChange
                            onChange={() => handlePriceChange('')}
                        /> Tất cả
                    </label>
                </li>
            </ul>

            <h4 style={{ marginTop: '20px' }}>Thương hiệu</h4>
            <ul className="filter-list" style={{ listStyle: 'none', paddingLeft: 0 }}>
                {brandOptions.map(brand => (
                    <li key={brand}>
                        <label>
                            <input
                                type="checkbox"
                                value={brand}
                                checked={selectedBrands.includes(brand)}
                                // Gọi hàm xử lý mới khi có sự kiện onChange
                                onChange={handleBrandChange}
                            /> {brand}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default ProductFilter;