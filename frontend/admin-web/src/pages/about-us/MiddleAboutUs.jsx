import React from "react";
import { Flex, Statistic, Collapse, Image, Grid, Typography } from "antd";
import AboutUsProfileOne from "../../assets/AboutUsProfileOne.png";
import AboutUsProfileTwo from "../../assets/AboutUsProfileTwo.png";
import "./middleaboutus.less";
import { Text as UBUText } from "@src/components";
const MiddleAboutUs = () => {
  const { Text } = Typography;
  const { Panel } = Collapse;
  return (
    <>
      <Flex vertical justify="center" align="center" className="MiddleAboutUs">
        <Text className="middle-description">
          UBU is an audacious, patent-pending platform that's flipping the
          influencer marketing industry on its head. By seamlessly connecting
          businesses, influencers, consumers, and AI, through a
          hyper-personalized and data-driven approach, UBU ditches out-dated
          status-quo in favor of AI, body scanning technology, and a
          decentralized model that empowers micro-influencers and revolutionizes
          the shopping experience.
        </Text>
        <Flex className="first-layer">
          <Flex
            vertical
            className="first-layer-section-1 gap-4"
            justify="center"
          >
            <Flex className="first-layer-heading">
              <Text className="first-layer-heading-text"> Our Vision</Text>
            </Flex>
            <Flex className="first-layer-description">
              <Text className="first-layer-description-text">
                UBU envisions a future where technology fuels authentic
                self-expression, unites like-minded communities, and simplifies
                e-commerce. By creating a more inclusive and personalized online
                experience, UBU aims to redefine how businesses, influencers,
                and consumers interact and thrive in the digital age.
              </Text>
            </Flex>
          </Flex>
          <Flex className="first-layer-profile">
            <img src={AboutUsProfileOne} />
          </Flex>
        </Flex>
        <Flex className="second-layer" align="start">
          <Flex className="second-layer-profile">
            <img src={AboutUsProfileTwo} />
          </Flex>
          <Flex
            vertical
            justify="center"
            gap={16}
            align="start"
            className="second-layer-section2"
          >
            <Text className="second-layer-section2-heading">
              The UBU Difference
            </Text>

            {/* <Flex className="second-layer-section2-list"> */}

            <div>
              <Text className="!tw-text-[1.25rem] tw-font-semibold !tw-font-manrope">
                Hyper-Personalization with AI
              </Text>
              <p className=" tw-text-base tw-leading-6 !tw-font-manrope">
                UBU’s cutting-edge AI integrates body measurements, style
                preferences, and lifestyle data to deliver hyper-personalized
                shopping recommendations. This precision creates a shopping
                experience that feels tailor-made, outperforming competitors
                with unmatched accuracy and relevance.
              </p>
              <div className=" tw-mt-6">
                <Text className="!tw-text-[1.25rem] tw-font-semibold !tw-font-manrope">
                  Group Shopping Made Simple
                </Text>
                <p className=" tw-text-base tw-leading-6 !tw-font-manrope">
                  UBU reimagines shopping for families and partners with
                  innovative group profiles. Primary purchasers can confidently
                  shop for everyone, using detailed size and preference data.
                  Whether it’s finding the perfect-fitting pants for a child or
                  a unique fit for a partner, UBU makes group shopping seamless
                  and stress-free.
                </p>
              </div>

              <div className=" tw-mt-6">
                <Text className="!tw-text-[1.25rem] tw-font-semibold !tw-font-manrope">
                  Sustainable Commerce Innovation
                </Text>
                <p className=" tw-text-base tw-leading-6 !tw-font-manrope">
                  UBU is fiercely committed to sustainability, addressing the
                  staggering environmental impact of eCommerce returns. By
                  reducing size- and fit-related returns—which account for 52%
                  of apparel returns—UBU minimizes landfill waste and CO₂
                  emissions while helping brands boost profitability. Our
                  technology aligns environmental goals with business success.
                </p>
              </div>
            </div>
            {/* <Collapse accordion className="custom-collapse">
                <Panel header="Hyper-Personalization:" key="1">
                  <UBUText className="fs-16 fw-400">
                    UBU dives deep into consumer data, including body
                    measurements and style preferences, to deliver content,
                    recommendations, and offers that hit the mark. This blows
                    all competitors out of the water, providing unparalleled
                    body matching and detailed filtering options.
                  </UBUText>
                </Panel>
                <Panel header="Empowering Micro-Influencers:" key="2">
                  <UBUText className="fs-16 fw-400">
                    Empowering Micro-Influencers: UBU champions genuine
                    micro-influencers whose small yet influential social circles
                    eclipse traditional "social followings." Their authentic
                    voices inspire, their recommendations drive action, and
                    their followers eagerly seek their fashion insights and
                    purchasing advice. These creators are motivated by passion,
                    not fame, finding in UBU a platform to authentically share
                    their creations. Whether expanding their influence or
                    keeping it local, these influencers share enthusiastically
                    to connect with like-minded individuals while earning a
                    meaningful income. This revolutionary model challenges
                    norms, embracing authenticity and individuality. Through
                    this approach, UBU gives businesses exclusive access to a
                    fresh, untapped pool of influencers armed with unparalleled
                    data insights that outshine any other platform.
                  </UBUText>
                </Panel>
                <Panel header="Group Profiles:" key="3">
                  <UBUText className="fs-16 fw-400">
                    At UBU, we understand that shopping isn't just an individual
                    experience—it's about catering to the needs of families and
                    partners alike. With our innovative group profiles, primary
                    purchasers can now shop confidently for the entire family,
                    leveraging detailed size and preference information. Imagine
                    a parent finding the perfect-fitting pants for their child
                    with the help of doppelgangers who have children of the same
                    age. Similarly, partners with unique body types, like broad
                    shoulders, can finally discover clothing that fits
                    comfortably.
                  </UBUText>
                </Panel>
                <Panel header="Community-Powered Commerce:" key="4">
                  <UBUText className="fs-16 fw-400">
                    UBU thrives on community. Users from diverse backgrounds and
                    cultures can now discover their tribe—people they genuinely
                    connect with and find inspiration from—unlike the uniformity
                    often seen on other platforms.
                  </UBUText>
                </Panel>
                <Panel header="AI-Driven Innovation:" key="5">
                  <UBUText className="fs-16 fw-400">
                    UBU takes AI to the next level, streamlining influencer
                    matching and campaign management, and powering up users with
                    AI-driven content creation tools.
                  </UBUText>
                </Panel>
                <Panel header="Commitment to Inclusivity:" key="6">
                  <UBUText className="fs-16 fw-400">
                    UBU doesn't just talk diversity—it lives it. By providing a
                    platform for all body types, abilities, ages, and styles,
                    UBU ensures a broader representation and caters to a diverse
                    customer base.
                  </UBUText>
                </Panel>
                <Panel header="Environmental Sustainability:" key="7">
                  <UBUText className="fs-16 fw-400">
                    UBU is fiercely committed to minimizing the environmental
                    footprint of eCommerce. With poor fit accounting for 52% of
                    clothing returns, and eCommerce returns in the US alone
                    generating 5 billion pounds of landfill waste and 15 million
                    tons of carbon emissions annually (Vogue Business), UBU
                    recognizes that reducing fit- and size-related returns not
                    only supports sustainability initiatives but also enhances
                    brands' profitability
                  </UBUText>
                </Panel>
              </Collapse> */}
            {/* </Flex> */}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default MiddleAboutUs;
