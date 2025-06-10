import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { path } from './components/utils/constant';

// Public Pages
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import CartPage from './pages/CartPage';
import PayPage from './pages/PayPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import IntroPage from './pages/IntroPage';
import ContactPage from './pages/ContactPage';
import ListLikePage from './pages/ListLikePage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AccountManagementPage from './pages/AccountManagementPage';
import { ToastContainer } from 'react-toastify';
// Admin
import AdminLayout from './container/AdminLayout';
import Dashboard from './container/pages/Dashboard';
import Profile from './container/pages/Profile';
import Ecommerce from './container/pages/Ecommerce';
import User from './container/pages/User';
import ListCategory from './container/pages/templates/ListCategory';
import Extra from './container/pages/templates/Extra';
import Forms from './container/pages/templates/Forms';
import Grid from './container/pages/templates/Grid';
import Maps from './container/pages/templates/Maps';
import ProductTable from './container/pages/templates/ProductTable';
import DiscountTables from './container/pages/templates/DiscountTable';
//
import ProtectedRoute from './container/Router/ProtectedRoute';
import LoginSystemPage from './container/Login/LoginSystemPage ';
import ForgotPasswordPage from './container/Login/ForgotPasswordPage';
import RegisterSystemPage from './container/Login/RegisterSystemPage';
function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path={path.HOME} element={<HomePage />} />
                <Route path={path.PRODUCTS} element={<ProductPage />} />
                <Route path={path.PRODUCT_DETAIL} element={<ProductDetailPage />} />
                <Route path={path.NEWS} element={<NewsPage />} />
                <Route path={path.NEWS_DETAIL} element={<NewsDetailPage />} />
                <Route path={path.CART} element={<CartPage />} />
                <Route path={path.PAY} element={<PayPage />} />
                <Route path={path.LOGIN} element={<LoginPage />} />
                <Route path={path.REGISTER} element={<RegistrationPage />} />
                <Route path={path.INTRO} element={<IntroPage />} />
                <Route path={path.CONTACT} element={<ContactPage />} />
                <Route path={path.WISHLIST} element={<ListLikePage />} />
                <Route path={path.ORDER_SUCCESS} element={<OrderSuccessPage />} />
                <Route path={path.ACCOUNT} element={<AccountManagementPage />} />
                <Route path={path.SYSTEM_LOGIN} element={<LoginSystemPage />} />
                <Route path={path.SYSTEM_FORGOT_LOGIN} element={<ForgotPasswordPage />} />
                <Route path={path.SYSTEM_REGISTER} element={<RegisterSystemPage />} />
                {/* <Route path="/system/forgot-password" element={<ForgotPasswordPage />} /> */}
                <Route path={path.SYSTEM} element={
                    <ProtectedRoute>
                        <AdminLayout />

                    </ProtectedRoute>

                }>

                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="ecommerce" element={<Ecommerce />} />
                    <Route path="user" element={<User />} />
                    <Route path="template-category" element={<ListCategory />} />
                    <Route path="template-extra" element={<Extra />} />
                    <Route path="template-forms" element={<Forms />} />
                    <Route path="template-grid" element={<Grid />} />
                    <Route path="template-maps" element={<Maps />} />
                    <Route path="template-product-tables" element={<ProductTable />} />
                    <Route path="template-discount" element={<DiscountTables />} />
                </Route>





                {/* 404 fallback */}
                <Route path="*" element={<div>404 | Page Not Found</div>} />
            </Routes>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover

            />
        </Router>

    );
}

export default App;
