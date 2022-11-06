import { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import {
    Accordion as MuiAccordion,
    AccordionDetails,
    AccordionProps,
    AccordionSummary,
    Box,
    Button,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Theme,
    Typography,
    useMediaQuery,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ChartBar as ChartBarIcon } from '../icons/chart-bar';
import { Cog as CogIcon } from '../icons/cog';
import { Lock as LockIcon } from '../icons/lock';
import { Selector as SelectorIcon } from '../icons/selector';
import { ShoppingBag as ShoppingBagIcon } from '../icons/shopping-bag';
import { User as UserIcon } from '../icons/user';
import { UserAdd as UserAddIcon } from '../icons/user-add';
import { Users as UsersIcon } from '../icons/users';
import { XCircle as XCircleIcon } from '../icons/x-circle';
import { Logo } from './logo';
import { NavItem } from './nav-item';
import { KeyboardArrowRight, AccountCircle } from '@mui/icons-material';
import styled from '@emotion/styled';
import { sidebarLinks } from '../../seeds/sidebar.seed';

const items = [
    {
        href: '/',
        icon: <ChartBarIcon fontSize="small" />,
        title: 'Dashboard',
    },
    {
        href: '/customers',
        icon: <UsersIcon fontSize="small" />,
        title: 'Customers',
    },
    {
        href: '/products',
        icon: <ShoppingBagIcon fontSize="small" />,
        title: 'Products',
    },
    {
        href: '/account',
        icon: <UserIcon fontSize="small" />,
        title: 'Account',
    },
    {
        href: '/settings',
        icon: <CogIcon fontSize="small" />,
        title: 'Settings',
    },
    {
        href: '/auth/login',
        icon: <LockIcon fontSize="small" />,
        title: 'Login',
    },
    {
        href: '/auth/register',
        icon: <UserAddIcon fontSize="small" />,
        title: 'Register',
    },
    {
        href: '/404',
        icon: <XCircleIcon fontSize="small" />,
        title: 'Error',
    },
];

export const DashboardSidebar = (props: any) => {
    const { open, onClose } = props;
    const router = useRouter();
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'), {
        defaultMatches: true,
        noSsr: false,
    });
    const active = false;

    useEffect(
        () => {
            if (!router.isReady) {
                return;
            }

            if (open) {
                onClose?.();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router.asPath]
    );

    const content = (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                }}
            >
                <div>
                    <Box sx={{ p: 3 }}>
                        <NextLink href="/" passHref>
                            <a>
                                {/* <Logo
                                    sx={{
                                        height: 42,
                                        width: 42,
                                    }}
                                /> */}
                                <img src="/main-logo.png" width={200} />
                            </a>
                        </NextLink>
                    </Box>
                    {/* <Box sx={{ px: 2 }}>
                        <Box
                            sx={{
                                alignItems: "center",
                                backgroundColor: "rgba(255, 255, 255, 0.04)",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "space-between",
                                px: 3,
                                py: "11px",
                                borderRadius: 1,
                            }}
                        >
                            <div>
                                <Typography color="inherit" variant="subtitle1">
                                    Acme Inc
                                </Typography>
                                <Typography color="neutral.400" variant="body2">
                                    Your tier : Premium
                                </Typography>
                            </div>
                            <SelectorIcon
                                sx={{
                                    color: "neutral.500",
                                    width: 14,
                                    height: 14,
                                }}
                            />
                        </Box>
                    </Box> */}
                </div>
                <Divider
                    sx={{
                        borderColor: '#2D3748',
                        marginBottom: '1rem',
                    }}
                />
                {/* <Box sx={{ flexGrow: 1 }}>
                    {items.map((item) => (
                        <NavItem
                            key={item.title}
                            icon={item.icon}
                            href={item.href}
                            title={item.title}
                        />
                    ))}
                </Box> */}

                <Box sx={{ px: 3 }}>
                    {sidebarLinks.map((sidebarItem, index) => (
                        <Accordion
                            key={index}
                            disableGutters
                            square
                            elevation={0}
                            sx={{
                                backgroundColor: active ? 'rgba(255,255,255, 0.08)' : 'transparent',
                                borderRadius: 1,
                                width: '100%',
                                color: active ? '#10B981' : '#D1D5DB',
                                justifyContent: 'flex-start',
                                //px: 3,
                                '& .MuiButton-startIcon': {
                                    color: active ? '#10B981' : '#9CA3AF',
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255, 0.08)',
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<KeyboardArrowRight />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                sx={{
                                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                                        transform: 'rotate(90deg)',
                                    },
                                }}
                            >
                                <sidebarItem.icon sx={{ marginRight: '1rem' }} />
                                <Typography>{sidebarItem.text}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    {sidebarItem.links.map((linkInfo, i) => (
                                        <ListItem
                                            disableGutters
                                            button
                                            key={i}
                                            onClick={() => router.push(linkInfo.link)}
                                            sx={{
                                                px: 2,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255, 0.08)',
                                                },
                                                borderRadius: 2,
                                            }}
                                        >
                                            {/* <ListItemIcon>
                                            <link.icon></link.icon>
                                        </ListItemIcon> */}
                                            <ListItemText primary={linkInfo.text} />
                                        </ListItem>
                                    ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Box>
        </>
    );

    if (lgUp) {
        return (
            <Drawer
                anchor="left"
                open
                PaperProps={{
                    sx: {
                        backgroundColor: '#111827',
                        color: '#FFFFFF',
                        width: 280,
                    },
                }}
                variant="permanent"
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor="left"
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    backgroundColor: '#111827',
                    color: '#FFFFFF',
                    width: 280,
                },
            }}
            sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
            variant="temporary"
        >
            {content}
        </Drawer>
    );
};

// DashboardSidebar.propTypes = {
//   onClose: PropTypes.func,
//   open: PropTypes.bool
// };

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
    ({ theme }) => ({
        //border: `1px solid ${theme.palette.divider}`,
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
    })
);
