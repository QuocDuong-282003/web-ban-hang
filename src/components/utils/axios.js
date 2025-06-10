import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/', // 🛡️ Chỉnh lại đúng backend bạn
    withCredentials: true, // Nếu server dùng cookie/session
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
