// assets
import { IconUser } from '@tabler/icons';

// constant
const icons = { IconUser };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const Users = {
    id: 'users',
    type: 'group',
    children: [
        {
            id: 'users',
            title: 'Users',
            type: 'item',
            url: '/users',
            icon: icons.IconUser,
            breadcrumbs: false
        }
    ]
};

export default Users;
