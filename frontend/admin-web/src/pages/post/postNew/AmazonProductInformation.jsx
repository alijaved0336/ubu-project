import PropTypes from "prop-types";
import MediaPreview from "@src/components/Campaign/MediaPreview";
import './AmazonProductInformation.less';

import { Skeleton } from "antd";

const AmazonProductInformation = ({
  media,
  setMedia,
  currentProduct,
  informationLoading,
  onAfiliateLinkMediaDelete,
}) => {
  return (
    <div>
      <div className="tw-overflow-y-auto scrollbar-hidden amazon-Product-Information">
        <div className="input-group full-width">
          {informationLoading ? (
            <Skeleton.Button block active size="large" />
          ) : (
            <h3 className="tw-font-bold">{currentProduct?.title}</h3>
          )}
        </div>
        <div className="input-group full-width textarea-group">
          {informationLoading ? (
            <div className="tw-flex tw-flex-col tw-gap-4">
              <Skeleton.Button block active size="large" />
              <Skeleton.Button block active size="large" />
            </div>
          ) : (
            <p>{currentProduct?.description}</p>
          )}
        </div>

        <h2 className="tw-font-bold">Price: ${currentProduct?.price}</h2>

      </div>

      <div>
        <MediaPreview
          isLoading={informationLoading}
          media={media || []}
          setMedia={setMedia}
          onMediaDelete={onAfiliateLinkMediaDelete}
          optionalTitle={"Affiliate Media Preview"}
        />
      </div>
    </div>
  );
};

AmazonProductInformation.propTypes = {
  media: PropTypes.array,
  setMedia: PropTypes.func,
  currentProduct: PropTypes.object,
  informationLoading: PropTypes.bool,
  onAfiliateLinkMediaDelete: PropTypes.func,
};

export default AmazonProductInformation;
