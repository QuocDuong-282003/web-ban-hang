// //  Sidebar tổng hợp các mục
// import React from 'react';
// import { Drawer, List, Typography, Divider } from '@mui/material';
// // import SidebarItem from '../redux/sidebarSlice'; // Đây là lỗi, sidebarSlice không phải component
// import SidebarItem from './SidebarItem'; // Sửa: Giả sử SidebarItem.js cùng cấp hoặc trong thư mục con hợp lý
// import { path } from '../../components/utils/constant'; // Đường dẫn đến constant.js

// import {
//     AccountCircle, Dashboard as DashboardIcon, ShoppingCart, Person, InsertDriveFile, // Đổi tên Dashboard thành DashboardIcon để tránh xung đột
//     ViewModule, TableChart, Widgets, Description,
//     BarChart, ViewComfy, Map, Star
// } from '@mui/icons-material';

// const drawerWidth = 260;

// const Sidebar = () => {
//     return (
//         <Drawer
//             variant="permanent"
//             sx={{
//                 width: drawerWidth,
//                 flexShrink: 0,
//                 [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
//             }}
//         >
//             <List>
//                 {/* Sử dụng hằng số path cho prop 'to' */}
//                 <SidebarItem label="Profile" icon={<AccountCircle />} to={path.ADMIN_PROFILE} />
//                 <SidebarItem label="Dashboard" icon={<DashboardIcon />} chipLabel="Admin" to={path.DASHBOARD} />
//                 <SidebarItem label="E-commerce" icon={<ShoppingCart />} to={path.ADMIN_ECOMMERCE_OVERVIEW} />
//                 <SidebarItem label="User" icon={<Person />} chipLabel="New" to={path.ADMIN_USER_OVERVIEW} />
//                 {/* <SidebarItem label="Documentation" icon={<InsertDriveFile />} to="/some-documentation-path" />  */}
//                 {/* Ví dụ: bạn cần thêm path cho Documentation nếu muốn nó điều hướng */}
//             </List>
//             <Divider />
//             <Typography variant="caption" sx={{ pl: 2, pt: 1 }}>
//                 TEMPLATE
//             </Typography>
//             <List>
//                 {/* Các mục template này cũng cần prop 'to' nếu chúng là các trang có thể điều hướng */}
//                 <SidebarItem label="Core" icon={<ViewModule />} to={path.TEMPLATE_CORE} />
//                 <SidebarItem label="Tables" icon={<TableChart />} to={path.TEMPLATE_TABLES} />
//                 <SidebarItem label="UI Elements" icon={<Widgets />} to={path.TEMPLATE_UI_ELEMENTS} />
//                 <SidebarItem label="Forms" icon={<Description />} to={path.TEMPLATE_FORMS} />
//                 <SidebarItem label="Charts" icon={<BarChart />} to={path.TEMPLATE_CHARTS} />
//                 <SidebarItem label="Grid" icon={<ViewComfy />} to={path.TEMPLATE_GRID} />
//                 <SidebarItem label="Maps" icon={<Map />} to={path.TEMPLATE_MAPS} />
//                 <SidebarItem label="Extra" icon={<Star />} to={path.TEMPLATE_EXTRA} />
//             </List>
//         </Drawer>
//     );
// };

// export default Sidebar;
// Sidebar.js
import React from 'react';
import {
    Drawer,
    List,
    Typography,
    Divider,
    Box,
    Toolbar,
    Tooltip, // Added Tooltip
} from '@mui/material';
import SidebarItem from './SidebarItem'; // Assuming SidebarItem handles isOpen for its label
import { path } from '../../components/utils/constant'; // Adjust path as needed

// Import MUI Icons
import {
    AccountCircle,
    Dashboard as DashboardIcon,
    ShoppingCart,
    Person,
    // InsertDriveFile, // If you add Documentation
    ViewModule,
    TableChart,
    Widgets,
    Description,
    BarChart,
    ViewComfy,
    Map,
    Star,
} from '@mui/icons-material';

const drawerFullWidth = 260;
const drawerCollapsedWidth = 70; // Or your preferred collapsed width

const Sidebar = ({ isOpen }) => { // Receive isOpen as a prop

    // Helper function to render items with tooltip for collapsed state
    const renderSidebarItem = (label, icon, to, chipLabel = null) => (
        <Tooltip title={!isOpen ? label : ''} placement="right" arrow>
            {/* The div wrapper is important for Tooltip to work correctly with disabled/custom components if SidebarItem does that */}
            <div>
                <SidebarItem
                    label={label}
                    icon={icon}
                    to={to}
                    chipLabel={chipLabel}
                    isOpen={isOpen} // Pass isOpen to SidebarItem
                />
            </div>
        </Tooltip>
    );

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: isOpen ? drawerFullWidth : drawerCollapsedWidth,
                flexShrink: 0,
                transition: (theme) => theme.transitions.create('width', { // Smooth transition for drawer width
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                '& .MuiDrawer-paper': {
                    width: isOpen ? drawerFullWidth : drawerCollapsedWidth,
                    boxSizing: 'border-box',
                    overflowX: 'hidden', // Hide horizontal scrollbar and content when collapsed
                    whiteSpace: 'nowrap', // Prevent text wrapping when collapsing
                    transition: (theme) => theme.transitions.create('width', { // Smooth transition for paper width
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                },
            }}
        >
            {/* Toolbar spacer if using a fixed AppBar */}
            <Toolbar />

            <Box
                sx={{
                    height: 'calc(100vh - 64px)', // Assuming 64px AppBar height
                    overflowY: 'auto',
                    overflowX: 'hidden', // Ensure no horizontal scroll in the content box either
                    '&::-webkit-scrollbar': {
                        width: isOpen ? 6 : 0, // Hide scrollbar when collapsed
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#c1c1c1',
                        borderRadius: 3,
                    },
                }}
            >
                {/* <List>
                    {renderSidebarItem('Profile', <AccountCircle />, path.ADMIN_PROFILE)}
                    {renderSidebarItem('Dashboard', <DashboardIcon />, path.DASHBOARD, 'Admin')}
                    {renderSidebarItem('E-commerce', <ShoppingCart />, path.MANAGE_PRODUCTS)}
                    {renderSidebarItem('User', <Person />, path.MANAGE_USERS, 'New')}
                    {/* {renderSidebarItem('Documentation', <InsertDriveFile />, '/docs')} 
                </List> */}
                <List>
                    {/* Sử dụng hằng số path cho prop 'to' */}
                    <SidebarItem label="Profile" icon={<AccountCircle />} to={path.ADMIN_PROFILE} />
                    <SidebarItem label="Dashboard" icon={<DashboardIcon />} chipLabel="Admin" to={path.DASHBOARD} />
                    <SidebarItem label="Order-Table" icon={<ShoppingCart />} to={path.ADMIN_ORDER_TABLE_OVERVIEW} />
                    <SidebarItem label="User" icon={<Person />} chipLabel="New" to={path.ADMIN_USER_OVERVIEW} />
                    {/* <SidebarItem label="Documentation" icon={<InsertDriveFile />} to="/some-documentation-path" />  */}
                    {/* Ví dụ: bạn cần thêm path cho Documentation nếu muốn nó điều hướng */}
                </List>
                <Divider />

                {/* Conditionally render "TEMPLATE" text only when sidebar is open */}
                {isOpen && (
                    <Typography
                        variant="caption"
                        sx={{
                            pl: 2.5, // Adjust padding to align with icons/text
                            pt: 1,
                            pb: 1,
                            display: 'block', // Ensure it takes block space
                            color: 'text.secondary',
                            fontWeight: 'medium',
                        }}
                    >
                        TEMPLATE
                    </Typography>
                )}
                {/* Add a smaller visual break if not open */}
                {!isOpen && <Box sx={{ height: '20px' }} />}


                {/* <List>
                    {renderSidebarItem('Core', <ViewModule />, path.TEMPLATE_CORE)}
                    {renderSidebarItem('Tables', <TableChart />, path.TEMPLATE_TABLES)}
                    {renderSidebarItem('UI Elements', <Widgets />, path.TEMPLATE_UI_ELEMENTS)}
                    {renderSidebarItem('Forms', <Description />, path.TEMPLATE_FORMS)}
                    {renderSidebarItem('Charts', <BarChart />, path.TEMPLATE_CHARTS)}
                    {renderSidebarItem('Grid', <ViewComfy />, path.TEMPLATE_GRID)}
                    {renderSidebarItem('Maps', <Map />, path.TEMPLATE_MAPS)}
                    {renderSidebarItem('Extra', <Star />, path.TEMPLATE_EXTRA)}
                </List> */}
                <List>
                    {/* Các mục template này cũng cần prop 'to' nếu chúng là các trang có thể điều hướng */}
                    <SidebarItem label="ListCategory" icon={<ViewModule />} to={path.TEMPLATE_CATEGORY} />
                    <SidebarItem label="ProductTables" icon={<TableChart />} to={path.TEMPLATE_TABLES} />
                    <SidebarItem label="DiscountTables" icon={<Widgets />} to={path.TEMPLATE_DISCOUNT} />
                    <SidebarItem label="Reviews" icon={<Description />} to={path.TEMPLATE_FORMS} />
                    <SidebarItem label="News" icon={<BarChart />} to={path.TEMPLATE_NEWS} />
                    <SidebarItem label="Grid" icon={<ViewComfy />} to={path.TEMPLATE_GRID} />
                    <SidebarItem label="Maps" icon={<Map />} to={path.TEMPLATE_MAPS} />
                    <SidebarItem label="Extra" icon={<Star />} to={path.TEMPLATE_EXTRA} />
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;