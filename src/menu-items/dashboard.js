// assets
import { IconDashboard, IconBrandChrome, IconBox, IconCategory, IconBuildingStore, IconTimeline, IconUsers } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconBrandChrome, IconBox, IconCategory, IconBuildingStore, IconTimeline, IconUsers };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
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
            id: 'products',
            title: 'Products',
            type: 'item',
            url: '/products',
            icon: icons.IconBox,
            breadcrumbs: false
        },
        {
            id: 'category',
            title: 'Category',
            type: 'item',
            url: '/sample-page',
            icon: icons.IconCategory,
            breadcrumbs: false
        },
        {
            id: 'sales',
            title: 'Sales',
            type: 'item',
            url: '/sample-page',
            icon: icons.IconTimeline,
            breadcrumbs: false
        },
        {
            id: 'customers',
            title: 'Customers',
            type: 'item',
            url: '/sample-page',
            icon: icons.IconUsers,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
