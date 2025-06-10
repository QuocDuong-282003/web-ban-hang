import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = ({ onToggleSidebar }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/system/login');
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: 1201 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box display="flex" alignItems="center">
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={onToggleSidebar}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Admin Control Panel
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="body1">
                        👤 {user?.name || 'No user'}
                    </Typography>
                    <Button variant="outlined" color="inherit" onClick={handleLogout}>
                        🔓 Logout
                    </Button>


                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
