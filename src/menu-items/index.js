import dashboard from './dashboard';
// import pages from './pages';
// import utilities from './utilities';
// import other from './other';
import Users from './users';

// ==============================|| MENU ITEMS ||============================== //
const userString = sessionStorage.getItem('user');
const user = JSON.parse(userString);

const menuItems =
    user.role === 'Admin'
        ? {
              items: [dashboard, Users]
          }
        : {
              items: [dashboard]
          };

export default menuItems;
