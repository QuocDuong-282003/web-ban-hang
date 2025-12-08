import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const API = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Include cookies in requests (for HttpOnly cookies)
});
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// check toekn and logout when token end date
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Chỉ redirect nếu:
            // 1. Không phải là request từ /api/me (vì /api/me có thể fail khi user chưa login - đó là bình thường)
            // 2. Không phải đang ở trang public (home, products, etc.)
            const requestUrl = error.config?.url || '';
            const path = window.location.pathname;

            // Không redirect nếu:
            // - Request là /api/me (AuthChecker sẽ xử lý)
            // - Đang ở trang public (home, products, news, etc.)
            // - Đang ở trang login/register (tránh loop)
            const isPublicPath = path === '/' ||
                path.startsWith('/products') ||
                path.startsWith('/news') ||
                path.startsWith('/contact') ||
                path.startsWith('/intro') ||
                path === '/login' ||
                path === '/register';

            const isMeEndpoint = requestUrl.includes('/me');

            // Chỉ redirect nếu là protected route và không phải /api/me
            if (!isMeEndpoint && !isPublicPath) {
                localStorage.removeItem('token');
                if (path.startsWith('/system')) {
                    window.location.href = '/system/login';
                } else {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

// ============ LƯU Ý: TẤT CẢ API AUTHENTICATION ĐÃ CHUYỂN SANG authService.js ============
// 
// ✅ TẤT CẢ API AUTH ĐƯỢC TẬP TRUNG TẠI: src/container/services/authService.js
// 
// 📋 Danh sách API auth (import từ authService.js):
// 
// LOGIN:
//   - handleLoginApi(email, password)
//   - loginWithGoogleToken(id_token)
//   - loginWithGoogle(googleData) [OLD]
//   - loginWithOTP(email, otpCode)
// 
// REGISTER:
//   - registerWithEmail(email, name, password)
//   - verifyOTPAndRegister(email, code, name, password)
//   - registerWithOTP(name, email, otpCode) [OLD]
//   - handleRegisterApi(formData) [OLD]
// 
// OTP:
//   - sendOTP(email, type)
// 
// USER INFO:
//   - getMe() - Lấy thông tin user hiện tại
// 
// LOGOUT:
//   - logout()
// 
// FORGOT PASSWORD:
//   - checkEmailExist(email)
//   - updatePasswordUser(email, newPassword)
// 
// ============ FILE NÀY CHỈ CHỨA API KHÔNG LIÊN QUAN ĐẾN AUTH ============
// image
export const uploadAvatar = (formData) => {
    return API.post('/upload-avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
}
export const getUserInfo = () => API.get('/profile');

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


// create product
export const handleAddProduct = async (formData) => {
    // Khi gửi FormData, chúng ta phải ghi đè Content-Type mặc định
    return API.post('/add-product', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
// get all-product
export const getAllProduct = () => {
    return API.get('/product-all');
}


// update product
export const handleUpdateProduct = (productId, formData) => {
    // Khi gửi FormData, chúng ta phải ghi đè Content-Type mặc định
    // để trình duyệt tự động thiết lập nó thành multipart/form-data với boundary
    return API.put(`/product/${productId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const handleDeleteProduct = (productId) => {
    return API.delete(`/product/${productId}`);
};
// -- Product Detail Page --
export const getProductById = (productId) => API.get(`/product/${productId}`);
export const getRelatedProducts = (productId) => API.get(`/products/related/${productId}`);
export const getProductBySlug = (slug) => API.get(`/products/slug/${slug}`);
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

export const getOrderById = (orderId) => {
    return API.get(`/orders/${orderId}`);
}
export const getMyOrders = () => {
    return API.get('/my-orders');
};


// review rating
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAdminAllReviews = (params) => {

    return API.get('/admin/reviews', {
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
// usse client review
export const createReview = (reviewData) => {
    return API.post('/reviews', reviewData);
}
export const getProductReviews = (productId, params) => {
    // params sẽ là object như { page: 1, limit: 5 }
    return API.get(`/products/${productId}/reviews`, { params });
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

export const getProductByIds = (ids) => {
    return API.post('/products/by-id', { ids });
}
export const cancelMyOder = (orderId) => {
    return API.put(`/orders/${orderId}/cancel-by-user`);
}
//search
export const getProductSuggestions = async (query) => {
    return API.get('/products/suggestions', { params: { q: query } });
}
//cart
export const getCartAPI = () => {
    return API.get('/cart-all');
}
export const addToCart = async (data) => {

    return API.post('/add-cart', data);

}
export const updateCart = async (cartItemId, data) => {

    return API.put(`/update-cart/${cartItemId}`, data);
}
export const deleteCart = async (cartItemId) => {
    return API.delete(`/delete-cart/${cartItemId}`)
}
// contact
export const getAllContact = (params) => {
    return API.get('/contact-all', { params })
}
export const deleteContact = async (id) => {
    return API.delete(`/delete-contact/${id}`);
}
export const createContact = async (contactData) => {
    return API.post('/contact', contactData);
}
export const updateStatus = async (contactId, status) => {
    const requestBody = { status: status };
    return API.put(`/update-status/${contactId}/status`, requestBody);
}