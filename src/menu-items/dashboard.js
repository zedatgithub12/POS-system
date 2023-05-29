// assets
import { IconDashboard, IconBox, IconCategory, IconBuildingStore, IconTimeline, IconUsers } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconBox, IconCategory, IconBuildingStore, IconTimeline, IconUsers };

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
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'shops',
            title: 'Shops',
            type: 'item',
            url: '/shops',
            icon: icons.IconBuildingStore,
            breadcrumbs: false
        },
        {
            id: 'stocks',
            title: 'Stocks',
            type: 'item',
            url: '/products',
            icon: icons.IconBox,
            breadcrumbs: false
        },
        {
            id: 'category',
            title: 'Category',
            type: 'item',
            url: '/categories',
            icon: icons.IconCategory,
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

    const salesItems = [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'stocks',
            title: 'Stocks',
            type: 'item',
            url: '/products',
            icon: icons.IconBox,
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
    title: 'Dashboard',
    type: 'group',
    children: getDashboardItems(getUserRole())
};

export default dashboard;
