import { Box, Button, ListItem } from '@mui/material';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { KeyboardArrowRight } from '@mui/icons-material';

export const NavItem = (props: any) => {
    const { href, icon, title, ...others } = props;
    const router = useRouter();
    const active = href ? router.pathname === href : false;

    return (
        <ListItem
            disableGutters
            sx={{
                display: 'flex',
                mb: 0.5,
                py: 0,
                px: 2,
            }}
            {...others}
        >
            <NextLink href={href} passHref>
                <Button
                    endIcon={<KeyboardArrowRight />}
                    component="a"
                    startIcon={icon}
                    disableRipple
                    sx={{
                        backgroundColor: active ? 'rgba(255,255,255, 0.08)' : 'transparent',
                        borderRadius: 1,
                        width: '100%',
                        color: active ? '#10B981' : '#D1D5DB',
                        justifyContent: 'flex-start',
                        px: 3,
                        '& .MuiButton-startIcon': {
                            color: active ? '#10B981' : '#9CA3AF',
                        },
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255, 0.08)',
                        },
                    }}
                >
                    <Box sx={{ flexGrow: 1 }}>{title}</Box>
                </Button>
            </NextLink>
        </ListItem>
    );
};
