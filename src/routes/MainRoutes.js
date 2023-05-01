import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Sales from 'views/sales';
import CreateSale from 'views/sales/createSale';
import UpdateSale from 'views/sales/updateSale';
import ViewSale from 'views/sales/viewSale';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
// Shop routing
const Shops = Loadable(lazy(() => import('views/shop')));
const CreateShop = Loadable(lazy(() => import('views/shop/createShop')));
const ViewShop = Loadable(lazy(() => import('views/shop/viewShop')));
const UpdateShop = Loadable(lazy(() => import('views/shop/updateShop')));
// Product routing
const Products = Loadable(lazy(() => import('views/products')));
const AddProduct = Loadable(lazy(() => import('views/products/addProduct')));
const UpdateProduct = Loadable(lazy(() => import('views/products/updateProduct')));
// Category routing
const Category = Loadable(lazy(() => import('views/category')));
// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-typography',
                    element: <UtilsTypography />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-color',
                    element: <UtilsColor />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-shadow',
                    element: <UtilsShadow />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'tabler-icons',
                    element: <UtilsTablerIcons />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'material-icons',
                    element: <UtilsMaterialIcons />
                }
            ]
        },
        {
            path: 'sample-page',
            element: <SamplePage />
        },
        {
            path: 'shops',
            element: <Shops />
        },
        {
            path: 'create-shop',
            element: <CreateShop />
        },
        {
            path: 'view-shop',
            element: <ViewShop />
        },
        {
            path: 'update-shop',
            element: <UpdateShop />
        },
        {
            path: 'products',
            element: <Products />
        },
        {
            path: 'add-product',
            element: <AddProduct />
        },
        {
            path: 'update-product',
            element: <UpdateProduct />
        },
        {
            path: 'categories',
            element: <Category />
        },
        {
            path: 'sales',
            element: <Sales />
        },
        {
            path: 'create-sale',
            element: <CreateSale />
        },
        {
            path: 'update-sale',
            element: <UpdateSale />
        },
        {
            path: 'view-sale',
            element: <ViewSale />
        }
    ]
};

export default MainRoutes;
