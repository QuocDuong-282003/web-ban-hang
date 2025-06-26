import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Nếu dùng Bootstrap
//import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Nếu cần JS Bootstrap
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import store from './container/redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
