import React, { useState, useEffect } from "react";
import { Table, Typography, Button, Space, message, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../application-wide/axios/axios-instance";
import "./ProposalTable.css"; // Custom CSS
import { showNotification } from "@src/utils/showNotification";
import { isSuccess } from "@src/utils/responseHelpers";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";

const { Title } = Typography;

const ProposalIndex = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingKeys, setLoadingKeys] = useState([]);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axiosInstance.get("/proposals");
        setProposals(response.data);
        setLoading(false);
      } catch (error) {
        message.error("Error fetching proposals: " + error.message);
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const handleEdit = (key) => {
    navigate(`/dashboard/proposals/edit/${key}`);
  };

  const handleDelete = async (key) => {
    setLoadingKeys((prevKeys) => [...prevKeys, key]);
    try {
      const res = await axiosInstance.delete(`/proposals/${key}`);
      if (isSuccess(res.status)) {
        showNotification({
          notificationType: "success",
          message: "Successfully Deleted",
          description: "Proposal deleted successfully",
        });
        setProposals(proposals.filter((proposal) => proposal.id !== key));
      } else {
        showSegmentDeletionError();
      }
      // message.success('Proposal deleted successfully!');
    } catch (error) {
      showSegmentDeletionError();
      // message.error('Error deleting proposal: ' + error.message);
    } finally {
      setLoadingKeys((prevKeys) => prevKeys.filter((k) => k !== key));
    }
  };

  const showSegmentDeletionError = () => {
    showNotification({
      notificationType: "error",
      message: "Something went wrong",
      description: "Proposal deletion failed",
    });
  };

  const handleCreate = () => {
    navigate("/dashboard/proposals/create");
  };

  const columns = [
    {
      title: "Proposals Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "orange";
        if (status === "published") {
          color = "green";
        }
        return (
          <Tag
            color={color}
            style={{ borderRadius: "12px", padding: "2px 12px" }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
            style={{ color: "black" }}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
            style={{ color: "red" }}
            loading={loadingKeys.includes(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="proposal-container">
      <UBUBreadCrumb items={[{ title: "Dashboard" }, { title: "Proposals" }]} />

      <Title level={3} style={{ fontWeight: "bold" }}>
        Proposals
      </Title>
      <Button
        type="primary"
        onClick={handleCreate}
        className="create-proposal-button"
      >
        Create Proposal
      </Button>
      <Table
        dataSource={proposals}
        columns={columns}
        loading={loading}
        pagination={false}
        rowClassName="proposal-row"
      />
    </div>
  );
};

export default ProposalIndex;
