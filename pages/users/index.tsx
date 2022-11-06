/** @format */

import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import {
  deleteUserFromAPI,
  getAllUsersFromAPI,
  iAPIUSer,
  updateUserfromAPI,
} from "../../api_calls/users.api";
import AdminOnly from "../../components/auth/AdminOnly";
import PrivateRoute from "../../components/auth/PrivateRoute";
import Spinner from "../../components/helpers/Spinner";
import MUIDataTable from "mui-datatables";
import styled from "@emotion/styled";
import AgreementModal from "../../components/helpers/AgreementModal";
import { authContext } from "../../contexts/auth.context";
import { alertContext } from "../../contexts/alert.context";
import { timedAlert } from "../../components/utils/alert.util";
import { DashboardLayout } from "../../components/layouts/Dashboard.layout";
import { USER_ROLE } from "../../server/src/types";

const StyledSpan = styled.span((props: any) => ({
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  background: props.bgColor,
}));

const UsersPage = () => {
  const [userList, setUserList] = useState<iAPIUSer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [showStatusPrompt, setShowStatusPrompt] = useState(false);
  const router = useRouter();
  const userInfo = useContext(authContext);
  const alertState = useContext(alertContext);

  useEffect(() => {
    const getUsers = async () => {
      const users = await getAllUsersFromAPI();
      if (!users) {
        router.push("/");
      }

      setUserList(users);
      setLoading(false);
    };

    getUsers();
  }, [router]);

  const handleAgreeToDelete = async (id: string) => {
    const result = await deleteUserFromAPI(id);

    if (result === "success") {
      const users = await getAllUsersFromAPI();
      setUserList(users);
      setShowDeletePrompt(false);
      timedAlert(alertState, "Deleted User!", "success");
    } else {
      setShowDeletePrompt(false);
    }
  };

  const handleAgreeToDeactivate = async (
    id: string,
    name: string,
    email: string,
    username: string,
    role: USER_ROLE,
    active: string
  ) => {
    const userInfo = {
      _id: id,
      name: name,
      email: email,
      role: role,
      username: username,
      active: active === "Active" ? "Disabled" : "Active",
    };

    const result = await updateUserfromAPI(id, userInfo);

    if (result === true) {
      const users = await getAllUsersFromAPI();
      setUserList(users);
      setShowDeletePrompt(false);
      setShowStatusPrompt(false);
      timedAlert(
        alertState,
        active === "Active" ? "Disabled User!" : "Enabled User!",
        "success"
      );
    } else {
      setShowStatusPrompt(false);
    }
  };

  const columns = [
    { name: "name", label: "Name", options: { filter: true, sort: true } },
    {
      name: "username",
      label: "Username",
      options: { filter: true, sort: true },
    },
    { name: "email", label: "Email", options: { filter: true, sort: true } },
    { name: "role", label: "Role", options: { filter: true, sort: true } },
    {
      name: "active",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex: number) => {
          let active = userList[dataIndex].active;
          console.log("here is active", active);

          if (active === "Active") {
            return <StyledSpan bgColor='green'>Active</StyledSpan>;
          } else {
            return <StyledSpan bgColor='red'>Disabled</StyledSpan>;
          }
        },
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: { filter: true, sort: false },
    },
  ];

  const tableData = userList.map((user) => ({
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    active: user.active ? "Active" : "Disabled",
    actions: (
      <Fragment>
        {user._id !== userInfo?.user?._id && (
          <>
            <Button variant='outlined' color='primary'>
              <Link href={`/users/${user._id}`}>
                <a>Edit</a>
              </Link>
            </Button>
            <Button
              variant='outlined'
              color='primary'
              onClick={() => setShowStatusPrompt(true)}
              sx={{ marginLeft: "5px" }}>
              {user.active === "Active" ? "Disable" : "Enable"}
            </Button>
            <Button
              variant='outlined'
              color='error'
              onClick={() => setShowDeletePrompt(true)}
              sx={{ marginLeft: "5px" }}>
              Delete
            </Button>
          </>
        )}
        <AgreementModal
          title='Delete User?'
          description='The user and all his/her details i.e., photos, profiles will be deleted permanently.'
          open={showDeletePrompt}
          onClose={() => setShowDeletePrompt(false)}
          onAgree={() => handleAgreeToDelete(user._id)}
        />
        <AgreementModal
          title={user.active === "Active" ? "Disable User?" : "Enable User?"}
          description={
            user.active === "Active"
              ? "The user will no longer be able to access their account."
              : "The user will have full access to their account."
          }
          open={showStatusPrompt}
          onClose={() => setShowStatusPrompt(false)}
          onAgree={() =>
            handleAgreeToDeactivate(
              user._id,
              user.name,
              user.email,
              user.username,
              user.role,
              user.active
            )
          }
        />
      </Fragment>
    ),
  }));

  return (
    <PrivateRoute>
      <AdminOnly>
        <DashboardLayout>
          {loading ? (
            <Spinner />
          ) : (
            <Fragment>
              <MUIDataTable
                title='All Users'
                columns={columns}
                data={tableData}
                options={{ print: false }}
              />
            </Fragment>
          )}
        </DashboardLayout>
      </AdminOnly>
    </PrivateRoute>
  );
};

export default UsersPage;
