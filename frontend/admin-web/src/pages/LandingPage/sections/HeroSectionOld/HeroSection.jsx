import { Flex, Typography } from "antd";
import "./HeroSection.less";
import HeadingUnder from "@src/assets/heading-under.png";
import LandingMan from "@src/assets/landing-man.png";
import LandingMan2 from "@src/assets/man2.png";
import LandingMan3 from "@src/assets/man3.png";
import LandingMan4 from "@src/assets/man4.png";
import ImageCard from "@src/components/ImageCard";
import RightImageCard from "@src/components/ImageCard/RightSide";

function HeroSection() {
  const { Text } = Typography;

  return (
    <Flex gap="middle" justify="space-between" className="parent-div">
      <Flex className="flex-1">
        <div className="bg-landing"></div>
        <Flex className="bg-landing-wrapper">
          <Flex vertical className="bg-landing-1">
            <ImageCard
              className="image-2"
              imgSrc={LandingMan2}
              btnText="Consumers"
              align="end"
            />
            <ImageCard
              className="image-4"
              imgSrc={LandingMan4}
              btnText="AI Body Measurement"
              align="end"
            />
          </Flex>
          <Flex vertical align="end" className="bg-landing-2">
            <RightImageCard
              className="image-1"
              imgSrc={LandingMan}
              btnText="Brand Owners"
              align="start"
            />
            <RightImageCard
              className="image-3"
              imgSrc={LandingMan3}
              btnText="Creators"
              align="start"
            />
          </Flex>
        </Flex>
      </Flex>
      <Flex gap={8} className="flex-2">
        <Flex vertical className="heading-div">
          <Flex>
            <h1 className="heading-font">
              Connecting Brands,{" "}
              <span className="heading-creators">Creators,</span>
            </h1>
          </Flex>
          <Flex>
            <img
              src={HeadingUnder}
              height="inherit"
              width="inherit"
              className="heading-under-img"
            />
          </Flex>
          <Flex>
            <h1 className="heading-font2">& AI Shopping</h1>
          </Flex>
          <Flex>
            <Text type="secondary" className="subtext">
              Discover fashion, beauty, home, and fitness products, all tried
              and styled by real people for everyday living.
            </Text>
          </Flex>
          {/* <Flex>
            <Input size="large" placeholder="Search Products" className="search-input" prefix={<img src={SearchIcon} />} />
          </Flex> */}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default HeroSection;
