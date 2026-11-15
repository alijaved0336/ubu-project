import { ADMIN_EMAILS } from "@src/utils/constant";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const isSignupJourney = user?.msg?.includes("route to sign up journey");

  if (isAuthenticated && (!user?.type || isSignupJourney))
    return <Navigate to="/registration/role" />;
  else if (
    isAuthenticated &&
    // user?.isAdmin &&
    (user?.isScanned || user?.type === "brand")
  ) {
    return (
      <Navigate
        to={user?.type === "brand" ? ADMIN_EMAILS.includes(user?.email)?"/dashboard/reports":"/dashboard/segments" : "/dashboard/posts"}
      />
    );
  } else if (
    isAuthenticated &&
    // user?.isAdmin &&
    !user?.isScanned
  )
    return <Navigate to="/qr-Page" />;
  // else if (isAuthenticated && !user?.isAdmin)
  //   return <Navigate to="/coming-soon" />;
  return <Outlet />;
};

export default AuthRoute;
