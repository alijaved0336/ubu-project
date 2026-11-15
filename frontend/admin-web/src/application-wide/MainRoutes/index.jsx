import { Route, Routes } from "react-router-dom";

import ResetPassword from "../../pages/auth-pages/ResetPassword";
import SignInPage from "../../pages/auth-pages/SignInPage";
import InfSignup from "../../pages/influncer-signup/Inf-signup";
import SignUpPage from "../../pages/auth-pages/SignUpPage";
import LandingPage from "@src/pages/LandingPage/LandingPage";

import AgencyRegistration from "../../pages/auth-pages/AgencyRegistration";
import BrandRegistration from "../../pages/auth-pages/BrandRegistration";

import InfluncerRegistration from "../../pages/auth-pages/InfluencerRegistration";
import ChooseSignUp from "../../pages/auth-pages/SignUpPage/ChooseSignUp";
import PrivatePolicy from "../../pages/privatePolicy";
import ContactUs from "../../pages/contact-us";
import DeleteDataInstructions from "../../pages/deleteDataInstructions";
import ComingSoon from "../../pages/coming-soon/ComingSoon";
import AboutUs from "../../pages/about-us";
import TermsOfService from "../../pages/terms-and-service/index";

import QRPage from "../../pages/auth-pages/QRPage";
import AppleStoreRedirect from "../../pages/public-pages/AppleRedirectPage";

import Page404 from "../../components/ErrorBoundary/Page404";
import DashboardRoutes from "./DashboardRoutes";
import AffiliateProductsPage from "@src/pages/affilateProducts";
import NewAboutUs from "@src/pages/about-us/AboutUs/about-us";
import ChangePassword from "@src/pages/auth-pages/ResetPassword/changePassword";
import EmailVerification from "@src/pages/auth-pages/EmailVerification/EmailVerification";
import DisplayBlogs from "@src/pages/blogs/DisplayBlogs";
import ViewBlog from "@src/pages/blogs/ViewBlog";
import AccessDeniedPage from "@src/components/ErrorBoundary/AccessDeniedPage";
import SocketProvider from "@src/components/Providers/SocketProvider";
import AuthRoute from "./AuthRoute";
import PartialAuthRoute from "./PartialAuthRoute";
import LayoutAuthRoute from "./LayoutAuthRoute";
import InfluencerQuestionnaireFormProvider from "@src/components/Questionnaire/QuestionnaireForm/InfluencerQuestionnaireForm/InfluencerQuestionnaireFormProvider";

const MainRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthRoute />}>
        <Route path="/login" element={<SignInPage />} />
        <Route path="/registration" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ChangePassword />} />
        <Route path="/reset" element={<ResetPassword />} />
      </Route>

      <Route element={<PartialAuthRoute />}>
        <Route path="/agencyRegistration" element={<AgencyRegistration />} />
        <Route path="/registration/brand" element={<BrandRegistration />} />
        <Route path="/registration/role" element={<ChooseSignUp />} />
        <Route
          path="/registration/creator"
          element={
            <InfluencerQuestionnaireFormProvider>
              <InfSignup />
            </InfluencerQuestionnaireFormProvider>
          }
        />

        <Route
          path="/influencerRegistration"
          element={<InfluncerRegistration />}
        />
      </Route>

      <Route
        path="/qr-Page"
        element={
          <SocketProvider>
            <QRPage />
          </SocketProvider>
        }
      />
      <Route path="/privacypolicy" element={<PrivatePolicy />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route
        path="/delete-data-instructions"
        element={<DeleteDataInstructions />}
      />
      <Route path="/coming-soon" element={<ComingSoon />} />
      <Route path="/blogs" element={<DisplayBlogs />} />
      <Route path="/blogs/:id" element={<ViewBlog />} />
      <Route path="/affiliate-products" element={<AffiliateProductsPage />} />
      <Route path="/about-us-legacy" element={<AboutUs />} />
      <Route path="/about-us" element={<NewAboutUs />} />
      <Route path="/terms-and-service" element={<TermsOfService />} />
      <Route path="/body-scan" element={<AppleStoreRedirect />} />
      <Route path="/waitlist" element={<ComingSoon />} />

      <Route path="/dashboard/*" element={<DashboardRoutes />} />

      <Route path="/access-denied" element={<AccessDeniedPage />} />

      <Route path="/email/verify" element={<EmailVerification />} />
      <Route element={<LayoutAuthRoute />}>
        <Route path="/" element={<LandingPage />} />
      </Route>
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};
export default MainRoutes;
