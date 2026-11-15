import { useTranslation } from "react-i18next"
import AgencyBrandLayout from "../AgencyBrandLayout"
import AgencyRegistrationWizard from "./AgencyRegistrationWizard";

const AgencyRegistration = () =>{
    const {t} = useTranslation();
    return <>
    <AgencyBrandLayout
        buttonText={t('agency-registration-page.header.button-text')}
        buttonNavigationURL='/'
        headerText={t('agency-registration-page.header.text1')}
        headerText2={t('agency-registration-page.header.text2')}
        contentText={t('agency-registration-page.content.text1')}
        contentDescription={t('agency-registration-page.content.description')}
    >
        <AgencyRegistrationWizard />
        </AgencyBrandLayout>
    </>
}
export default AgencyRegistration