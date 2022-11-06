/** @format */

import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { authContext } from "../../contexts/auth.context";
import Spinner from "../helpers/Spinner";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const PublicRoute = (props: any) => {
  const [renderContent, setRenderContent] = useState(false);
  const userInfo = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("skon-auth-token");

    if (token) {
      const check_user = async () => {
        try {
          const res = await fetch(`${API_BASE}/auth`, {
            method: "GET",
            headers: { "skon-auth-token": token },
          });
          const data = await res.json();
          userInfo?.setUser(data);

          router.push("/");
        } catch (err) {
          console.log(err);
          localStorage.removeItem("skon-auth-token");
          setRenderContent(true);
        }
      };
      check_user();
    } else {
      setRenderContent(true);
    }
  }, [router, userInfo]);

  if (renderContent) {
    return <Fragment>{props.children}</Fragment>;
  } else {
    return <Spinner />;
  }
};

export default PublicRoute;
