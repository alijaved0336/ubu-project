import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const LayoutAuthRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  
  if (isAuthenticated && (!user?.type || user?.is_questionnaire_completed === false || user?.isSurveyDone === false))
    return <Navigate to="/registration/role" />;

  return <Outlet />;
};

export default LayoutAuthRoute;
