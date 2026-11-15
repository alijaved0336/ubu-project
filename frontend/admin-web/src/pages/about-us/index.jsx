import { Flex, Typography } from "antd";
import FooterLayout from "../layouts/FooterLayout";
import LandingPageLayout from "../layouts/LandingPageLayout";
import GenericLayout from "../layouts/GenericLayout";
import HeadingUnder from "@src/assets/images/Vector 12.png";
import AI from "@src/assets/ai.png";
import Fashion from "@src/assets/fashion.png";
import Comfort from "@src/assets/comfort.png";
import "./about-us.less";
import MiddleAboutUs from "./MiddleAboutUs";

const AboutUs = () => {
  const { Text } = Typography;

  return (
    <LandingPageLayout>
      <FooterLayout>
        <Flex
          vertical
          className="aboutus-parent"
          justify="center"
          align="center"
        >
          <GenericLayout heading="About Us">
            <Flex
              className="aboutus-parent-1"
              justify="center"
              align="center"
              gap="large"
            >
              <Flex
                className="aboutus-welcome"
                justify="center"
                align="center"
                vertical
              >
                <Flex
                  gap={5}
                  className="aboutus-welcome-1"
                  justify="center"
                  align="center"
                >
                  <Flex
                    className="aboutus-welcome-1-1"
                    justify="center"
                    align="center"
                  >
                    <Text className="flex-text-welcome">Welcome to</Text>
                  </Flex>
                  <Flex vertical align="center" className="aboutus-welcome-1-2">
                    <Flex className="aboutus-welcome-1-2-1">
                      <Text className="flex-text-welcome ff-classy">UBU</Text>
                    </Flex>

                    <Flex className="aboutus-welcome-1-2-2">
                      <img
                        src={HeadingUnder}
                        alt="img-under"
                        className="heading-under-img-welcome"
                      />
                    </Flex>
                  </Flex>
                </Flex>
                <MiddleAboutUs />
                <Flex
                  className="aboutus-middle gap-8"
                  vertical
                  justify="center"
                  align="center"
                >
                  <Flex
                    className="gap-3"
                    justify="center"
                    align="center"
                    vertical
                  >
                    <Text className="aboutus-middle-heading ">Our Mission</Text>
                    <Text className="aboutus-middle-description ff-manrope">
                    UBU's mission is to shatter the status quo, giving consumers personalized shopping recommendations, and empowering all levels of content creators to monetize their unique style in a way that's never been done before.
                    </Text>
                  </Flex>
                  <Flex
                    justify="space-between"
                    gap="large"
                    className="aboutus-middle-2"
                  >
                    <Flex vertical className="aboutus-middle-2-1 gap-3">
                      <Text className="aboutus-middle-2-1-heading ff-manrope">
                        Brands
                      </Text>
                      <Text className="aboutus-middle-2-1-description ff-manrope">
                      UBU connects brands with authentic influencers through AI-driven matchmaking, helping brands reach audiences ready to engage and buy.
                      </Text>
                    </Flex>
                    <Flex vertical gap="small" className="aboutus-middle-2-1">
                      <Text className="aboutus-middle-2-1-heading ff-manrope">
                        Creators
                      </Text>
                      <Text className="aboutus-middle-2-1-description ff-manrope">
                      Why just follow when you can lead? Share your curations and earn money, no influencer-status required.
                      </Text>
                    </Flex>
                    <Flex vertical gap="small" className="aboutus-middle-2-1">
                      <Text className="aboutus-middle-2-1-heading ff-manrope">
                        Shoppers
                      </Text>
                      <Text className="aboutus-middle-2-1-description ff-manrope">
                      Create a group profile and add family members to unlock personalized recommendations for everyone, no matter their age, size, or style.
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex
                  className="aboutus-stats gap-8"
                  vertical
                  justify="center"
                  align="center"
                >
                  <Flex
                    className="gap-3"
                    justify="center"
                    align="center"
                    vertical
                  >
                    <Text className="aboutus-stats-heading">Our Technology</Text>
                    <Text className="aboutus-stats-description ff-manrope">
                    UBU's patent-pending technology is the backbone of its edgy platform. Key features include:
AI-Powered Body Scanning: Snap two photos, and let UBU's AI-powered body scanning technology work its magic, extracting measurements to create a comprehensive profile for personalized matching.
                    </Text>
                    <Text className="aboutus-stats-description ff-manrope">
                    Sophisticated Matching Algorithms: UBU's proprietary algorithms crunch a myriad of data points to connect users with influencers and products that align with their unique preferences, resulting in a highly personalized and efficient shopping experience.
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  className="aboutus-expertise gap-8"
                  vertical
                  justify="center"
                  align="center"
                >
                  <Flex
                    justify="center"
                    align="center"
                    gap="large"
                    className="aboutus-expertise-middle"
                  >
                    <Flex vertical className="aboutus-expertise-middle-1">
                      <img src={AI} className="flex-img" />
                    </Flex>
                    <Flex vertical className="aboutus-expertise-middle-1">
                      <img src={Fashion} className="flex-img" />
                    </Flex>
                    <Flex vertical className="aboutus-expertise-middle-1">
                      <img src={Comfort} className="flex-img" />
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </GenericLayout>
          {/* <Flex  justify="center" align="center"> */}
          {/* </Flex> */}
        </Flex>
      </FooterLayout>
    </LandingPageLayout>
  );
};
export default AboutUs;
