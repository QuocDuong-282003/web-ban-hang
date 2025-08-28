export const path = {
    // PUBLIC / USER
    HOME: '/',
    LOGIN: '/login',
    LOGIN_OUT: '/login-out',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/product-detail/:productId',
    NEWS: '/news',
    NEWS_DETAIL: '/news-detail/:slug',
    CART: '/cart',
    PAY: '/pay',

    REGISTER: '/register',
    INTRO: '/intro',
    CONTACT: '/contact',
    WISHLIST: '/wishlist',
    ORDER_SUCCESS: '/order-success',
    ACCOUNT: '/account',
    ORDER_TRACKING: '/order-tracking/:orderId',
    //
    POLICY: '/chinh-sach/:slug',

    // ADMIN SYSTEM BASE
    SYSTEM: '/system',
    SYSTEM_LOGIN: '/system/login',
    //  DASHBOARD
    DASHBOARD: '/system/dashboard',

    SYSTEM_LOGIN_OUT: '/system/login-out',
    SYSTEM_FORGOT_LOGIN: '/system/forgot-password',
    SYSTEM_REGISTER: '/system/register',
    //  USER MANAGEMENT & PROFILE
    ADMIN_PROFILE: '/system/profile',
    ADMIN_USER_OVERVIEW: '/system/user',
    MANAGE_USERS: '/system/manage-users',
    CRUD_USER: '/system/user-manage',
    CRUD_USER_REDUX: '/system/user-redux',


    //  E-COMMERCE
    ADMIN_ORDER_TABLE_OVERVIEW: '/system/order-table',
    MANAGE_PRODUCTS: '/system/manage-products',
    CREATE_PRODUCT: '/system/create-product',
    EDIT_PRODUCT: '/system/edit-product/:productId',

    MANAGE_CATEGORIES: '/system/manage-category',
    MANAGE_BRANDS: '/system/manage-brand',
    MANAGE_INVENTORY: '/system/manage-inventory',

    MANAGE_ORDERS: '/system/manage-orders',
    ORDER_DETAIL: '/system/order-detail/:orderId',
    MANAGE_RETURNS: '/system/manage-returns',

    MANAGE_VOUCHER: '/system/manage-voucher',
    MANAGE_FLASH_SALE: '/system/manage-flash-sale',

    //  CONTENT MANAGEMENT
    MANAGE_BLOG: '/system/manage-blog',
    MANAGE_REVIEW_CONTENT: '/system/manage-review',

    //  REPORTING
    SALES_REPORT: '/system/sales-report',
    USER_REPORT: '/system/user-report',

    //  SYSTEM SETTINGS
    SETTINGS: '/system/settings',

    //  TEMPLATE / DEV UTILS
    TEMPLATE_CATEGORY: '/system/template-category',
    TEMPLATE_TABLES: '/system/template-product-tables',
    TEMPLATE_DISCOUNT: '/system/template-discount',
    TEMPLATE_FORMS: '/system/template-forms',
    TEMPLATE_NEWS: '/system/template-news',
    TEMPLATE_CONTACT: '/system/template-contact',
    TEMPLATE_MAPS: '/system/template-maps',
    TEMPLATE_EXTRA: '/system/template-extra',
};