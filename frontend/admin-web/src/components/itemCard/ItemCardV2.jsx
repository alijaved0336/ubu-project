import { Flex, Carousel } from "antd";

import "./ItemCardV2.less";

import { Text, Tag } from "@src/components";
import { Edit } from "@src/assets/icons";

function ItemCardV2({ item, handleView, handleEdit, type }) {
  const getStatusLabel = (status) => {
    switch (status) {
      case true:
      case "true":
      case 1:
      case "published":
        return <Tag varient="green" text="Published" />;
      case false:
      case "false":
      case 0:
      case "draft":
      default:
        return <Tag varient="orange" text="Draft" />;
    }
  };
  return (
    <Flex className="product-card-wrapper" onClick={() => handleView(item.id)}>
      <div className="slider-container">
        {item.media && item.media.length > 0 ? (
          <Carousel dots={true} autoplay>
            {item.media.map((media, index) => (
              <div key={index} className="carousel-media">
                {media.type === "video" ? (
                  <video controls>
                    <source src={media.url} type={`video/${media.extension}`} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={media.url} alt={item.name || item.title} />
                )}
              </div>
            ))}
          </Carousel>
        ) : (
          <Flex justify="center" align="center" style={{ height: "100%" }}>
            <Text className="fs-14 fw-400 text-center">No Media Available</Text>
          </Flex>
        )}
      </div>
      <Flex vertical className="meta-info-container">
        <Text className={"fs-18 fw-500 text-ellipsis"}>{item.name}</Text>
        <Text className={"fs-14 fw-400 text-gray-400 truncate-text"}>
          {item.description || item.body}
        </Text>
        <Flex className="tags-wrapper">
          {Array.isArray(item.tags) ? (
            item.tags.map((tag, index) => <Tag key={index} text={tag} />)
          ) : (
            <Text>No tags</Text>
          )}
        </Flex>
        <Flex className="meta-info">
          <Flex className="col color-box-wrapper">
            <Text className={"fs-14 fw-400 no-wrap-text"}>Colors:</Text>
            <Flex gap={2}>
              {item.colors && Object.keys(item.colors).length > 0 ? (
                Object.keys(item.colors).map((color_name) => (
                  <div key={color_name} className="color-circle">
                    <div
                      className="circle"
                      style={{
                        backgroundColor: item.colors[color_name],
                        border: "1px solid black",
                      }}
                      ref={(el) => {
                        if (el) {
                          const appliedColor =
                            window.getComputedStyle(el).backgroundColor;
                          // If the applied color is not visible (transparent or default), show the cross
                          if (
                            appliedColor === "rgba(0, 0, 0, 0)" ||
                            appliedColor === "transparent"
                          ) {
                            el.classList.add("no-color");
                          } else {
                            el.classList.remove("no-color");
                          }
                        }
                      }}
                      title={color_name} // Tooltip for color name
                    >
                      {/* Show cross only if the color didn't apply */}
                      <span className="cross">✕</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="color-circle no-color">
                  <span className="cross">✕</span>
                  <div className="tooltip">No Color</div>
                </div>
              )}
            </Flex>
          </Flex>
          <Flex className="col">
            <Text className={"fs-14 fw-400 no-wrap-text"}>
              Product Category:{" "}
            </Text>
            <Text className={"fs-14 fw-400 text-gray-400 no-wrap-text"}>
              {item.category.name}
            </Text>
          </Flex>
          <Flex className="col">
            <Text className={"fs-14 fw-400 no-wrap-text"}>Gender: </Text>
            <Text className={"fs-14 fw-400 text-gray-400 no-wrap-text"}>
              {item?.gender || "N/A"}
            </Text>
          </Flex>
          <Flex className="col">
            <Text className={"fs-14 fw-400 no-wrap-text"}>Sub Category: </Text>
            <Text className={"fs-14 fw-400 text-gray-400 no-wrap-text"}>
              {item.sub_category.name}
            </Text>
          </Flex>
          <Flex className="col">
            <Text className={"fs-14 fw-400 no-wrap-text"}>Styles: </Text>
            <Text className={"fs-14 fw-400 text-gray-400 no-wrap-text"}>
              {item?.style || "N/A"}
            </Text>
          </Flex>
          <Flex className="col">
            <Text className={"fs-14 fw-400 no-wrap-text"}>Size 1: </Text>
            <Text className={"fs-14 fw-400 text-gray-400 no-wrap-text"}>
              {item?.size || "N/A"}
            </Text>
          </Flex>
          <Flex className="col">
            <Text className={"fs-14 fw-400 no-wrap-text"}>Size 2: </Text>
            <Text className={"fs-14 fw-400 text-gray-400 no-wrap-text"}>
              {item?.size || "N/A"}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex vertical className="price-container">
        <Flex vertical align="end" gap={12}>
          <Flex gap={4}>
            <Text className={"fs-24 fw-600 no-wrap-text"}>
              {item?.currency}
            </Text>
            <Text className={"fs-24 fw-600 no-wrap-text"}>{item?.price}</Text>
          </Flex>
          {getStatusLabel(item?.status)}
        </Flex>
        <Flex
          className="edit-button"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(item.id);
          }}
        >
          <Edit />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default ItemCardV2;
