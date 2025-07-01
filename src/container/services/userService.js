import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
console.log('API is calling to:', API_URL);

const API = axios.create({
    baseURL: API_URL,
});

//  Login: POST /api/login
export const handleLoginApi = (email, password) => {
    return API.post('/login', { email, password });
};

//  Check email tồn tại: POST /api/forgot-password
export const checkEmailExist = (email) => {
    return API.post('/forgot-password', { email }); // API backend
};

//  Đặt lại mật khẩu: POST /api/reset-password
export const updatePasswordUser = (email, newPassword) => {
    return API.post('/reset-password', { email, newPassword });
};
//
export const handleRegisterApi = (email, password, name, role = 'user') => {
    return API.post('/register', { email, password, name, role });
};
//user
export const getAllUsers = () => {
    return API.get('/users');
}
export const deleteUser = (userId) => {

    return API.delete(`/users/${userId}`);
};
// 

export const trackLogin = (type) => {
    return API.post('/stat', { type }); //  Ghi thống kê sau login
};
export const fetchTodayStats = () => API.get('/date');
export const fetchMonthStats = () => API.get('/month');
export const getStats = () => API.get('/summary');

/// create product
export const handleAddProduct = async (formData) => {
    return API.post('/add-product', formData);
};
// get all-product
export const getAllProduct = () => {
    return API.get('/product-all');
}

// update product
export const handleUpdateProduct = (productId, formData) => {
    // Truyền thẳng FormData làm tham số thứ hai
    return API.put(`/product/${productId}`, formData);
};
export const handleDeleteProduct = (productId) => {
    return API.delete(`/product/${productId}`);
};
// get all-categories
export const getAllCategories = () => {
    return API.get('/category-all');

}
//category-add
export const createCategory = async (createCategoryData) => {
    return API.post('/add-category', createCategoryData);

}
// update
export const updateCategory = async (id, createCategoryData) => {
    return API.put(`/category/${id}`, createCategoryData);

}
// delete
export const deleteCategory = async (id) => {
    return API.delete(`/category/${id}`);
}
// discount
export const getAllDiscounts = () => {
    return API.get('/discount-all');
}
export const createDiscount = async (createDiscountData) => {
    return API.post('/add-discount', createDiscountData);
}
export const updateDiscount = async (discountId, createDiscountData) => {
    return API.put(`/discount/${discountId}`, createDiscountData);
}
export const deleteDiscount = async (discountId) => {
    return API.delete(`/discount/${discountId}`);
}

// gán mã giảm giá
export const assignDiscountsToProduct = (productId, discountId) => {

    return API.post(`/products/${productId}/assign-discounts`, { discountId });
};
//order
export const getAllOrders = (params) => {
    return API.get('/order-all', { params });

}
export const createOrder = async (createItemOrder) => {
    return API.post('/add-order', createItemOrder);
}
export const updateOrderStatus = async (orderId, statusData) => {
    return API.put(`/update-order/${orderId}/status`, statusData);
}


// review rating
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAdminAllReviews = (params) => {

    return API.get('/admin/reviews', {
        headers: getAuthHeaders(),
        params: params
    });
};

export const exportReviewsToExcel = async (reviewIds) => {
    return API.post('/reviews/export', { reviewIds },
        {
            headers: getAuthHeaders(),
            responseType: 'blob'
        }
    )
}

//Login for user

export const updateUserProfile = (profileData) => {
    return API.put('/users/profile', profileData, {
        headers: getAuthHeaders()
    });
};

export const changeUserPassword = (passwordData) => {
    return API.post('/users/change-password', passwordData, {
        headers: getAuthHeaders()
    });
};



// ... các hàm cũ ...
// -- Home Page Products --
export const getNewestProducts = () => API.get('/products/newest');
export const getHotProducts = () => API.get('/products/hot');
export const getPopularProducts = () => API.get('/products/popular');
export const getYouMayLikeProducts = () => API.get('/products/newest?limit=4');
export const getFilteredProducts = (params) => {
    return API.get('/products/filter', { params })
};
export const getFilterOptions = () => {
    return API.get('/products/filters-data');
};
// -- Product Detail Page --
export const getProductById = (productId) => API.get(`/product/${productId}`);
export const getRelatedProducts = (productId) => API.get(`/products/related/${productId}`);
export const getProductBySlug = (slug) => API.get(`/products/slug/${slug}`);
