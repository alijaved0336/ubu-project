import PropTypes from "prop-types";
import "./CustomTag.less";

import { Tag } from "antd";

const CustomTag = ({ tag, icon, handleClick }) => {
  return (
    <Tag
      icon={icon}
      onClick={handleClick ? (event) => handleClick(tag, event) : undefined}
      className="custom-tag custom-tag-item"
      style={{ color: "black", fontWeight: "bold" }}
    >
      {tag.tagName}
    </Tag>
  );
};

CustomTag.propTypes = {
  icon:PropTypes.node,
  tag: PropTypes.object,
  handleClick: PropTypes.func,
};

export default CustomTag;