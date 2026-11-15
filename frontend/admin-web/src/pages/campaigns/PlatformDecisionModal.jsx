import  { useState } from "react";
import { Modal, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { CustomButton } from "@src/components";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import PropTypes from "prop-types";
import useCampaignEvents from "@src/application-wide/api-gateway-hooks/use-campaign-events";

const PlatformDecisionModal = ({ onClose, campaign }) => {
  
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");
  const [isChangeStatusLoading, setChangeStatusLoading] = useState(false);
  const { updateCampaignStatusTrigger } = useCampaignEvents()
  const handleOptionChange = (option) => {
    if (!campaign) {
      return "Campaign data is missing.";
    }
    setSelectedOption(option);
  };

  const handleButtonClick = async () => {
    if (selectedOption === "instagram") {
      //change the status to submitted
      setChangeStatusLoading(true);
      try {
        await axiosInstance.patch(`campaign/${campaign.id}/update_status`, {
          status: "submitted",
        });
        message.success("Campaign Submitted Successfully!")
        updateCampaignStatusTrigger(campaign.id)
        setTimeout(() => {
          navigate(`/dashboard/campaigns/${campaign.id}`, { replace: true });
          navigate(0);
        }, 2000);
        onClose();
      } catch (error) {
        message.error(error.message || "An error occurred");
      } finally {
        setChangeStatusLoading(false);
      }
    } else if (selectedOption === "ubu") {
      navigate(`/dashboard/campaigns/${campaign.id}/publish`);
    }
  };

  return (
    <Modal
      open={true}
      onCancel={onClose}
      centered
      footer={null}
      closeIcon={<span style={{ fontSize: "24px", color: "#000" }}>×</span>}
      width={500}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "10px",
      }}
    >
      <h2
        className="platform-decision-modal-text"
        style={{ marginBottom: "20px" }}
      >
        Please Select Your Desired Posting Platform:
      </h2>
      <div
        className="upload-options"
        style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
      >
        {/* Instagram Option */}
        <div
          className={`option-card ${
            selectedOption === "instagram" ? "active" : ""
          }`}
          onClick={() => handleOptionChange("instagram")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            border: `2px solid ${
              selectedOption === "instagram" ? "#E1306C" : "#ccc"
            }`,
            borderRadius: "8px",
            cursor: "pointer",
            width: "150px",
            textAlign: "center",
            boxShadow:
              selectedOption === "instagram"
                ? "0 4px 10px rgba(225, 48, 108, 0.5)"
                : "none",
          }}
        >
          <SendOutlined style={{ fontSize: "48px", color: "#E1306C" }} />
          <label
            htmlFor="instagram"
            style={{ marginTop: "10px", fontSize: "14px" }}
          >
            Posted Directly via Social Media
          </label>
        </div>

        {/* UBU Option */}
        <div
          className={`option-card ${selectedOption === "ubu" ? "active" : ""}`}
          onClick={() => handleOptionChange("ubu")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            border: `2px solid ${selectedOption === "ubu" ? "#000" : "#ccc"}`,
            borderRadius: "8px",
            cursor: "pointer",
            width: "150px",
            textAlign: "center",
            boxShadow:
              selectedOption === "ubu"
                ? "0 4px 10px rgba(0, 0, 0, 0.5)"
                : "none",
          }}
        >
          <span style={{ fontSize: "45px", color: "#000", fontWeight: "bold" }}>
            UBU
          </span>
          <label htmlFor="ubu" style={{ marginTop: "10px", fontSize: "14px" }}>
            Publish your Post to Social Media via UBU
          </label>
        </div>
      </div>
      <CustomButton
        type="primary"
        onClick={handleButtonClick}
        variant="black"
        key="add"
        disabled={!selectedOption}
        loading={isChangeStatusLoading}
      >
        {selectedOption === "instagram"
          ? "Completed"
          : selectedOption === "ubu"
          ? "Publish"
          : "Select an Option"}
      </CustomButton>
    </Modal>
  );
};

PlatformDecisionModal.propTypes = {
onClose : PropTypes.func,
campaign: PropTypes.node
}

export default PlatformDecisionModal;
