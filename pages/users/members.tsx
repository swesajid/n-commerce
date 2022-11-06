/** @format */

import { Button, ButtonGroup, Typography } from "@mui/material";
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
import Head from "next/head";
import { TableHeaderStyles } from "../../components/helpers/Table.helper";

const StyledSpan = styled.span((props: any) => ({
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  background: props.bgColor,
}));

const MemberPage = () => {
  const [userList, setUserList] = useState<iAPIUSer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [showStatusPrompt, setShowStatusPrompt] = useState(false);

  const [userID, setUserID] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<USER_ROLE>("club");
  const [username, setUsername] = useState("");
  const [active, setActive] = useState("");
  const router = useRouter();
  const userInfo = useContext(authContext);
  const alertState = useContext(alertContext);

  useEffect(() => {
    const getUsers = async () => {
      const users = await getAllUsersFromAPI();
      if (!users) {
        router.push("/");
      }
      const filteredUsers = users.filter((user) => user.role !== "admin");

      setUserList(filteredUsers);
      setLoading(false);
    };

    getUsers();
  }, [router]);

  const handleAgreeToDelete = async () => {
    const result = await deleteUserFromAPI(userID);

    if (result === "success") {
      const users = await getAllUsersFromAPI();
      setUserList(users);
      setShowDeletePrompt(false);
      router.push("/users/members");
      timedAlert(alertState, "Deleted User!", "success");
    } else {
      setShowDeletePrompt(false);
    }
  };

  const handleAgreeToDeactivate = async () => {
    const id = userID;

    const userInfo = {
      _id: id,
      name: name,
      email: email,
      role: role,
      username: username,
      active: active === "Active" ? "Disabled" : "Active",
    };

    console.log("Here is the User Info", userInfo);

    const result = await updateUserfromAPI(id, userInfo);

    if (result === true) {
      const users = await getAllUsersFromAPI();
      const filteredUsers = users.filter((user) => user.role !== "admin");
      setUserList(filteredUsers);
      setShowDeletePrompt(false);
      setShowStatusPrompt(false);
      timedAlert(
        alertState,
        active === "Active" ? "Disabled User!" : "Enabled User!",
        "success"
      );
    } else {
      setShowDeletePrompt(false);
      setShowStatusPrompt(false);
    }
  };

  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({ style: TableHeaderStyles }),
      },
    },
    {
      name: "username",
      label: "Username",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({ style: TableHeaderStyles }),
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({ style: TableHeaderStyles }),
      },
    },
    {
      name: "role",
      label: "Role",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({ style: TableHeaderStyles }),
      },
    },
    {
      name: "active",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({ style: TableHeaderStyles }),
        customBodyRenderLite: (dataIndex: number) => {
          let active = userList[dataIndex].active;

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
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({ style: TableHeaderStyles }),
      },
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
              onClick={() => {
                setShowStatusPrompt(true),
                  setUserID(user._id),
                  setName(user.name),
                  setEmail(user.email),
                  setRole(user.role),
                  setUsername(user.username),
                  setActive(user.active);
              }}
              sx={{ marginLeft: "5px" }}>
              {user.active === "Active" ? "Disable" : "Enable"}
            </Button>
            <Button
              variant='outlined'
              color='error'
              onClick={() => {
                setShowDeletePrompt(true), setUserID(user._id);
              }}
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
          onAgree={() => handleAgreeToDelete()}
        />
        <AgreementModal
          title={active === "Active" ? "Disable User?" : "Enable User?"}
          description={
            active === "Active"
              ? "The user will no longer be able to access their account."
              : "The user will have full access to their account."
          }
          open={showStatusPrompt}
          onClose={() => setShowStatusPrompt(false)}
          onAgree={() => handleAgreeToDeactivate()}
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
              <Head>
                <title>Dashboard | All Members</title>
              </Head>
              <MUIDataTable
                title='All Members'
                columns={columns}
                data={tableData}
                options={{ print: false, selectableRows: undefined }}
              />
            </Fragment>
          )}
        </DashboardLayout>
      </AdminOnly>
    </PrivateRoute>
  );
};

export default MemberPage;
