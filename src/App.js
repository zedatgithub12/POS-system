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
    const [login, setLogin] = useState(true);
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
                    sessionStorage.setItem('token', JSON.stringify(users.fname));

                    setLoged(true);
                } else {
                    setLoged(false);
                }
            },

            SignOut: async (status) => {
                if (status === 'Signout') {
                    sessionStorage.clear();

                    setLoged(false);
                }
                {
                    setLoged(false);
                }
            },

            getToken: async () => {
                const tokenString = sessionStorage.getItem('token');
                const userToken = JSON.parse(tokenString);
                return userToken;
            },

            getUser: async () => {
                const userString = sessionStorage.getItem('user');
                const userDetails = JSON.parse(userString);
                return userDetails;
            }
        }),
        []
    );
    return (
        <StyledEngineProvider injectFirst>
            <AuthContext.Provider value={authContext}>
                <ThemeProvider theme={themes(customization)}>
                    <CssBaseline />
                    <NavigationScroll>
                        {login ? <Routes /> : location.pathname === '/pages/register/register' ? <AuthRegister /> : <AuthLogin />}
                    </NavigationScroll>
                </ThemeProvider>
            </AuthContext.Provider>
        </StyledEngineProvider>
    );
};

export default App;
