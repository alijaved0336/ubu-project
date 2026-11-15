import LandingPageLayout from "../layouts/LandingPageLayout"
import FooterLayout from "../layouts/FooterLayout"
import { Button, Flex, Form, Input, Typography,Space } from "antd"
import GenericLayout from "../layouts/GenericLayout"
const { Title, Paragraph } = Typography;

const handleDelete = () => {

}

const DeleteDataInstructions = () => {
    return (
        <LandingPageLayout>
            <FooterLayout>

                    <GenericLayout heading="Deletion Profile Instructions">
                    </GenericLayout>
                    <div style={{ marginTop: "200px" , padding: "8%"}}>
                        <Title level={2}>How to Delete Your Profile</Title>
                        <Paragraph>
                            Follow these steps to permanently delete your account and all associated data:
                        </Paragraph>
                        <Paragraph>
                            <strong>1. Log into Your Account:</strong> Go to the login page and enter your credentials.
                        </Paragraph>
                        <Paragraph>
                            <strong>2. Navigate to Account Settings:</strong> Click on your profile icon or username in the top-right corner. From the dropdown, select <em>Account Settings</em>.
                        </Paragraph>
                        <Paragraph>
                            <strong>3. Go to the Delete Profile Section:</strong> Scroll down to the <em>Delete Profile</em> section and click the <em>Delete Profile</em> button.
                        </Paragraph>
                        <Paragraph>
                            <strong>4. Confirm Deletion:</strong> A confirmation prompt will appear. Review the details and click <em>Confirm</em> if you're sure.
                        </Paragraph>
                        <Paragraph>
                            <strong>5. Final Warning:</strong> <span style={{ color: "red" }}>Once you confirm, your profile and all associated data will be permanently deleted and cannot be recovered.</span>
                        </Paragraph>

            </div >   
            </FooterLayout>
        </LandingPageLayout>
    )
}
export default DeleteDataInstructions