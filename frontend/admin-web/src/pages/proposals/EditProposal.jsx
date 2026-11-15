import React, { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { Skeleton, Spin, message } from "antd";
import axiosInstance from "../../application-wide/axios/axios-instance";
import CreateProposal from "./CreateProposal"; // Assuming CreateProposal is in the same directory
import SmallLoader from "../../components/SmallLoader";
import "./EditProposal.less";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";

const EditProposal = () => {
  const { id } = useParams(); // Get proposal ID from the URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState(null);

  useEffect(() => {
    // Fetch the proposal details when the component loads
    const fetchProposal = async () => {
      try {
        const response = await axiosInstance.get(`/proposals/${id}`);
        setProposal(response.data); // Set the proposal data to state
        setLoading(false);
      } catch (error) {
        message.error(
          "Error fetching proposal: " + error.response.data.message
        );
        setLoading(false);
        navigate("/dashboard/proposals"); // Navigate back to the list if an error occurs
      }
    };

    fetchProposal();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="edit-proposal-container">
        <Skeleton.Node active style={{ width: 750, height: 600 }} />
      </div>
    );
  }

  return (
    <div>
      {/* Pass proposal and edit mode to CreateProposal component */}
      <CreateProposal proposal={proposal} isEditMode={true} />
    </div>
  );
};

export default EditProposal;
