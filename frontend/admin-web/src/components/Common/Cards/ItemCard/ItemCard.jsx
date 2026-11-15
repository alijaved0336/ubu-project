import { Badge, Card, Dropdown, Flex, Menu, Tooltip } from "antd";
import { Heading, Paragraph } from "@src/components/Common/Typography";
import styled from "styled-components";
// import cn from "@src/cn";

import PropTypes from "prop-types";

// import NewEditIcon from "@src/assets/icons/NewEditIcon";

import ItemCarousel from "../../Carousels/ItemCarousel/ItemCarousel";
import { useMemo } from "react";
import { getPrice } from "@src/utils/helpers";
import { EllipsisOutlined } from "@ant-design/icons";
import { Text } from "@src/components";

export const StyledItemCard = styled(Card)`
  &:hover {
    .slick-arrow {
      visibility: visible;
      width: 2rem;
      height: 2rem;
    }
  }
  .ant-card-head {
    padding-left: 0;
    padding-right: 0;
    border-bottom: unset;
  }
  .ant-card-body {
    padding: 0;
  }
  .ant-card-cover {
    /* margin-top: 1rem; */
    /* margin-bottom: 1rem; */

    img,
    video {
      border-radius: 8px 8px 0 0;
    }
  }
`;

const ItemCard = ({
  type,
  post,
  product,
  postProduct,
  onView,
  onEdit,
  onDelete,
}) => {
  const handleMediaChange = (urls) => {
    return (urls || [])?.map((url) => {
      // Extract the file extension from the URL
      const extension = url.split(".").pop().toLowerCase();

      return {
        url,
        type: "image",
        extension,
      };
    });
  };

  const { id, title, description, media, price, colors } = useMemo(
    () => ({
      id:
        type === "post"
          ? post?.id
          : type === "product"
          ? product?.id
          : postProduct?.id,
      title:
        type === "post"
          ? post?.title
          : type === "product"
          ? product?.name
          : postProduct?.title,
      description:
        type === "post"
          ? post?.body
          : type === "product"
          ? product?.description
          : postProduct?.description,
      price: type === "product" ? product?.price : "",
      media:
        type === "post"
          ? post?.media
          : type === "product"
          ? product?.media
          : handleMediaChange(postProduct?.images),
      colors: type === "product" ? product?.colors : "",

    }),
    [type, post, product, postProduct]
  );

  const menuItems = useMemo(() => {
    const items = [];

    if (onEdit) {
      items.push({
        key: "1",
        label: "Edit",
        onClick: (e) => {
          if (e) {
            e.domEvent.stopPropagation();
          }

          onEdit(id);
        },
      });
    }

    if (onDelete) {
      items.push({
        key: "2",
        label: "Delete",
        onClick: (e) => {
          if (e) {
            e.domEvent.stopPropagation();
          }

          onDelete(id);
        },
      });
    }
    return items;
  }, [onEdit, onDelete, id]);

  const menu = useMemo(() => <Menu items={menuItems} />, [menuItems]);

  return (
    <StyledItemCard
      onClick={() => onView && onView(id)}
      className="hover:tw-shadow-avatar tw-transition-all tw-duration-150 tw-w-full tw-max-w-md  tw-cursor-pointer tw-min-h-[500px]"
      cover={
        <div className="tw-relative">
          <ItemCarousel media={media} />

          {onEdit && (
            <Dropdown
              overlay={menu}
              placement="bottomRight"
              arrow
              trigger={["click"]}
              className="tw-absolute tw-top-2 tw-right-2 tw-flex tw-justify-center tw-items-center tw-bg-white tw-rounded-full tw-shadow-xl tw-w-8 tw-h-8"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="tw-absolute tw-top-2 tw-right-2 tw-flex tw-justify-center tw-items-center tw-bg-white tw-rounded-full tw-shadow-xl tw-w-8 tw-h-8"
              >
                <EllipsisOutlined style={{ fontSize: 24, cursor: "pointer" }} />
              </div>
            </Dropdown>
            // <div className="tw-bg-white tw-rounded-full tw-shadow-xl tw-w-8 tw-h-8 tw-absolute tw-top-2 tw-right-2 tw-flex tw-justify-center tw-items-center">
            //   <NewEditIcon
            //     onClick={(e) => {
            //       e.stopPropagation();
            //       onEdit(id);
            //     }}
            //   />
            // </div>
          )}
        </div>
      }
    >
      <div className="tw-space-y-4 tw-p-4 tw-mt-4 main-item-card">
        {type === "product" && (
          <Heading level={2} className="tw-text-center tw-font-manrope">
            {getPrice({ amount: price })}
          </Heading>
        )}
        <Heading
          level={5}
          className="tw-font-manrope tw-font-bold tw-cursor-pointer tw-line-clamp-2"
        >
          <Tooltip title={title}>
            <div>{title}</div>
          </Tooltip>
        </Heading>

        {type === "product" && (
          <Flex align="center" gap={8} wrap={false}>
            <Text strong>Colors:</Text>
            <Flex gap={4} align="center" wrap={false}>
              {colors && Object.keys(colors).length > 0 ? (
                Object.keys(colors).map((color_name) => (
                  <Tooltip key={color_name} title={color_name}>
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        backgroundColor: colors[color_name], // Directly using color
                        border: "1px solid black",
                        display: "inline-flex", // Fixes disappearing issue
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                  </Tooltip>
                ))
              ) : (
                <Tooltip title="No Color">
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: "1px solid #ccc",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "red",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    ✕
                  </span>
                </Tooltip>
              )}
            </Flex>
          </Flex>
        )}
        
        <Paragraph
          className="tw-font-manrope tw-text-gray-medium tw-max-h-40 tw-line-clamp-5 tw-text-sm"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </StyledItemCard>
  );
};

ItemCard.propTypes = {
  type: PropTypes.oneOf(["post", "product", "postProduct"]).isRequired,
  post: (props, propName, componentName) => {
    if (props.type === "post") {
      return PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        title: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        media: PropTypes.arrayOf(
          PropTypes.shape({
            url: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            extension: PropTypes.string,
          })
        ),
      })(props, propName, componentName);
    }
    return null; // No validation if type is not "post"
  },
  product: (props, propName, componentName) => {
    if (props.type === "product") {
      return PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        color: PropTypes.array.isRequired,
        media: PropTypes.arrayOf(
          PropTypes.shape({
            url: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            extension: PropTypes.string,
          })
        ),
        tags: PropTypes.arrayOf(PropTypes.string),
      })(props, propName, componentName);
    }
    return null; // No validation if type is not "product"
  },

  postProduct: (props, propName, componentName) => {
    if (props.type === "postProduct") {
      return PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.string),
        link: PropTypes.string,
      })(props, propName, componentName);
    }
    return null; // No validation if type is not "product"
  },
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
export default ItemCard;
