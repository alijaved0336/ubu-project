import { Text } from "@src/components";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ReviewStatusMessage = ({ isDeadlinePassed }) => {
  const navigate = useNavigate();
  const onCampaignClick = () => {
    navigate("/dashboard/proposals?tab=3");
  };
  return (
    <div className="fs-12">
      {isDeadlinePassed ? (
        <Text className="fs-12">
          The campaign acceptance deadline has passed.
        </Text>
      ) : (
        <Text className="fs-12">
          Please submit your pending reviews first by visiting your
          <span
            style={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => onCampaignClick()}
          >
            Campaigns
          </span>
        </Text>
      )}
    </div>
  );
};

ReviewStatusMessage.propTypes = {
  isDeadlinePassed: PropTypes.bool,
};
export default ReviewStatusMessage;
