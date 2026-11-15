import React from "react";
import { Modal } from "antd";
import { CheckCircleOutlined, CheckCircleTwoTone } from "@ant-design/icons";

const SuccessModal = ({ onClose, message, heading }) => {
  return (
    <Modal
      open={true}
      onCancel={onClose} // Calls parent’s onClose method
      centered
      footer={null}
      closeIcon={<span style={{ fontSize: "24px", color: "#000" }}>×</span>}
      width={400}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          marginBottom: "10%",
        }}
      >
        <div
          style={{
            border: "10px solid #F79E1B", // Dark orange circle
            borderRadius: "50%",
            width: "70px", // Adjusted for outer circle size
            height: "70px",
            position: "absolute",
            zIndex: 1,
            boxShadow: "0 4px 10px rgb(247 158 28)",
          }}
        ></div>

        <CheckCircleTwoTone
          twoToneColor="#F79E1B"
          style={{
            fontSize: "72px",
            color: "#F9A825",
            zIndex: 3,
          }}
        />
      </div>

      {/* Success Text */}
      {heading && <h1 className="fs-24 fw-600 tw-mb-4">{heading}</h1>}
      <h2 className="success-modal-text">{message}</h2>
    </Modal>
  );
};

export default SuccessModal;
