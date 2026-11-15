import { useTranslation } from "react-i18next";
import AgencyBrandLayout from "../AgencyBrandLayout";
import RegistrationWizard from "./RegistrationWizard";
import LandingPageLayout from "../../layouts/LandingPageLayout";
import { Flex } from "antd";
import GenericLayout from "@src/pages/layouts/GenericLayout";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const BrandRegistration = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth || {});

  if (user?.isConsumer) {
    return <Navigate to="/registration/creator" />;
  }

  return (
    <>
      <LandingPageLayout>
        <GenericLayout heading="UBU Brand Owner" subHeader="APPLY TO BE AN">
          <AgencyBrandLayout
            contentText={t("brand-registration-page.content.text1")}
            contentDescription={t(
              "brand-registration-page.content.description"
            )}
          >
            <RegistrationWizard />
          </AgencyBrandLayout>
        </GenericLayout>
      </LandingPageLayout>
    </>
  );
};
export default BrandRegistration;
