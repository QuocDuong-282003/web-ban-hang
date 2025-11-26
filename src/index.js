import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Nếu dùng Bootstrap
//import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Nếu cần JS Bootstrap
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from './container/redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Get Google Client ID from environment variables
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (!googleClientId) {
    console.warn('⚠️ REACT_APP_GOOGLE_CLIENT_ID is not set in .env file. Google login will not work.');
}

root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={googleClientId || ''}>
            <Provider store={store}>
                <App />
            </Provider>
        </GoogleOAuthProvider>
    </React.StrictMode>
);
