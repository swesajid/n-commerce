import { FC, useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Box, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { authContext } from '../../contexts/auth.context';
import Link from 'next/link';

export const drawerWidth = 300;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

interface iProps {
    open: boolean;
    onDrawerOpen: () => void;
}

const settings = ['Profile', 'Account', 'Dashboard'];
const colors = ['crimson', 'dodgerblue', 'teal', 'purple', 'green'];

const Header: FC<iProps> = ({ open, onDrawerOpen }) => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [color, setColor] = useState('crimson');
    const router = useRouter();
    const userInfo = useContext(authContext);

    useEffect(() => {
        setColor(colors[Math.floor(Math.random() * colors.length)]);
    }, []);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = () => {
        localStorage.removeItem('skon-auth-token');
        handleCloseUserMenu();
        router.push('/auth/login');
    };

    return (
        <AppBar position="fixed" open={open} color="inherit">
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={onDrawerOpen}
                    edge="start"
                    sx={{ mr: 2, ...(open && { display: 'none' }) }}
                >
                    <MenuIcon color="primary" />
                </IconButton>
                {!open && (
                    <Link href="/">
                        <a>
                            <img src="/logo.png" width={250} height={60} />
                        </a>
                    </Link>
                )}
                <Box flexGrow={1}></Box>
                <Box sx={{ flexGrow: 0 }}>
                    <Typography component="span">Welcome, {userInfo?.user?.name} &nbsp;</Typography>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar sx={{ bgcolor: color }}>{userInfo?.user?.name[0].toUpperCase()}</Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                <Typography textAlign="center">{setting}</Typography>
                            </MenuItem>
                        ))}
                        <MenuItem onClick={logout}>
                            <Typography textAlign="center">Logout</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
