/** @format */

import { Typography } from "@mui/material";
import Head from "next/head";
import PrivateRoute from "../components/auth/PrivateRoute";
import AdminLayout from "../components/layouts/Admin.layout";
import { DashboardLayout } from "../components/layouts/Dashboard.layout";

export default function Home() {
  return (
    <PrivateRoute>
      <DashboardLayout>
        <Head>
          <title>Dashboard</title>
        </Head>
        <Typography variant='h4' component='h4'>
          Welcome to your dashboard
        </Typography>
      </DashboardLayout>
    </PrivateRoute>
  );
}
