import PropTypes from "prop-types";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { Text } from "@src/components";
import { Flex } from "antd";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const BackToPreviousPageSegment = ({ calledFrom, searchTerm="", parentData={} }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBackClick = () => {
    if(parentData && parentData?.segmentId && parentData?.name == 'FilteredInfluencer'){
      navigate(`/dashboard/segments/${parentData.segmentId}/influencers`, {state: {searchTerm: searchTerm}});
    }else{
      navigate(-1);
    }
  };

  return (
    <Flex className="tw-justify-between">
      <Text className="fs-24 fw-700">
        { calledFrom === 'brand' ? 'Brand' : 'Influencer'} Profile
      </Text>
      <button onClick={handleBackClick} className="segment-back-button tw-gap-2">
        <ArrowLeftOutlined />
        {t("brand-profile-page.back-segment.back")}
      </button>
    </Flex>
  );
};

BackToPreviousPageSegment.propTypes = {
  calledFrom: PropTypes.string,
};


export default BackToPreviousPageSegment;
