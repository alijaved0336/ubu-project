import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PartialAuthRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const isSignupJourney = user?.msg?.includes("route to sign up journey");
 
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryParams = Object.fromEntries(searchParams.entries());
  const isSurveyEditRoute =
    location.pathname === "/registration/creator" &&
    queryParams?.edit === "true";

  if (isAuthenticated && isSurveyEditRoute) {
    return <Outlet />;
  }

  if (
    isAuthenticated &&
    // user?.isAdmin &&
    !isSignupJourney &&
    (user?.isScanned || user?.type === "brand")
  ) {
    return (
      <Navigate
        to={user?.type === "brand" ? "/dashboard/segments" : "/dashboard/posts"}
      />
    );
  } else if (
    isAuthenticated &&
    // user?.isAdmin &&
    !user?.isScanned &&
    !isSignupJourney
  )
    return <Navigate to="/qr-Page" />;
  //   else if (isAuthenticated && !user?.isAdmin && !isSignupJourney)
  //     return <Navigate to="/coming-soon" />;
  return <Outlet />;
};

export default PartialAuthRoute;
