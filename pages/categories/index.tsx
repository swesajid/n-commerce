/** @format */

import Head from "next/head";
import { Button, ButtonGroup, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import {
  deleteCategorieFromAPI,
  getAllCategoriesFromAPI,
  iAPICategorie,
} from "../../api_calls/categories.api";
import AdminOnly from "../../components/auth/AdminOnly";
import Spinner from "../../components/helpers/Spinner";
import AdminLayout from "../../components/layouts/Admin.layout";
import MUIDataTable from "mui-datatables";
import styled from "@emotion/styled";
import AgreementModal from "../../components/helpers/AgreementModal";
import { authContext } from "../../contexts/auth.context";
import { alertContext } from "../../contexts/alert.context";
import { timedAlert } from "../../components/utils/alert.util";
import PrivateRoute from "../../components/auth/PrivateRoute";
import { DashboardLayout } from "../../components/layouts/Dashboard.layout";
import { formatDateToLocal } from "../../components/utils/date.util";
import { iAPIUSer } from "../../api_calls/users.api";
import { shortenText } from "../../components/utils/misc.util";
import { TableHeaderStyles } from "../../components/helpers/Table.helper";

const StyledSpan = styled.span((props: any) => ({
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  background: props.bgColor,
}));

const CategoriePage = () => {
  const [userList, setUserList] = useState<iAPIUSer[]>([]);
  const [categorieList, setCategorieList] = useState<iAPICategorie[]>([]);
  const [categorieID, setCategorieID] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const router = useRouter();
  const userInfo = useContext(authContext);
  const alertState = useContext(alertContext);
  const [tempId, setTempId] = useState("");

  useEffect(() => {
    const getCategories = async () => {
      const categories = await getAllCategoriesFromAPI();
      if (!categories) {
        router.push("/");
      }

      setCategorieList(categories);
      // console.log(categories)
      setLoading(false);
    };

    getCategories();
  }, [router]);

  const handleAgreeToDelete = async () => {
    const result = await deleteCategorieFromAPI(tempId);

    if (result === "success") {
      const categories = await getAllCategoriesFromAPI();
      setCategorieList(categories);
      setShowDeletePrompt(false);
      timedAlert(alertState, "Deleted Categorie!", "success");
    } else {
      setShowDeletePrompt(false);
    }
  };

  const columns = [
    {
      name: "name",
      label: "Categorie Title",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({ style: TableHeaderStyles }),
      },
    },
    {
      name: "date",
      label: "Created",
      options: {
        filter: true,
        sort: true,
        setCellHeaderProps: () => ({ style: TableHeaderStyles }),
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
  const tableData = categorieList.map((categorie, user) => ({
    name: (
      <Link href={`/categories/edit/${categorie._id}`}>
        <a>{shortenText(categorie.name, 50)}</a>
      </Link>
    ),
    date: formatDateToLocal({
      oldDate: new Date(categorie.createdAt),
      dateTime: false,
    }),
    actions: (
      <Fragment>
        {/* <Button variant="text" color="secondary">
                    Activity
                </Button> */}
        {/* <Button variant="outlined" color="primary">
                            <Link href={`/categories/details/${categorie._id}`}>
                                <a>View</a>
                            </Link>
                        </Button> */}
        <Button variant='outlined' color='primary' sx={{ marginLeft: "5px" }}>
          <Link href={`/categories/edit/${categorie._id}`}>
            <a>Edit</a>
          </Link>
        </Button>
        <Button
          variant='outlined'
          color='error'
          onClick={() => {
            setTempId(categorie._id);
            setShowDeletePrompt(true);
          }}
          sx={{ marginLeft: "5px" }}>
          Delete
        </Button>
        <AgreementModal
          title='Delete Categorie?'
          description='Categorie will be deleted permanently.'
          open={showDeletePrompt}
          onClose={() => setShowDeletePrompt(false)}
          onAgree={() => handleAgreeToDelete()}
        />
      </Fragment>
    ),
  }));
  return (
    <Fragment>
      <Head>
        <title>Dashboard | Categories</title>
      </Head>
      <PrivateRoute>
        <DashboardLayout>
          {loading ? (
            <Spinner />
          ) : (
            <Fragment>
              <MUIDataTable
                title='All Categories'
                columns={columns}
                data={tableData}
                options={{ print: false, selectableRows: undefined }}
              />
            </Fragment>
          )}
        </DashboardLayout>
      </PrivateRoute>
    </Fragment>
  );
};

export default CategoriePage;
