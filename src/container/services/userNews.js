import axios from 'axios';
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
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
/// for client
export const getAllNewClient = () => {
    return API.get('/news');
}
export const getNewsBySlug = (slug) => {
    return API.get(`/news/${slug}`);
}