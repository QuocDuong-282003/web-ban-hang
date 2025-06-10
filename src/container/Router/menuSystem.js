import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import BusinessIcon from '@mui/icons-material/Business'; // For Brand
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt'; // For Orders
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn'; // For Returns
import LocalOfferIcon from '@mui/icons-material/LocalOffer'; // For Voucher/Promotion
import FlashOnIcon from '@mui/icons-material/FlashOn'; // For Flash Sale
import BookIcon from '@mui/icons-material/Book'; // For Blog/Content
import RateReviewIcon from '@mui/icons-material/RateReview';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AssessmentIcon from '@mui/icons-material/Assessment'; // For Report


export const systemMenu = [
    {
        name: 'menu.admin.dashboard', // Added a specific Dashboard entry
        menus: [
            { name: 'menu.admin.dashboard', link: '/system/dashboard', icon: <DashboardIcon /> },
        ]
    },
    {
        name: 'menu.admin.manage-user',
        menus: [
            { name: 'menu.admin.crud', link: '/system/user-manage', icon: <PeopleIcon /> },
            { name: 'menu.admin.crud-redux', link: '/system/user-redux', icon: <PeopleIcon /> },
        ]
    },
    {
        name: 'menu.admin.product',
        menus: [
            { name: 'menu.admin.manage-product', link: '/system/manage-product', icon: <ShoppingCartIcon /> },
            { name: 'menu.admin.manage-category', link: '/system/manage-category', icon: <CategoryIcon /> },
            { name: 'menu.admin.manage-brand', link: '/system/manage-brand', icon: <BusinessIcon /> },
            { name: 'menu.admin.manage-inventory', link: '/system/manage-inventory', icon: <InventoryIcon /> },
        ]
    },
    {
        name: 'menu.admin.order',
        menus: [
            { name: 'menu.admin.manage-orders', link: '/system/manage-orders', icon: <ReceiptIcon /> },
            { name: 'menu.admin.manage-returns', link: '/system/manage-returns', icon: <AssignmentReturnIcon /> },
        ]
    },
    {
        name: 'menu.admin.promotion',
        menus: [
            { name: 'menu.admin.manage-voucher', link: '/system/manage-voucher', icon: <LocalOfferIcon /> },
            { name: 'menu.admin.manage-flash-sale', link: '/system/manage-flash-sale', icon: <FlashOnIcon /> },
        ]
    },
    {
        name: 'menu.admin.content',
        menus: [
            { name: 'menu.admin.manage-blog', link: '/system/manage-blog', icon: <BookIcon /> },
            { name: 'menu.admin.manage-review', link: '/system/manage-review', icon: <RateReviewIcon /> },
        ]
    },
    {
        name: 'menu.admin.analytics',
        menus: [
            { name: 'menu.admin.sales-report', link: '/system/sales-report', icon: <AnalyticsIcon /> },
            { name: 'menu.admin.user-report', link: '/system/user-report', icon: <AssessmentIcon /> },
        ]
    }
];