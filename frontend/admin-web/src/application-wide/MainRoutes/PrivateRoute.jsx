import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import SocketProvider from "@src/components/Providers/SocketProvider";
import Dashboard from "@src/components/Layouts/Dashboard/Dashboard";

const PrivateRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const location = useLocation();

  if (
    isAuthenticated &&
    (!user?.type || user?.msg?.includes("route to sign up journey"))
  )
    return <Navigate to="/registration/role" />;
  else if (
    isAuthenticated &&
    // user?.isAdmin &&
    (user?.isScanned || user?.type === "brand")
  )
    return (
      <SocketProvider>
        <Dashboard>
          <Outlet />
        </Dashboard>
      </SocketProvider>
    );
  else if (isAuthenticated && !user?.type)
    return <Navigate to="/registration/role" />;
  else if (
    isAuthenticated &&
    // user?.isAdmin &&
    !user?.isScanned
  )
    return <Navigate to="/qr-Page" />;
  // else if (isAuthenticated && !user?.isAdmin)
  //   return <Navigate to="/coming-soon" />;
  return <Navigate to="/login" state={{ from: location.pathname }} />;
};

export default PrivateRoute;
