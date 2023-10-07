import { CircularProgress } from '@mui/material';
import React from 'react';

export const ActivityIndicators = ({ size }) => <CircularProgress size={size ? size : 24} />;
