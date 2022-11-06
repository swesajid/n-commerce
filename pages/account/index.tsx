/** @format */

import * as React from "react";
import { Card, Tab } from "@mui/material";
import AdminOnly from "../../components/auth/AdminOnly";
import PrivateRoute from "../../components/auth/PrivateRoute";
import { DashboardLayout } from "../../components/layouts/Dashboard.layout";
import { Box } from "@mui/system";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useTheme } from "@emotion/react";
import UpdateAccount from "../../components/account/UpdateAccount";
import UpdatePassword from "../../components/account/UpdatePassword";

const Account = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const theme = useTheme();

  return (
    <PrivateRoute>
      <DashboardLayout>
        <React.Fragment>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label='lab API tabs example'>
                  <Tab label='Update Account' value='1' />
                  <Tab label='Update Password' value='2' />
                </TabList>
              </Box>
              <TabPanel value='1'>
                <UpdateAccount />
              </TabPanel>
              <TabPanel value='2'>
                <UpdatePassword />
              </TabPanel>
            </TabContext>
          </Box>
        </React.Fragment>
      </DashboardLayout>
    </PrivateRoute>
  );
};

export default Account;
