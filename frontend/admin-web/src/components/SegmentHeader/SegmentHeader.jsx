import PropTypes from "prop-types";
import HeaderCardModal from "./HeaderCardModal";
import "./SegmentHeader.less";

import { Avatar, Grid } from "antd";
import { getInitials } from "@src/utils/formateFunctions";
import { Text } from "@src/components";
import { useSelector } from "react-redux";
import cn from "@src/cn";
import { Heading } from "../Common/Typography";
import { useEffect, useState } from "react";
import NeutralAvatar from "@src/assets/icons/neutralavatar.svg";
import { useGetUserQuery } from "@src/store/api/userApi";


const SegmentHeader = ({ brandLogo, summaryData }) => {

  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });


  const { isSidebarCollapsed } = useSelector((state) => state.settings || {});
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInputData, setModalInputData] = useState({});

  const handleCardClick = (data) => {
    setModalInputData(data);
    setIsModalOpen(!isModalOpen);
  };


  return (
    <div
      className={cn("segment-header", {
        collapsed: isSidebarCollapsed || screens.xs,
        "not-collapsed": !isSidebarCollapsed && !screens.xs,
      })}
    >
      <div className={cn("brand-logo")}>
        {
          brandLogo && brandLogo != '{}' ?
          (
            <img src={brandLogo} alt="Brand Logo" />
          )
          :
          (
            <Avatar style={{ backgroundColor: 'rgb(176 175 174)', height: '100%', width: '100%', fontSize: '20px' }}>{user?.brand?.brand_name}</Avatar>
          )
        }
      </div>
      <div className={cn("campaign-summary")}>
        <Heading level={5}>Campaign Influencers</Heading>

        <div className="summary-cards">
          {summaryData.map((data, index) => (
            <div
              key={index}
              className="summary-card"
              onClick={() => handleCardClick(data)}
            >
              <div className="summary-card-header">
                <Text className="fs-14 fw-500">{data.title}</Text>
                <Text className="fs-14 fw-400 text-gray-400">{data.count}</Text>
              </div>
              <div className="summary-influencers">
                {data.influencers.map((influencer, i) =>
                  influencer.profilePicture ? (
                    <img
                      key={i}
                      src={influencer.profilePicture}
                      alt={influencer.name}
                      className="influencer-photo"
                    />
                  ) : (
                    <div key={i} className="influencer-photo-placeholder">
                      {getInitials(influencer.name)}
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <HeaderCardModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalDataInput={modalInputData}
      />
    </div>
  );
};

SegmentHeader.propTypes = {
  brandLogo: PropTypes.string,
  summaryData: PropTypes.arrayOf(PropTypes.object),
};

export default SegmentHeader;
