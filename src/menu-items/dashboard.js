// assets
import {
    IconDashboard,
    IconBox,
    IconCategory,
    IconBuildingStore,
    IconTimeline,
    IconUsers,
    IconPackages,
    IconClipboardList
} from '@tabler/icons';

// constant
const icons = { IconDashboard, IconBox, IconCategory, IconBuildingStore, IconTimeline, IconUsers, IconPackages, IconClipboardList };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const getUserRole = () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    return user ? user.role : 'Sales';
};

const getDashboardItems = (role) => {
    const adminItems = [
        {
            id: 'default',
            title: 'Home',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'shops',
            title: 'Manage Shops',
            type: 'item',
            url: '/shops',
            icon: icons.IconBuildingStore,
            breadcrumbs: false
        },
        {
            id: 'category',
            title: 'Manage Categories',
            type: 'collapse',
            url: '/categories',
            icon: icons.IconCategory,
            breadcrumbs: false,
            children: [
                {
                    id: 'maincategory',
                    title: 'Main Category',
                    type: 'item',
                    url: '/categories',
                    breadcrumbs: false
                },
                {
                    id: 'subcategory',
                    title: 'Sub Category',
                    type: 'item',
                    url: '/sub-categories',
                    breadcrumbs: false
                },
                {
                    id: 'brands',
                    title: 'Brand',
                    type: 'item',
                    url: '/brands',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'products',
            title: 'Manage Products',
            type: 'item',
            url: '/products',
            icon: icons.IconBox,
            breadcrumbs: false
        },
        {
            id: 'stocks',
            title: 'Manage Stocks',
            type: 'collapse',
            url: '/stocks',
            icon: icons.IconClipboardList,
            breadcrumbs: false,
            children: [
                {
                    id: 'stocks',
                    title: 'Stocks',
                    type: 'item',
                    url: '/stocks',
                    breadcrumbs: false
                },
                {
                    id: 'tranfer-stock',
                    title: 'Stock Transfers',
                    type: 'item',
                    url: '/transfer-stock',
                    breadcrumbs: false
                },
                {
                    id: 'packages',
                    title: 'Packages',
                    type: 'item',
                    url: '/packages',
                    breadcrumbs: false
                }
            ]
        },

        {
            id: 'sales',
            title: 'Manage Sales',
            type: 'collapse',
            url: '/sales',
            icon: icons.IconTimeline,
            breadcrumbs: false,
            children: [
                {
                    id: 'sales',
                    title: 'Sales',
                    type: 'item',
                    url: '/sales',
                    breadcrumbs: false
                },
                {
                    id: 'solditems',
                    title: 'Sold Items',
                    type: 'item',
                    url: '/sold-items',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'customers',
            title: 'Manage Customers',
            type: 'item',
            url: '/customers',
            icon: icons.IconUsers,
            breadcrumbs: false
        }
    ];

    const salesItems = [
        {
            id: 'default',
            title: 'Home',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'stocks',
            title: 'Items',
            type: 'item',
            url: '/stocks',
            icon: icons.IconClipboardList,
            breadcrumbs: false
        },
        {
            id: 'sales',
            title: 'Sales',
            type: 'item',
            url: '/sales',
            icon: icons.IconTimeline,
            breadcrumbs: false
        },
        {
            id: 'customers',
            title: 'Customers',
            type: 'item',
            url: '/customers',
            icon: icons.IconUsers,
            breadcrumbs: false
        }
    ];

    return role === 'Admin' ? adminItems : salesItems;
};

const dashboard = {
    id: 'dashboard',
    type: 'group',
    children: getDashboardItems(getUserRole())
};

export default dashboard;
