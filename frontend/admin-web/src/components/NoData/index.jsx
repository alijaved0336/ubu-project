import PropTypes from "prop-types";

import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Text } from "@src/components";

const NoData = ({
  onClick,
  componentName,
  isMessage,
  message,
  noDataImageComponent,
}) => {
  const headers = {
    segment: {
      header: "Add Segment Here",
      subHeader: "Enhance your search by inserting a new segment",
      buttonText: "Add Segment",
    },
    campaign: {
      header: "No Campaign Found",
      subHeader: "Create a segment to make campaigns",
      buttonText: "Add Segment",
    },
    product: {
      header: "No Product Found",
      subHeader: "",
      buttonText: "Add Product",
    },
    post: {
      header: "No Post Found",
      subHeader: "Create a post to reach more audience",
      buttonText: "Create Post",
    },
    blog: {
      header: "Create Blog Here",
      subHeader: "Enhance your experience by creating a new blog",
      buttonText: "Create Blog",
    },
    whatsNew: {
      header: "Create New Feature Here",
      subHeader: "Enhance your experience by creating a new feature",
      buttonText: "Create Feature",
    },
    BodyScanCount: {
      header: "Initiate Body Scan Count",
      subHeader: "Enhance your experience by initiating body scan count",
      buttonText: "Initiate",
    },
  };

  return (
    <div className="tw-flex tw-justify-center tw-my-24">
      <div className="tw-flex tw-flex-col tw-gap-5 tw-items-center">
        {isMessage ? (
          <div className="tw-text-center tw-mt-3 fw-600 fs-14 tw-text-black-60 tw-flex tw-flex-col tw-gap-2">
            {noDataImageComponent && (
              <div className="tw-flex tw-justify-center">
                {noDataImageComponent}
              </div>
            )}
            {message}
          </div>
        ) : (
          <>
            <div className="tw-flex tw-flex-col tw-text-center">
              <Text className="fs-24 fw-600">
                {headers[componentName].header}
              </Text>
              <Text className="tw-mt-3 fw-600 fs-14 tw-text-black-60">
                {headers[componentName].subHeader}
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onClick}
              className="gray-color tw-w-36"
            >
              {headers[componentName].buttonText}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

NoData.propTypes = {
  onClick: PropTypes.func,
  componentName: PropTypes.string,
  message: PropTypes.string,
  isMessage: PropTypes.bool,
  noDataImageComponent: PropTypes.node,
};

export default NoData;
