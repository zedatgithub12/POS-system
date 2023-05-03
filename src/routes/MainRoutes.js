import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

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
//sales routing
const Sales = Loadable(lazy(() => import('views/sales')));
const CreateSale = Loadable(lazy(() => import('views/sales/createSale')));
const UpdateSale = Loadable(lazy(() => import('views/sales/updateSale')));
const ViewSale = Loadable(lazy(() => import('views/sales/viewSale')));
//Customers Routing
const Customers = Loadable(lazy(() => import('views/customers')));
const AddCustomer = Loadable(lazy(() => import('views/customers/addCustomer')));
const ViewCustomer = Loadable(lazy(() => import('views/customers/viewCustomer')));
const UpdateCustomer = Loadable(lazy(() => import('views/customers/updateCustomer')));
//User Routing
const Users = Loadable(lazy(() => import('views/users')));
const AddUsers = Loadable(lazy(() => import('views/users/addUser')));
const ViewUsers = Loadable(lazy(() => import('views/users/viewUser')));
const UpdateUsers = Loadable(lazy(() => import('views/users/updateUser')));
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
        },
        {
            path: 'customers',
            element: <Customers />
        },
        {
            path: 'add-customer',
            element: <AddCustomer />
        },
        {
            path: 'view-customer',
            element: <ViewCustomer />
        },
        {
            path: 'update-customer',
            element: <UpdateCustomer />
        },
        {
            path: 'users',
            element: <Users />
        },
        {
            path: 'add-user',
            element: <AddUsers />
        },
        {
            path: 'view-user',
            element: <ViewUsers />
        },
        {
            path: 'Update-user',
            element: <UpdateUsers />
        }
    ]
};

export default MainRoutes;
