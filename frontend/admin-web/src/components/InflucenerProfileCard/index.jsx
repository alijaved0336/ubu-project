import { Flex, Typography } from "antd";
import "./InfluencerProfile.less";
import ReactImage from "../Common/ReactImage/ReactImage";

function InflucerProfileCard({ imgSrc, blurHash, username, btnText, align }) {
  const { Text } = Typography;
  return (
    <Flex
      vertical
      gap="small"
      justify="center"
      align="center"
      className="profile-container"
    >
      <Flex vertical align="center" className="profile-wrapper" gap={".5rem"}>
        <ReactImage
          src={imgSrc}
          blurHash={blurHash}
          className="tw-object-cover tw-w-full tw-h-auto"
          width={206}
          height={139}
          containerClassName="tw-w-full"
        />
        {/* <img src={imgSrc} className="flex-img" /> */}
        <Flex className="" align="start">
          <Text className="flex-text ff-manrope">@kennethtimothy</Text>
        </Flex>
        <Flex className="" align="start">
          <Text className="flex-measurement ff-manrope">
            HEIGHT: 5’3 SIZES: Small/4-6/27
          </Text>
        </Flex>
        <Text className="fs-10 text-muted ff-manrope">SHOP NOW</Text>
      </Flex>
    </Flex>
  );
}
export default InflucerProfileCard;
