import { useLocation, useNavigate } from "react-router-dom";
import Tick from "../../assets/Tick-doc.png";
import { CustomButton, Text } from "@src/components";
import { Flex } from "antd";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";

const DocumentSentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { campaignId = null } = location.state || {};

  const handleBackClick = () => {
    if (campaignId) {
      navigate("/dashboard/campaigns");
    } else {
      navigate("/dashboard/segments");
      // navigate(-1); // Go back to the previous page
    }
  };

  return (
    <Flex vertical gap={"2rem"} className="document-sent-page">
      <UBUBreadCrumb
        items={[{ title: "Dashboard" }, { title: "Document Sent" }]}
      />
      <Flex align="center" justify="space-between">
        <Text className="fs-20 fw-600">Document Sent</Text>
        <CustomButton
          variant={"light"}
          className=" md"
          onClick={handleBackClick}
        >
          <span>&larr;</span> Back
        </CustomButton>
      </Flex>
      <Flex vertical align="center" className="success-container">
        <div className="success-icon">{<img src={Tick} alt="Success" />}</div>
        <Text className="fs-20 fw-600">
          Document has sent successfully to recipients email addresses.
        </Text>
      </Flex>
    </Flex>
  );
};

export default DocumentSentPage;
