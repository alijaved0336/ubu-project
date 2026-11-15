import Dashboard from "../../components/Layouts/Dashboard/Dashboard";
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
import AffiliateProductsPage from "@src/pages/affilateProducts";
import NewAboutUs from "@src/pages/about-us/AboutUs/about-us";
import EmailVerification from "@src/pages/auth-pages/EmailVerification/EmailVerification";
export const PUBLIC_ROUTES = [
  {
    path: "/home",
    element: <LandingPage />,
  },
  {
    path: "/",
    element: <ComingSoon />,
  },
  {
    path: "/login",
    element: <SignInPage />,
  },
  {
    path: "/registration/creator",
    element: <InfSignup />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/registration",
    element: <SignUpPage />,
  },
  {
    path: "/reset",
    element: <ResetPassword />,
  },
  {
    path: "/agencyRegistration",
    element: <AgencyRegistration />,
  },
  {
    path: "/registration/brand",
    element: <BrandRegistration />,
  },

  {
    path: "/influencerRegistration",
    element: <InfluncerRegistration />,
  },
  {
    path: "/qr-Page",
    element: <QRPage />,
  },
  {
    path: "/registration/role",
    element: <ChooseSignUp />,
  },
  {
    path: "/privacypolicy",
    element: <PrivatePolicy />,
  },
  {
    path: "/contact-us",
    element: <ContactUs />,
  },
  {
    path: "/delete-data-instructions",
    element: <DeleteDataInstructions />,
  },
  {
    path: "/coming-soon",
    element: <ComingSoon />,
  },
  {
    path: "/about-us",
    element: <AboutUs />,
  },
  {
    path: "/new-about-us",
    element: <NewAboutUs />,
  },
  {
    path: "/terms-and-service",
    element: <TermsOfService />,
  },
  {
    path: "/about-uss",
    element: <AffiliateProductsPage />,
  },
  {
    path: "body-scan",
    element: <AppleStoreRedirect />,
  },
  {
    path: "/404",
    element: <Page404 />,
  },
  {
    path: "/email/verify",
    element: <EmailVerification />,
  },
];
