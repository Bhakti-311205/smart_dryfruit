import React from 'react';
import { Box } from '@mui/material';

const Logo = ({ sx }) => {
    return (
        <Box
            component="img"
            src="/logo.png"
            alt="NutHub Logo"
            sx={{
                height: { xs: 32, sm: 40 },
                width: 'auto',
                objectFit: 'contain',
                ...sx
            }}
        />
    );
};

export default Logo;
