// --- FILE: hooks/useClientSideSearch.js ---

import { useState, useMemo, useEffect } from 'react';

export const useClientSideSearch = (fullData = [], itemsPerPage = 10) => {
    const allItems = fullData || [];
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Lọc dữ liệu dựa trên searchTerm
    const filteredItems = useMemo(() => {
        if (!searchTerm) {
            return allItems;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return allItems.filter(item => {
            // Logic tìm kiếm linh hoạt, tìm trong các trường 'name' và 'description'
            const searchableText = `${item.name || ''} ${item.description || ''}`.toLowerCase();
            return searchableText.includes(lowercasedFilter);
        });
    }, [allItems, searchTerm]);

    // Reset về trang 1 mỗi khi kết quả lọc thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredItems.length]);


    // Phân trang dữ liệu đã lọc
    const paginatedResult = useMemo(() => {
        const totalItems = filteredItems.length;
        const totalPage = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const items = filteredItems.slice(startIndex, endIndex);

        return {
            items,
            totalPage: totalPage > 0 ? totalPage : 1,
        };
    }, [filteredItems, currentPage, itemsPerPage]);

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
        totalItems: filteredItems.length // Trả về tổng số kết quả sau khi lọc
    };
};