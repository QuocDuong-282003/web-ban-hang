import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


const API = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Include cookies in requests
    headers: {
        'Content-Type': 'application/json',
    }
});
export const createVnpayPaymentUrl = (paymentData) => {
    // URL đầy đủ sẽ là: http://localhost:5000/api/create_payment_url
    return API.post('/create_payment_url', paymentData);
};
export const createMomoAioPaymentUrl = (paymentData) => {
    // Gọi đến đúng endpoint AIO trên backend
    return API.post('/momo/create-aio', paymentData);
};