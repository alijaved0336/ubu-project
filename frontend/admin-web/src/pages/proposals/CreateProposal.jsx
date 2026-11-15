import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import { Button, Typography, Row, Col, Input, message } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../application-wide/axios/axios-instance";
import TabsLayout from "../../components/InfluencerTabs/tabLayout";
import "./CreateProposal.css"; // Custom CSS
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import { CustomButton, UBUInput } from "@src/components";

const { Title } = Typography;

const CreateProposal = ({ proposal, isEditMode }) => {
  const [editorContent, setEditorContent] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [message, setMessage] = useState("Document Saved Successfully");
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  useEffect(() => {
    if (isEditMode && proposal) {
      setEditorContent(proposal.body);
      setName(proposal.name);
    }
  }, [isEditMode, proposal]);

  const handleSave = async () => {
    const proposalData = {
      name,
      body: editorContent,
      status: "published",
    };

    try {
      setLoading(true);
      const response = isEditMode
        ? await axiosInstance.put(`/proposals/${proposal.id}`, proposalData)
        : await axiosInstance.post("/proposals/create", proposalData);
      setLoading(false);
      setMessage(
        isEditMode
          ? "Proposal updated successfully!"
          : "Proposal saved successfully!"
      );
      setIsModalVisible(true);
    } catch (error) {
      message.error("Error saving proposal: " + error.response.data.message);
    }
  };

  const handleDraft = async () => {
    const proposalData = {
      name,
      body: editorContent,
      status: "draft",
    };

    try {
      setDraftLoading(true);
      await axiosInstance.post("/proposals/create", proposalData);
      setDraftLoading(false);
      setMessage("Draft saved successfully!");
      setIsModalVisible(true);
    } catch (error) {
      message.error("Error saving draft: " + error.response.data.message);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigate("/dashboard/proposals");
  };

  return (
    <div className="create-proposal-container">
      <UBUBreadCrumb
        items={[
          { title: "Dashboard" },
          { title: <NavLink to="/dashboard/proposals">Proposals</NavLink> },
          { title: isEditMode ? "Edit" : "Create" },
        ]}
      />

      <Title level={3} className="proposal-title">
        {isEditMode ? "Edit Proposal" : "Create Proposals"}
      </Title>

      <div className="proposal-back-container">
        <CustomButton onClick={handleBack} className="back-proposal-button">
          Back
        </CustomButton>
      </div>

      {/* Name input field */}
      <Row gutter={16} style={{ marginBottom: "16px" }}>
        <Col span={24}>
          <UBUInput
            placeholder="Enter proposal name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="proposal-input"
          />
        </Col>
      </Row>

      {/* Editor */}
      <Row gutter={16}>
        <Col span={24}>
          <ReactQuill
            value={editorContent}
            onChange={setEditorContent}
          />
        </Col>
      </Row>

      {/* Buttons */}
      <Row justify="end" className="button-row">
        <Col>
          <CustomButton
            type="default"
            onClick={handleDraft}
            className="draft-button"
            loading={draftLoading}
          >
            Draft
          </CustomButton>
          <CustomButton
            type="primary"
            onClick={handleSave}
            className="save-proposal-button"
            loading={loading}
          >
            {isEditMode ? "Update" : "Save"}
          </CustomButton>
        </Col>
      </Row>
      {isModalVisible && (
        <SuccessModal onClose={handleCloseModal} message={message} />
      )}
    </div>
  );
};

export default CreateProposal;
