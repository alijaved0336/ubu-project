import { AppleOutlined } from "@ant-design/icons";
import SmallLoader from "../SmallLoader";
import "./index.less";

import { Button, Flex } from "antd";

function WhiteStoreButton({
  handleClick,
  largeText,
  imgSrc,
  isLoading = false,
  ...rest
}) {
  return (
    <Flex
      gap="small"
      className="white-social-container"
      align="center"
      justify="center"
    >
      <Button
        onClick={handleClick}
        className="white-social-btn"
        disabled={largeText === "Facebook"}
      >
        {imgSrc ? (
          largeText == "Apple" ? (
            <AppleOutlined style={{fontSize: '20px'}} className="apple-icon" />
          ) : (
            <Flex className="white-store-img">
              <img src={imgSrc} />
            </Flex>
          )
        ) : (
          <></>
        )}
        {!isLoading ? (
          <Flex vertical>
            <Flex>
              <span className="white-btn-lg-text ff-manrope">{largeText}</span>
            </Flex>
          </Flex>
        ) : (
          <>
          <SmallLoader height={30} width={30} /></>
        )}
      </Button>
    </Flex>
  );
}
export default WhiteStoreButton;
