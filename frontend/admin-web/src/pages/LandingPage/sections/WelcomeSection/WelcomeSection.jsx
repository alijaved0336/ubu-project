import { Collapse, Flex, Typography } from "antd";
import HeadingUnder from "@src/assets/heading-under.png";
import Icon1 from "@src/assets/btn1-icon.svg";
import Icon2 from "@src/assets/btn2-icon.svg";
import IntroVideoBg from "@src/assets/IntroVideoBg.png";

import "./WelcomeSection.less";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "@src/components";
import { Heading } from "@src/components/Common/Typography";
import NavigateToIOSModal from "@src/components/Modals/NavigateToIOSModal";
import { useState } from "react";
import ReactImage from "@src/components/Common/ReactImage/ReactImage";

function WelcomeToUbu() {
  const { t } = useTranslation();
  const { Text } = Typography;
  const navigate = useNavigate();
  const { Panel } = Collapse;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const faqs = [
    {
      heading: "Hyper-Personalized Influencer Matching",
      description:
        "Leverage UBU&apos;s AI-powered matching algorithm to connect with influencers whose audiences perfectly align with your brand&apos;s target market, ensuring highly effective and impactful marketing campaigns",
    },
    {
      heading: "Access to Authentic Micro-Influencers",
      description:
        "Tap into a diverse pool of nano and micro-influencers who offer genuine connections and higher engagement rates, giving your brand a fresh and relatable voice in the market.",
    },
    {
      heading: "Streamlined Campaign Management",
      description:
        "Simplify your influencer marketing efforts with UBU&apos;s comprehensive tools for campaign creation, contract management, and performance tracking, saving time and resources while maximizing ROI.",
    },
    {
      heading: "Enhanced Accountability and Transparency",
      description:
        "Benefit from UBU&apos;s double-blind review system and responsiveness tracker, which ensure reliable and transparent collaborations, building trust and fostering long-term partnerships.",
    },
  ];

  return (
    <Flex
      vertical
      gap={"4rem"}
      align="center"
      justify="center"
      className="p-div-welcome"
    >
      <Flex vertical gap="4rem" className="p-div-welcome-div">
        <Flex gap={5} className="welcome-1" justify="center" align="center">
          <Flex className="welcome-1-1" justify="center" align="center">
            <Text className="flex-text-welcome">
              {t("landing-page.welcome.heading")}
            </Text>
          </Flex>
          <Flex vertical className="welcome-1-2">
            <Flex className="welcome-1-2-1">
              <Text className="flex-text-welcome text-green ff-classy">
                {t("landing-page.welcome.heading-2")}
              </Text>
            </Flex>
            <Flex className="welcome-1-2-2">
              <img
                src={HeadingUnder}
                alt="img-under"
                className="heading-under-img-welcome"
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex
          className="welcome-11 xl:tw-max-w-[78rem] tw-mx-auto tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-3"
          gap="middle"
        >
          <CustomButton
            icon={<img src={Icon1} />}
            onClick={() => navigate("/registration/")}
            variant={"black xl"}
          >
            UBU Bussiness
          </CustomButton>
          <CustomButton
            icon={<img src={Icon2} />}
            onClick={() => navigate("/registration/")}
            variant={"default xl"}
          >
            UBU Creator
          </CustomButton>
          <CustomButton
            icon={<img src={Icon2} />}
            onClick={() => setIsModalVisible(true)}
            variant={"default xl"}
          >
            UBU Shopper
          </CustomButton>
        </Flex>
      </Flex>
      <Flex className="welcome-video" gap={50} align="flex-start">
        <Flex className="welcome-video-section">
          <ReactImage
            containerClassName="tw-w-full"
            className="welcome-video-player tw-w-full tw-aspect-[35/22] tw-rounded-xl"
            src={IntroVideoBg}
            blurHash="LPCss{Q,8^?wT1t6$yWBZ$b_SgQ-"
          />
        </Flex>
        <Flex
          vertical
          justify="center"
          gap={16}
          align="start"
          className="welcome-text-section"
        >
          <Text className="welcome-heading">UBU Business</Text>
          <Text className="welcome-desc ff-manrope">
            Discover what sets UBU apart from the competition and how we will
            help your business.{" "}
          </Text>
          <Flex className="welcome-list">
            <Collapse accordion className="custom-collapse tw-font-manrope">
              {faqs.map((faq, index) => {
                return (
                  <Panel
                    key={`${faq.heading}-${index}`}
                    header={
                      <Heading level={6} className="tw-font-bold ff-manrope">
                        {faq.heading}
                      </Heading>
                    }
                    className="tw-text-base"
                  >
                    <p className="ff-manrope">{faq.description}</p>
                  </Panel>
                );
              })}
            </Collapse>
          </Flex>
        </Flex>
      </Flex>
      <NavigateToIOSModal
        key={isModalVisible}
        isOpen={isModalVisible}
        setIsOpen={setIsModalVisible}
      />
    </Flex>
  );
}

export default WelcomeToUbu;
