/** @format */

import PropTypes from "prop-types";
import styled from "@emotion/styled";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Bell as BellIcon } from "../icons/bell";
import { UserCircle as UserCircleIcon } from "../icons/user-circle";
import { Users as UsersIcon } from "../icons/users";
import { Fragment, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authContext } from "../../contexts/auth.context";
import Link from "next/link";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#fff",
  boxShadow: "0px 1px 4px rgba(100, 116, 139, 0.12)",
}));

const settings = [
  { name: "Account", url: "/account" },
  { name: "Dashboard", url: "/dashboard" },
];
const colors = ["crimson", "dodgerblue", "teal", "purple", "green"];

export const DashboardNavbar = (props: any) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [color, setColor] = useState("crimson");
  const router = useRouter();
  const userInfo = useContext(authContext);

  //   console.log(userInfo?.user);

  useEffect(() => {
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);
  const { onSidebarOpen, ...other } = props;

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = () => {
    localStorage.removeItem("skon-auth-token");
    handleCloseUserMenu();
    router.push("/auth/login");
  };

  return (
    <Fragment>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: "calc(100% - 280px)",
          },
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}>
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: "inline-flex",
                lg: "none",
              },
            }}>
            <MenuIcon fontSize='small' />
          </IconButton>
          {/* <Tooltip title="Search">
                        <IconButton sx={{ ml: 1 }}>
                            <SearchIcon fontSize="small" />
                        </IconButton>
                    </Tooltip> */}
          <Box sx={{ flexGrow: 1 }} />
          {/* <Tooltip title="Contacts">
                        <IconButton sx={{ ml: 1 }}>
                            <UsersIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Notifications">
                        <IconButton sx={{ ml: 1 }}>
                            <Badge
                                badgeContent={4}
                                color="primary"
                                variant="dot"
                            >
                                <BellIcon fontSize="small" />
                            </Badge>
                        </IconButton>
                    </Tooltip> */}
          <Box sx={{ flexGrow: 0 }}>
            <Typography component='span' color='black'>
              Welcome, {userInfo?.user?.name} &nbsp;
            </Typography>
            <Tooltip title='Open settings'>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: color }}>
                  {userInfo?.user?.name[0].toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id='menu-appbar'
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}>
              {settings.map((setting, key) => (
                <MenuItem key={key} onClick={handleCloseUserMenu}>
                  <Typography textAlign='center'>
                    <Link href={setting.url}>
                      <a>{setting.name}</a>
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={logout}>
                <Typography textAlign='center'>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </DashboardNavbarRoot>
    </Fragment>
  );
};

// DashboardNavbar.propTypes = {
//     onSidebarOpen: PropTypes.func,
// };
