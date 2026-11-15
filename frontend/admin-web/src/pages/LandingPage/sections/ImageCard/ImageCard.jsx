import { Button } from "antd";
import propTypes from "prop-types";
import "./ImageCard.less";
import ReactImage from "@src/components/Common/ReactImage/ReactImage";
import cn from "@src/cn";
import PropTypes from "prop-types";
function ImageCard({ className, imgSrc, btnText, btnAlign, iconImg, hash }) {
  return (
    <div className="ImageCard">
      <ReactImage src={imgSrc} className={cn(className)} blurHash={hash} />
      {/* <img src={imgSrc} className={className} /> */}
      <Button
        icon={<img src={iconImg} />}
        className={`img-button ${btnAlign} ff-manrope`}
      >
        {btnText}
      </Button>
    </div>
  );
}

ImageCard.propTypes = {
  className: propTypes.string,
  imgSrc: propTypes.string,
  btnText: propTypes.string,
  btnAlign: propTypes.string,
  iconImg: propTypes.string,
  hash: PropTypes.string,
};

export default ImageCard;
