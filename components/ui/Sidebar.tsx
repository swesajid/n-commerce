import { FC } from 'react';
import { styled } from '@mui/material/styles';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { sidebarLinks } from '../../seeds/sidebar.seed';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const drawerWidth = 300;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

interface iSidebarProps {
    open: boolean;
    onDrawerClose: () => void;
}

const Sidebar: FC<iSidebarProps> = ({ open, onDrawerClose }) => {
    const router = useRouter();
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <Link href="/">
                    <a>
                        <img src="/logo.png" width={250} height={60} />
                    </a>
                </Link>
                <IconButton onClick={onDrawerClose}>
                    <MenuIcon color="primary" />
                </IconButton>
            </DrawerHeader>
            {/* <Divider /> */}
            <List>
                {sidebarLinks.map((item, index) => (
                    <Accordion key={index}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <item.icon sx={{ marginRight: '1rem' }} />
                            <Typography>{item.text}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {item.links.map((link, index) => (
                                    <ListItem button key={link.text} onClick={() => router.push(link.link)}>
                                        <ListItemIcon>
                                            <link.icon></link.icon>
                                        </ListItemIcon>
                                        <ListItemText primary={link.text} />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
