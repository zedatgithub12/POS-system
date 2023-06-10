import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';

// import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register')));
const Forgot_Password = Loadable(lazy(() => import('views/password')));
const Reset_Password = Loadable(lazy(() => import('views/password/reset')));
const NotFound = Loadable(lazy(() => import('views/notFound')));
// password changing page
const ChangePassword = Loadable(lazy(() => import('views/pages/authentication/ChangePassword')));
// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: <AuthLogin />,
    children: [
        {
            path: '/pages/login/login',
            element: <AuthLogin />
        },
        {
            path: '/pages/register/register',
            element: <AuthRegister />
        },
        {
            path: '/password',
            element: <Forgot_Password />
        },
        {
            path: '/reset-password',
            element: <Reset_Password />
        },
        {
            path: 'pages/change-password',
            element: <ChangePassword />
        }
    ]
};

export default AuthenticationRoutes;
