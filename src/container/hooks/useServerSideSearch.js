// --- FILE: src/hooks/useServerSideSearch.js ---
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useServerSideSearch = (apiFetchFunction, itemsPerPage = 10) => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = useCallback(async (page, search) => {
        setIsLoading(true);
        try {
            const params = { page, limit: itemsPerPage, search };
            const response = await apiFetchFunction(params);

            if (response.data) {
                setItems(response.data.data || []);
                setTotalPages(response.data.totalPages || 0);
                setTotalItems(response.data.totalItems || 0);
            }
        } catch (error) {
            toast.error("Không thể tải dữ liệu.");
        } finally {
            setIsLoading(false);
        }
    }, [apiFetchFunction, itemsPerPage]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchData(currentPage, searchTerm);
        }, 500); // Debounce
        return () => clearTimeout(handler);
    }, [currentPage, searchTerm, fetchData]);

    const goToPage = (pageNumber) => setCurrentPage(pageNumber);
    const refreshData = () => fetchData(currentPage, searchTerm);

    return { items, isLoading, currentPage, totalPages, totalItems, goToPage, searchTerm, setSearchTerm, refreshData };
};