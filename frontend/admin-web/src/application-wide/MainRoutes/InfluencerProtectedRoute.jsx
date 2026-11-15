import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const InfluencerProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth || {});

  if (user?.type?.toLowerCase() === "influencer") return <Outlet />;
  return <Navigate to={"/access-denied"} />;
};

export default InfluencerProtectedRoute;
