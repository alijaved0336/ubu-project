import { useState } from "react";
import { Flex, Typography } from "antd";
import "./DownloadOurAppSection.less";

import AppleLogo from "@src/assets/apple-logo.png";
import Ellips1 from "@src/assets/ellipse-1.png";
import Ellipse2 from "@src/assets/ellipse-2.png";
import Mobile from "@src/assets/mobile.png";
import StoreButton from "@src/components/SocialButtons";
import EmailCaptureModal from "@src/components/Modals/EmailCaptureModal";

function MiddleLandingPageComponent() {
  const { Text } = Typography;
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <Flex gap="middle" align="stretch" className="parent-div-middle">
      <EmailCaptureModal
        key={isModalVisible}
        isOpen={isModalVisible}
        setIsOpen={setIsModalVisible}
      />
      <Flex
        vertical
        className="parents"
        align="center"
        justify="center"
        gap="large"
      >
        <Flex className="parent-store-btns">
          <Text className="download-our-app">Download Our App</Text>
        </Flex>
        <Flex className="parent-store-btns2">
          <Text className="discover-text ff-manrope">
            Explore curated looks, shop your favorite brands, and find your new
            go-to style icons. Start exploring and unlock a world of
            possibilities.
          </Text>
        </Flex>
        <Flex gap="large" className="parent-store-btns">
          <Flex>
            <StoreButton
              smallText="Download on the"
              largeText="App Store"
              imgSrc={AppleLogo}
              handleClick={() => setIsModalVisible(true)}
            ></StoreButton>
          </Flex>
        </Flex>
      </Flex>
      <Flex className="container" justify="center">
        <Flex gap="large" className="ellipse-container">
          <Flex vertical justify="end" className="ellipse-c-2">
            <img src={Ellipse2} className="ellipse-img-2" />
          </Flex>
          <Flex vertical justify="start" className="ellipse-c-1">
            <img src={Ellips1} className="ellipse-img-1" />
          </Flex>
        </Flex>
        <Flex className="mob-container">
          <img src={Mobile} />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default MiddleLandingPageComponent;
