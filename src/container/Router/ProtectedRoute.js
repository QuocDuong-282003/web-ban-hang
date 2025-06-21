import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const { isAdminAuthenticated } = useSelector((state) => state.adminAuth);
    const location = useLocation();

    if (!isAdminAuthenticated) {
        // Nếu chưa đăng nhập, chuyển hướng về trang login của admin
        return <Navigate to="/system/login" state={{ from: location }} replace />;
    }

    // Nếu đã đăng nhập, cho phép truy cập
    return children;
};

export default ProtectedRoute;
