import React, { useCallback, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProductSuggestions } from "../../../container/services/userService";
import './Search.scss'; // Đảm bảo bạn đã import file SCSS

const Search = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isFocused, setIsFocused] = useState(false); // Sửa lỗi chính tả
    const searchContainerRef = useRef(null);

    // Debounce: Gọi API sau khi người dùng ngừng gõ
    useEffect(() => {
        if (!isFocused || !query.trim()) {
            setSuggestions([]);
            return;
        }

        const timerId = setTimeout(async () => {
            try {
                const response = await getProductSuggestions(query);
                if (response.data && response.data.data) {
                    setSuggestions(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
                setSuggestions([]);
            }
        }, 300); // Đợi 300ms

        return () => {
            clearTimeout(timerId);
        };
    }, [query, isFocused]);

    // Xử lý sự kiện click ra ngoài để đóng box gợi ý
    const handleClickOutside = useCallback((event) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
            setIsFocused(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    // Xử lý khi nhấn Enter để tìm kiếm
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (query.trim()) {
            setIsFocused(false);
            const searchQuery = query.trim();
            setQuery(''); // Xóa nội dung ô tìm kiếm sau khi submit
            navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Xử lý khi click vào một gợi ý
    const handleSuggestionClick = () => {
        setIsFocused(false);
        setQuery('');
    };

    return (
        <div className="search-container" ref={searchContainerRef}>
            <form className="search-form" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onFocus={() => setIsFocused(true)}
                />
                <button type="submit" className="search-button">
                    <i className="fa fa-search"></i>
                </button>
            </form>

            {isFocused && (query.trim().length > 0 || suggestions.length > 0) && (
                <div className="search-suggestions">
                    <div className="suggestion-title">
                        Sản phẩm gợi ý
                    </div>
                    <ul>
                        {suggestions.length > 0 ? (
                            suggestions.map(product => (
                                <li key={product._id}>
                                    <Link to={`/product-detail/${product._id}`} className="suggestion-item" onClick={handleSuggestionClick}>
                                        <img src={product.image || '/assets/img/product/no-image.png'} alt={product.name} />
                                        <div className="suggestion-info">
                                            <span className="suggestion-name">{product.name}</span>
                                            <span className="suggestion-price">
                                                {(product.finalPrice || 0).toLocaleString('vi-VN')}₫
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))
                        ) : (
                            query && <li className="no-suggestion">Không tìm thấy sản phẩm phù hợp.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Search;