import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from './redux/sidebarSlice';

const AdminLayout = () => {
    const dispatch = useDispatch();
    const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);

    const handleToggleSidebar = () => {
        dispatch(toggleSidebar());
    };

    return (
        <div style={{ display: 'flex' }}>
            <Header onToggleSidebar={handleToggleSidebar} />
            <Sidebar isOpen={isSidebarOpen} />
            <main
                style={{
                    flexGrow: 1,
                    padding: '90px 20px 20px',
                    marginLeft: isSidebarOpen ? 100 : 70,
                    transition: 'margin 0.3s ease',
                }}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
