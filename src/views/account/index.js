// material-ui
import { Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const Account = () => (
    <MainCard title="Your Profile">
        <Typography variant="body2">Everything related to your profile will be available here!</Typography>
    </MainCard>
);

export default Account;
