import {
    Grid,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TextField,
    InputAdornment,
    Menu,
    MenuItem,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Collapse,
    FormControl,
    FormControlLabel,
    Checkbox,
    Select,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconX } from '@tabler/icons';
import { useState } from 'react';

export const DialogBox = ({ title, openDialog, handleDialogClose, children }) => {
    const theme = useTheme();

    return (
        <Dialog open={openDialog} onClose={handleDialogClose}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: theme.palette.primary.main
                }}
            >
                <DialogTitle sx={{ fontSize: theme.typography.h4, color: theme.palette.background.default }}>
                    {title ? title : ''}
                </DialogTitle>

                <IconButton variant="text" color="dark" onClick={handleDialogClose} sx={{ marginRight: 1 }}>
                    <IconX />
                </IconButton>
            </Box>

            <Divider />
            <DialogContent>{children}</DialogContent>
        </Dialog>
    );
};
