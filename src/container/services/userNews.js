import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


const API = axios.create({
    baseURL: API_URL,
});

export const getAllNews = () => {
    return API.get('/admin/news');
}
export const deleteNews = async (id) => {
    return API.delete(`/admin/news/${id}`);
}
export const updateNews = async (newId, formData) => {
    return API.put(`/admin/news/${newId}`, formData);

}
export const createNews = async (formData) => {
    return API.post('/admin/news', formData)

}
export const uploadContentImage = (file) => {
    const body = new FormData();
    body.append('image', file);
    return API.post('/content-image', body);
};



// Thêm một hàm helper để lấy URL đầy đủ của ảnh
export const getFullImageUrl = (relativePath) => {
    if (!relativePath) return ''; // Hoặc một ảnh placeholder
    return `${API_URL}${relativePath}`;
};
/// for client
export const getAllNewClient = () => {
    return API.get('/news');
}
export const getNewsBySlug = (slug) => {
    return API.get(`/news/${slug}`);
}

