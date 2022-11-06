/** @format */

import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { authContext } from "../../contexts/auth.context";
import Spinner from "../helpers/Spinner";

const AdminOnly = (props: any) => {
  const userInfo = useContext(authContext);
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (userInfo?.user?.role === "admin") {
      setShowContent(true);
    } else {
      router.push("/");
    }
  }, [router, userInfo]);

  return showContent ? <Fragment>{props.children}</Fragment> : <Spinner />;
};

export default AdminOnly;
