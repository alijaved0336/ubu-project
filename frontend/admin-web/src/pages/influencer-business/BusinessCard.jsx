import React, { memo, useEffect, useState } from "react";
import "./BusinessCard.less";
import axiosInstance from "../../application-wide/axios/axios-instance";
import { useNavigate } from "react-router-dom";

import "react-loading-skeleton/dist/skeleton.css";
import titleize from "titleize";
import SendMessageModal from "./SendMessageModal";

import { Button } from "@src/components/Common/Widgets";
import cn from "@src/cn";
import { Avatar } from "antd";

const BusinessCard = ({ business, backgroundColor, potentialBrands }) => {
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState({
    potentialBrands: [],
  });

  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);

  const [isMarked, setIsMarked] = useState(
    businessData.potentialBrands &&
      businessData.potentialBrands.includes(business?.id)
      ? true
      : false
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const firstLetter = business?.brand_name?.charAt(0)?.toUpperCase();

  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  useEffect(() => {
    setBusinessData((prev) => ({ ...prev, potentialBrands }));
  }, [potentialBrands]);

  useEffect(() => {
    setIsMarked(
      businessData && businessData?.potentialBrands?.includes(business?.id)
    );
  }, [businessData, business]);

  const handleViewProfile = (id) => {
    navigate(`/dashboard/proposals/brand-profile/${id}`);
  };

  const handleMarkAsCandidate = async (brandId, mark) => {
    const formData = {
      brandId: brandId,
      isMarked: mark,
    };
    setButtonLoading(true);
    try {
      const response = await axiosInstance.post(
        `/influencer/mark_potential`,
        formData
      );

      setBusinessData((prev) => ({
        ...prev,
        potentialBrands: response?.data?.potentialBrands,
      }));
      // setIsMarked(!mark);
    } catch (error) {
      console.error("Error marking brand:", error);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleSendMessage = () => {
    setIsModalOpen(true);
    setSelectedBrandId(business?.id);
  };

  return (
    <div className="brand-card" id={business?.id} key={business?.id}>
      <div className="card-column">
        {business?.user?.avatar && !imageError ? (
          <img
            src={business?.user?.avatar}
            alt={business?.brand_name}
            onError={handleError}
            className="brand-avatar"
          />
        ) : (
          <div className="brand-avatar-fallback">
            <Avatar 
              style={{ 
                backgroundColor: 'rgb(176 175 174)', 
                height: '100%', 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                textAlign: 'center', 
                whiteSpace: 'normal', 
                wordBreak: 'break-word' 
              }}
            >
              {business.brand_name}
            </Avatar>          </div>
        )}
        <h3 className="brand-name">{titleize(business?.brand_name || "")}</h3>
      </div>

      <div className="description-column">
        <h3>Brand Description</h3>
        <p>
          {business?.description ?? "No description available at the moment."}
        </p>
      </div>

      <div className="stats-column">
        <div className="stats-column-row full-width">
          <div className="industry-column">
            <h3>Categories</h3>
            <p>
              {business?.user?.user_answer?.Category?.join(", ") ??
                "No Category mentioned by the brand."}
            </p>
          </div>
        </div>
        <div className="stats-column-row half-width">
          <div className="category-column">
            <h3>Follower Count</h3>
            <p>{business?.user?.user_answer?.Followers ?? "N/A"}</p>
          </div>
          <div className="audience-column">
            <h3>Region</h3>
            <p>{business?.user?.user_answer?.Region ?? "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="influencer-buttons-column">
        <Button
          onClick={() => handleViewProfile(business?.id)}
          className="tw-h-auto"
          type="primary"
          variant="outlined"
        >
          View Full Profile
        </Button>

        <Button
          onClick={() => handleMarkAsCandidate(business?.id, isMarked)}
          className={cn("tw-h-auto", {
            marked: isMarked,
          })}
          disabled={buttonLoading}
          isloaf
          loading={buttonLoading}
          type="primary"
          variant="outlined"
        >
          {isMarked ? "Un-Mark Potential" : "Mark as Potential"}
        </Button>
        <Button
          onClick={handleSendMessage}
          type="primary"
          variant="outlined"
          className="tw-h-auto"
        >
          Send Message
        </Button>
      </div>
      <SendMessageModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        brandId={business?.id}
      />
    </div>
  );
};

export default memo(BusinessCard);
