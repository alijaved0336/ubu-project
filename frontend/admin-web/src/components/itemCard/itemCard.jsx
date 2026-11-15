import React from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Tag, Tooltip, Carousel, Row, Col } from "antd";
import "./ItemCard.css";

const { Meta } = Card;

const ItemCard = ({ item, handleView, handleEdit, type }) => {
  const getStatusLabel = (status) => {
    switch (status) {
      case true:
      case "true":
      case 1:
      case "published":
        return <Tag color="green">Published</Tag>;
      case false:
      case "false":
      case 0:
      case "draft":
      default:
        return <Tag color="orange">Draft</Tag>;
    }
  };

  return (
    <Card hoverable className="item-card">
      <Row className="item-row" gutter={24}>
        <Col xs={24} sm={6} md={4} className="item-image">
          {item.media && item.media.length > 0 ? (
            <Carousel dots={true} autoplay>
              {item.media.map((media, index) => (
                <div key={index} className="carousel-media">
                  {media.type === "video" ? (
                    <video controls>
                      <source
                        src={media.url}
                        type={`video/${media.extension}`}
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={media.url} alt={item.name || item.title} />
                  )}
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="no-image">No Media Available</div>
          )}
        </Col>
        <Col xs={24} sm={12} md={16} className="item-details">
          <Meta
            title={item.name || item.title}
            description={
              <div>
                <p>{item.description || item.body}</p>
                {type === "product" && (
                  <>
                    <div className="tags-container">
                      {Array.isArray(item.tags)
                        ? item.tags.map((tag, index) => (
                            <Tag key={index}>{tag}</Tag>
                          ))
                        : "No tags"}
                    </div>
                    <div className="additional-info">
                      <div className="additional-info">
                        <div className="colors-container">
                          <span>Colors: </span>
                          {item.colors &&
                          Object.keys(item.colors).length > 0 ? (
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
                                        window.getComputedStyle(
                                          el
                                        ).backgroundColor;
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
                        </div>
                      </div>

                      <span>Category: {item.category.name}</span>
                      <span>Subcategory: {item.sub_category.name}</span>
                    </div>
                  </>
                )}
                {type === "post" && item?.postProduct && item?.postProduct?.length > 0 &&(
                  <div className="additional-info">
                    <span>
                      Associated Products:{" "}
                      {item.postProduct.map((productItem) => (
                        <Tag key={productItem.product.id}>
                          {productItem.product.name}
                        </Tag>
                      ))}
                    </span>
                  </div>
                )}
              </div>
            }
          />
        </Col>
        <Col xs={24} sm={6} md={4} className="item-right-side">
          {type === "product" && (
            <div className="item-price-status">
              <div className="item-price">
                {item.currency} {item.price}
              </div>
              <div className="item-status">{getStatusLabel(item.status)}</div>
            </div>
          )}
          <div className="item-actions">
            <Tooltip title="View">
              <EyeOutlined onClick={() => handleView(item.id)} />
            </Tooltip>
            <Tooltip title="Edit">
              <EditOutlined
                className="edit-icon"
                onClick={() => handleEdit(item.id)}
              />
            </Tooltip>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ItemCard;
