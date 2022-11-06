/** @format */

import Head from "next/head";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import {
  deleteReceiptFromAPI,
  getAllReceiptsFromAPI,
  iAPIReceipt,
} from "../../api_calls/receipts.api";
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
import { TableHeaderStyles } from "../../components/helpers/Table.helper";
import Link from "next/link";
import ReactToPrint from "react-to-print";

const StyledSpan = styled.span((props: any) => ({
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  background: props.bgColor,
}));

const ReceiptPage = () => {
  const [userList, setUserList] = useState<iAPIUSer[]>([]);
  const [receiptList, setReceiptList] = useState<iAPIReceipt[]>([]);
  const [receiptID, setReceiptID] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const router = useRouter();
  const userInfo = useContext(authContext);
  const alertState = useContext(alertContext);
  const [tempId, setTempId] = useState("");
  const [rateName, setRateName] = useState("");
  const [rateList, setRateList] = useState<string[]>([]);

  useEffect(() => {
    const getReceipts = async () => {
      const receipts = await getAllReceiptsFromAPI();
      if (!receipts) {
        router.push("/");
      }
      setReceiptList(receipts);
      setLoading(false);
    };

    getReceipts();
  }, [router]);
  const handleAgreeToDelete = async () => {
    const result = await deleteReceiptFromAPI(tempId);

    if (result === "success") {
      const receipts = await getAllReceiptsFromAPI();
      setReceiptList(receipts);
      setShowDeletePrompt(false);
      timedAlert(alertState, "Deleted Receipt!", "success");
    } else {
      setShowDeletePrompt(false);
    }
  };

  const columns = [
    {
      name: "categorie",
      label: "Vehicle Rate Title",
      options: {
        filter: true,
        sort: true,
        print: true,
        setCellHeaderProps: () => ({ style: TableHeaderStyles }),
      },
    },
    {
      name: "date",
      label: "Created",
      options: {
        filter: true,
        sort: true,
        print: true,
        setCellHeaderProps: () => ({ style: TableHeaderStyles }),
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: true,
        sort: true,
        print: true,
        setCellHeaderProps: () => ({ style: TableHeaderStyles }),
      },
    },
  ];
  const tableData = receiptList.map((receipt, user) => ({
    categorie: receipt.categorie,
    date: formatDateToLocal({
      oldDate: new Date(receipt.createdAt),
      dateTime: false,
    }),
    actions: (
      <Fragment>
        {/* <Button variant="text" color="secondary">
                    Activity
                </Button> */}
        {/* <Button variant="outlined" color="primary">
                            <Link href={`/rates/details/${rate._id}`}>
                                <a>View</a>
                            </Link>
                        </Button> */}
        <Button variant='outlined' color='primary' sx={{ marginLeft: "5px" }}>
          <Link href={`/receipts/edit/${receipt._id}`}>
            <a>Edit</a>
          </Link>
        </Button>
        <Button
          variant='outlined'
          color='error'
          onClick={() => {
            setTempId(receipt._id);
            setShowDeletePrompt(true);
          }}
          sx={{ marginLeft: "5px" }}>
          Delete
        </Button>
        <AgreementModal
          title='Delete Vehicle Receipt?'
          description='Vehicle Receipt will be deleted permanently.'
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
        <title>Dashboard | Vehicle Receipt</title>
      </Head>
      <PrivateRoute>
        <DashboardLayout>
          {loading ? (
            <Spinner />
          ) : (
            <Fragment>
              <MUIDataTable
                title='Vehicle Receipt'
                columns={columns}
                data={tableData}
                options={{ print: true, selectableRows: undefined }}
              />
            </Fragment>
          )}
        </DashboardLayout>
      </PrivateRoute>
    </Fragment>
  );
};

export default ReceiptPage;
