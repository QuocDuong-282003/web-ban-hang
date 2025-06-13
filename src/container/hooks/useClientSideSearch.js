// --- FILE: hooks/useClientSideSearch.js ---

// import { useState, useMemo, useEffect } from 'react';

// export const useClientSideSearch = (fullData = [], itemsPerPage = 10) => {
//     const allItems = fullData || [];
//     const [searchTerm, setSearchTerm] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);

//     // Lọc dữ liệu dựa trên searchTerm
//     const filteredItems = useMemo(() => {
//         if (!searchTerm) {
//             return allItems;
//         }
//         const lowercasedFilter = searchTerm.toLowerCase();
//         return allItems.filter(item => {
//             // Logic tìm kiếm linh hoạt, tìm trong các trường 'name' và 'description'
//             const searchableText = `${item.name || ''} ${item.description || ''}`.toLowerCase();
//             return searchableText.includes(lowercasedFilter);
//         });
//     }, [allItems, searchTerm]);

//     // Reset về trang 1 mỗi khi kết quả lọc thay đổi
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [filteredItems.length]);


//     // Phân trang dữ liệu đã lọc
//     const paginatedResult = useMemo(() => {
//         const totalItems = filteredItems.length;
//         const totalPage = Math.ceil(totalItems / itemsPerPage);
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         const endIndex = startIndex + itemsPerPage;
//         const items = filteredItems.slice(startIndex, endIndex);

//         return {
//             items,
//             totalPage: totalPage > 0 ? totalPage : 1,
//         };
//     }, [filteredItems, currentPage, itemsPerPage]);

//     const goToPage = (pageNumber) => {
//         if (pageNumber >= 1 && pageNumber <= paginatedResult.totalPage) {
//             setCurrentPage(pageNumber);
//         }
//     };

//     return {
//         items: paginatedResult.items,
//         totalPage: paginatedResult.totalPage,
//         currentPage,
//         goToPage,
//         searchTerm,
//         setSearchTerm,
//         totalItems: filteredItems.length // Trả về tổng số kết quả sau khi lọc
//     };
// };
// --- FILE: hooks/useClientSideSearch.js (SỬA LẠI TỪ CODE GỐC CỦA BẠN) ---

import { useState, useMemo, useEffect } from 'react';

/**
 * Hook để tìm kiếm và phân trang ở client-side.
 * @param {Array} fullData - Mảng dữ liệu gốc.
 * @param {number} itemsPerPage - Số item mỗi trang.
 * @param {Function} filterFn - HÀM LỌC được truyền từ bên ngoài.
 */
export const useClientSideSearch = (fullData = [], itemsPerPage = 10, filterFn) => {
    const allItems = Array.isArray(fullData) ? fullData : [];
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredItems = useMemo(() => {
        // Nếu người dùng chưa gõ gì, trả về toàn bộ danh sách
        if (!searchTerm.trim()) {
            return allItems;
        }

        // Nếu người dùng có gõ, nhưng không có hàm lọc được cung cấp,
        // cũng trả về toàn bộ danh sách để tránh lỗi.
        if (typeof filterFn !== 'function') {
            console.warn("useClientSideSearch: `filterFn` không được cung cấp, không thể thực hiện tìm kiếm.");
            return allItems;
        }

        const lowercasedFilter = searchTerm.toLowerCase();
        // Dùng hàm filterFn được truyền từ ngoài vào để lọc
        return allItems.filter(item => filterFn(item, lowercasedFilter));

    }, [allItems, searchTerm, filterFn]); // Thêm filterFn vào dependency array

    // Reset về trang 1 mỗi khi kết quả lọc thay đổi (khi người dùng gõ tìm kiếm)
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredItems.length]); // Giữ nguyên logic cũ của bạn

    // Phân trang 
    const paginatedResult = useMemo(() => {
        const totalItems = filteredItems.length;
        const totalPage = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const items = filteredItems.slice(startIndex, startIndex + itemsPerPage);

        return {
            items,
            totalPage: totalPage > 0 ? totalPage : 1,
        };
    }, [filteredItems, currentPage, itemsPerPage]);

    // Hàm chuyển trang
    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= paginatedResult.totalPage) {
            setCurrentPage(pageNumber);
        }
    };


    return {
        items: paginatedResult.items,
        totalPage: paginatedResult.totalPage,
        currentPage,
        goToPage,
        searchTerm,
        setSearchTerm,
        totalItems: filteredItems.length
    };
};