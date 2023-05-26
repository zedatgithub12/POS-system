import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
// import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register')));
const Forgot_Password = Loadable(lazy(() => import('views/password')));
const Reset_Password = Loadable(lazy(() => import('views/password/reset')));
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
            path: '/reset-password/:token',
            element: <Reset_Password />
        }
    ]
};

export default AuthenticationRoutes;
