import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // ✅ trỏ đúng server backend
});

// ✅ Login: POST /api/login
export const handleLoginApi = (email, password) => {
    return API.post('/login', { email, password });
};

// ✅ Check email tồn tại: POST /api/forgot-password
export const checkEmailExist = (email) => {
    return API.post('/forgot-password', { email }); // ✅ API backend
};

// ✅ Đặt lại mật khẩu: POST /api/reset-password
export const updatePasswordUser = (email, newPassword) => {
    return API.post('/reset-password', { email, newPassword });
};
//
export const handleRegisterApi = (email, password, name, role = 'user') => {
    return API.post('/register', { email, password, name, role });
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