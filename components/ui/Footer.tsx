import * as React from 'react';
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AppBar } from '@mui/material';

export default function Footer() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="fixed"
                sx={{
                    top: 'auto',
                    bottom: 0,
                }}
                color="inherit"
            >
                <Toolbar>
                    <Typography variant="body2" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        &copy; All Rights reserved
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
