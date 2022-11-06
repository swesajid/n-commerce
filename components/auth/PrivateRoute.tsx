/** @format */

import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import logger from "../../config/logger";
import { authContext } from "../../contexts/auth.context";
import Spinner from "../helpers/Spinner";

const NAMESPACE = "Private route wrapper component";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const PrivateRoute = (props: any) => {
  const userInfo = useContext(authContext);
  const [renderContent, setRenderContent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("skon-auth-token");

    if (router.isReady) {
      if (token) {
        const checkUser = async () => {
          try {
            const res = await fetch(`${API_BASE}/auth`, {
              method: "GET",
              headers: { "skon-auth-token": token },
            });
            const user = await res.json();
            if (userInfo) {
              userInfo.setUser(user);
              setRenderContent(true);
            }
          } catch (err: any) {
            logger.error(NAMESPACE, "Check User Error", err);
            setRenderContent(false);
            localStorage.removeItem("skon-auth-token");
            router.push(`/auth/login?path=${router.asPath}`);
          }
        };
        if (!renderContent) {
          checkUser();
        }
      } else {
        setRenderContent(false);
        localStorage.removeItem("skon-auth-token");
        router.push(`/auth/login?path=${router.asPath}`, "/auth/login");
      }
    }
  }, [router, userInfo, renderContent]);

  if (renderContent) {
    return <Fragment>{props.children}</Fragment>;
  } else {
    return <Spinner />;
  }
};

export default PrivateRoute;
