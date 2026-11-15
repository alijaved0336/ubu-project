import PropTypes from "prop-types";
import Placeholder from "@src/assets/images/placeholder.jpg";
import NoData from "@src/components/NoData";
import SmallLoader from "@src/components/SmallLoader";

import { Flex, Image } from "antd";
import { Text } from "@src/components";
import { VirtuosoGrid } from "react-virtuoso";
import { forwardRef, useMemo } from "react";
import useScrollableElement from "@src/hooks/useScrollableElement";
import { useWindowSize } from "react-use";
import ReactImage from "@src/components/Common/ReactImage/ReactImage";
import ReactVideo from "@src/components/Common/ReactVideo/ReactVideo";

const ItemWrapper = ({ children, ...props }) => (
  <div
    {...props}
    style={{
      display: "flex",
      flex: 1,
      textAlign: "center",
      // padding: "1rem 1rem",
      // border: "1px solid gray",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

const ImagesGallery = ({ isImagesLoading, imagesGallery, calledFrom }) => {
  const { scrollContainer } = useScrollableElement();
  const { width } = useWindowSize();

  const gridComponents = useMemo(() => {
    // let width = "25";

    // if (width)
    return {
      // eslint-disable-next-line react/display-name
      List: forwardRef(({ style, children, ...props }, ref) => (
        <div
          ref={ref}
          {...props}
          style={{
            // display: "flex",
            // flexWrap: "wrap",
            ...style,
          }}
          className="tw-grid lg:tw-grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] tw-grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] md:tw-justify-items-start tw-justify-items-center tw-gap-6"
        >
          {children}
        </div>
      )),
      Item: ({ children, ...props }) => (
        <div
          {...props}
          style={{
            width: "100%",
            height: "100%",
            // boxSizing: "border-box",
          }}
        >
          {children}
        </div>
      ),
    };
  }, []);

  const EmptyPlaceholder = useMemo(() => {
    const EmptyPlaceholder = () => (
      <NoData
        isMessage
        message={`No ${
          calledFrom === "brand" ? "product" : "influencer"
        } images available ${calledFrom === "brand" ? "for this brand" : ""}`}
      />
    );

    return EmptyPlaceholder;
  }, [calledFrom]);

  return (
    <Flex vertical>
      <Text className="fs-20 fw-700">
        {calledFrom === "brand" ? "Product Images" : ""}
      </Text>
      <div className="image-gallery">
        <div className="profile-page-images">
          {isImagesLoading ? (
            <SmallLoader />
          ) : (
            <>
              {imagesGallery.length > 0 ? (
                <VirtuosoGrid
                  customScrollParent={scrollContainer}
                  totalCount={imagesGallery?.length}
                  components={gridComponents}
                  itemContent={(index) => {
                    const item = imagesGallery[index];

                    return (
                      <ItemWrapper key={index}>
                        {" "}
                        {["IMAGE", "image"].includes(
                          item.type || item.media_type
                        ) ? (
                          <ReactImage
                            preview={false}
                            src={item.url || item.media_url}
                            alt="media"
                            placeholder={item.placeholder}
                            rootClassName="tw-w-full tw-h-full"
                            className="!tw-w-full !tw-h-full tw-aspect-square tw-object-cover"
                            fallback={Placeholder}
                            loading="lazy"
                          />
                        ) : (
                          <ReactVideo
                            mediaContainerClassName="tw-w-full tw-h-full"
                            className="tw-w-full tw-h-full tw-object-cover tw-aspect-square"
                            url={item.url || item.media_url}
                          />
                          // <video
                          //   controls

                          // >
                          //   <source
                          //     src={item.url || item.media_url}
                          //     type="video/mp4"
                          //   />
                          //   Your browser does not support the video tag.
                          // </video>
                        )}
                      </ItemWrapper>
                    );
                  }}
                />
              ) : (
                <NoData
                  isMessage
                  message={`No ${
                    calledFrom === "brand" ? "product" : "influencer"
                  } images available ${
                    calledFrom === "brand" ? "for this brand" : ""
                  }`}
                />
              )}
            </>
          )}
        </div>
      </div>
    </Flex>
  );
};

ImagesGallery.propTypes = {
  isImagesLoading: PropTypes.bool,
  imagesGallery: PropTypes.array,
  calledFrom: PropTypes.string,
};

export default ImagesGallery;
