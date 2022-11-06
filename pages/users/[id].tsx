/** @format */

import * as React from "react";
import { Tab } from "@mui/material";
import AdminOnly from "../../components/auth/AdminOnly";
import PrivateRoute from "../../components/auth/PrivateRoute";
import { DashboardLayout } from "../../components/layouts/Dashboard.layout";
import { Box } from "@mui/system";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Account from "../../components/users/Account";
import Profile from "../../components/users/Profile";
import { useTheme } from "@emotion/react";

const SingleUserPage = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const theme = useTheme();

  return (
    <PrivateRoute>
      <AdminOnly>
        <DashboardLayout>
          <React.Fragment>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label='lab API tabs example'>
                    <Tab label='Account Information' value='1' />
                    <Tab
                      label='Club/Skating School Profile Information'
                      value='2'
                    />
                  </TabList>
                </Box>
                <TabPanel value='1'>
                  <Account />
                </TabPanel>
                <TabPanel value='2'>
                  <Profile />
                </TabPanel>
              </TabContext>
            </Box>
          </React.Fragment>
        </DashboardLayout>
      </AdminOnly>
    </PrivateRoute>
  );
};

export default SingleUserPage;
