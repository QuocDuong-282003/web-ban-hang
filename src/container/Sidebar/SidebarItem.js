// // 🧩 Component riêng cho từng item sidebar
// import React from 'react';
// import { ListItemButton, ListItemIcon, ListItemText, Chip } from '@mui/material';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom'; // Thêm useNavigate
// import { setActiveItem } from '../redux/sidebarSlice'; // Giả sử đường dẫn này đúng dựa trên cấu trúc dự án của bạn

// const SidebarItem = ({ label, icon, chipLabel, to }) => { // Thêm prop 'to'
//     const dispatch = useDispatch();
//     const navigate = useNavigate(); // Khởi tạo navigate
//     const active = useSelector((state) => state.sidebar.activeItem === label);

//     const handleClick = () => {
//         dispatch(setActiveItem(label));
//         if (to) { // Kiểm tra nếu 'to' được cung cấp
//             navigate(to); // Thực hiện điều hướng
//         }
//     };

//     return (
//         <ListItemButton selected={active} onClick={handleClick}>
//             <ListItemIcon>{icon}</ListItemIcon>
//             <ListItemText primary={label} />
//             {chipLabel && <Chip label={chipLabel} color="success" size="small" />}
//         </ListItemButton>
//     );
// };

// export default SidebarItem;
// import React from 'react';
// import { ListItemButton, ListItemIcon, ListItemText, Chip } from '@mui/material';
// import { useDispatch, useSelector } from 'react-redux';
// import { setActiveItem } from '../redux/sidebarSlice';
// import { NavLink } from 'react-router-dom';

// const SidebarItem = ({ label, icon, chipLabel, to }) => {
//     const dispatch = useDispatch();
//     const active = useSelector((state) => state.sidebar.activeItem === label);

//     const handleClick = () => {
//         dispatch(setActiveItem(label));
//     };

//     return (
//         <ListItemButton
//             component={NavLink}
//             to={to}
//             selected={active}
//             onClick={handleClick}
//             sx={{
//                 '&.active': {
//                     backgroundColor: '#e0e0e0',
//                 },
//             }}
//         >
//             <ListItemIcon>{icon}</ListItemIcon>
//             <ListItemText primary={label} />
//             {chipLabel && (
//                 <Chip
//                     label={chipLabel}
//                     color={chipLabel === 'New' ? 'error' : 'secondary'}
//                     size="small"
//                 />
//             )}
//         </ListItemButton>
//     );
// };

// export default SidebarItem;



import React from 'react';
import { ListItemButton, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveItem } from '../redux/sidebarSlice';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ label, icon, chipLabel, to }) => {
    const dispatch = useDispatch();
    const active = useSelector((state) => state.sidebar.activeItem === label);

    const handleClick = () => {
        dispatch(setActiveItem(label));
    };

    return (
        <ListItemButton
            component={NavLink}
            to={to}
            selected={active}
            onClick={handleClick}
            sx={{
                '&.active': {
                    backgroundColor: '#e0e0e0',
                },
            }}
        >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
            {chipLabel && (
                <Chip
                    label={chipLabel}
                    color={chipLabel === 'New' ? 'error' : 'secondary'}
                    size="small"
                />
            )}
        </ListItemButton>
    );
};

export default SidebarItem;