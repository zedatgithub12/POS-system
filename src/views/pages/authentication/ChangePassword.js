import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <TextField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
            />
            <TextField label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <Button type="submit">Change Password</Button>
        </form>
    );
};

export default ChangePassword;
