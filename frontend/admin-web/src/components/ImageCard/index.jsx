import { Button, Flex } from "antd";
import "./ImageCard.less";
import Img from "../../assets/img-btn-2.png";

function ImageCard({ imgSrc, className, btnText, align }) {
  return (
    <Flex style={{ position: "relative" }} vertical align={align}>
      <div className="main-container">
        <img src={imgSrc} className={`${className} `} />
      </div>
      <Flex
        style={{ position: "absolute", bottom: 0, right: 0 }}
        className="btn-container-1"
        align="start"
        justify="center"
      >
        <Button
          size="large"
          className="btn-container-1"
          icon={<img src={Img} />}
        >
          {btnText}
        </Button>
      </Flex>
    </Flex>
  );
}
export default ImageCard;
