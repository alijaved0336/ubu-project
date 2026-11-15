import React from "react";
import { Modal } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { CustomButton } from "..";

const ConfirmationModal = ({
  onClose,
  onConfirm,
  message,
  confirmText = "Yes",
  closeText = "No",
  isConfirmLoading,
}) => {
  return (
    <Modal
      open={true}
      onCancel={onClose}
      centered
      footer={null}
      closeIcon={<span style={{ fontSize: "24px", color: "#000" }}>×</span>}
      width={400}
      style={{
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
            border: "10px solid #F79E1B",
            borderRadius: "50%",
            width: "70px",
            height: "70px",
            position: "absolute",
            zIndex: 1,
            boxShadow: "0 4px 10px rgb(247 158 28)",
          }}
        ></div>
        <QuestionCircleOutlined
          twoToneColor="#F79E1B"
          style={{
            fontSize: "72px",
            color: "#F9A825",
            zIndex: 3,
          }}
        />
      </div>

      <h2 className="confirmation-modal-text">{message}</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "10px",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <CustomButton
          type="primary"
          variant="black"
          key="button_yes"
          onClick={onConfirm}
          loading={isConfirmLoading}
        >
          {confirmText}
        </CustomButton>

        <CustomButton
          type="primary"
          variant="light"
          key="button_no"
          onClick={onClose}
        >
          {closeText}
        </CustomButton>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
