import { lazy, useState } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { useLocation } from 'react-router-dom';
// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import { AuthContext } from 'context/context';
import { useEffect } from 'react';
import { useMemo } from 'react';

// ==============================|| APP ||============================== //
import Loadable from 'ui-component/Loadable';
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register')));

const App = () => {
    const customization = useSelector((state) => state.customization);
    const location = useLocation();

    const [user, setUser] = useState({
        id: '',
        name: '',
        email: '',
        profile: '',
        role: '',
        store_id: '',
        store_name: ''
    });
    const [login, setLogin] = useState(false);
    useEffect(() => {
        var tokens = sessionStorage.getItem('token');
        if (tokens !== null) {
            setLogin(true);
        }
        return () => {};
    }, [login]);

    const authContext = useMemo(
        () => ({
            SignIn: async (status, users) => {
                if (status === 'Signed') {
                    sessionStorage.setItem('user', JSON.stringify(users));
                    sessionStorage.setItem('token', JSON.stringify(users.name));
                    setUser({
                        ...user,
                        id: users.id,
                        name: users.name,
                        email: users.email,
                        profile: users.profile,
                        role: users.role,
                        store_id: users.store_id,
                        store_name: users.store_name
                    });

                    setLogin(true);
                    window.location.reload(false); //refresh the page when user login
                } else {
                    setLogin(false);
                }
            },

            SignOut: async (status) => {
                if (status === 'Signout') {
                    sessionStorage.clear();
                    setUser({
                        ...user,
                        name: '',
                        email: '',
                        profile: '',
                        role: ''
                    });

                    setLogin(false);
                }
                {
                    setLogin(false);
                }
            },

            getToken: async () => {
                const tokenString = sessionStorage.getItem('token');
                const userToken = JSON.parse(tokenString);
                return userToken;
            },

            getUser: user
        }),

        [user]
    );
    return (
        <AuthContext.Provider value={authContext}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={themes(customization)}>
                    <CssBaseline />
                    <NavigationScroll>
                        {login ? <Routes /> : location.pathname === '/pages/register/register' ? <AuthRegister /> : <AuthLogin />}
                    </NavigationScroll>
                </ThemeProvider>
            </StyledEngineProvider>
        </AuthContext.Provider>
    );
};

export default App;
