import { Flex } from "antd";
import "./index.less";

function StoreButton({ smallText, largeText, imgSrc, handleClick }) {
  return (
    // <a  className="a-social-btn" href={largeText.toLowerCase().includes('google') ? 'https://play.google.com/store/games?hl=en&pli=1' : 'https://www.apple.com/store'} target='_blank' rel="noopener noreferrer">

    <Flex
      className="social-btn"
      align="center"
      justify="flex-start"
      // gap={1}
      onClick={handleClick}
    >
      <Flex className="store-img">
        <img alt="store" src={imgSrc} style={{borderRadius:"40px"}} />
      </Flex>
      <Flex vertical>
        <Flex>
          <span className="btn-sml-text ff-manrope">{smallText}</span>
        </Flex>
        <Flex>
          <span className="btn-lg-text ff-manrope">{largeText}</span>
        </Flex>
      </Flex>
    </Flex>
    // </a>
  );
}
export default StoreButton;
