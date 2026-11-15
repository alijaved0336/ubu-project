import { Tag } from "antd";
import propTypes from "prop-types";

import "./Tag.less";

function UBUTag({ text, varient = "gray" }) {
  return <Tag className={`UBUTag ${varient}`}>{text}</Tag>;
}

UBUTag.propTypes = {
  text: propTypes.string,
  varient: propTypes.oneOf(["green", "orange", "gray"]),
};

export default UBUTag;
