import { Button, Flex } from "antd";
import "./index.less";

function CustomButton({ text, type = "button" }) {
  return (
    <Button type={type} className="custom-btn">
      <span className="custom-btn-lg-text">{text}</span>
    </Button>
  );
}
export default CustomButton;
