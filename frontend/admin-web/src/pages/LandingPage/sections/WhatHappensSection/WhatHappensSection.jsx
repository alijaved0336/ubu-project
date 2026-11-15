import { Flex, Typography } from "antd";
import HeadingUnder from "@src/assets/heading-under.png";

import { AI, ThumbsUp, Family } from "@src/assets/icons";

import "./WhatHappensSection.less";
import { useTranslation } from "react-i18next";

function WhatHappensSection() {
  const { t } = useTranslation();
  const { Text } = Typography;
  return (
    <>
      <Flex
        vertical
        align="center"
        justify="center"
        className="p-div-third"
        gap={"3.5rem"}
      >
        <Flex gap={5} className="third-1">
          <Flex className="third-1-1">
            <Text className="flex-text-third">
              {t("landing-page.third.heading")}
            </Text>
          </Flex>
          <Flex vertical className="third-1-2">
            <Flex className="third-1-2-1">
              <Text className="flex-text-third text-green">
                {t("landing-page.third.heading-2")}
              </Text>
            </Flex>
            <Flex className="third-1-2-2">
              <img src={HeadingUnder} className="heading-under-img-third" />
            </Flex>
          </Flex>
        </Flex>
        <Flex gap="large" align="start" className="third-2">
          <Flex
            className="third-2-1"
            gap="large"
            vertical
            align="center"
            justify="center"
          >
            <Flex>
              <AI />
            </Flex>
            <Flex>
              <Text className="flex-text-brand-third ff-manrope">
                {t("landing-page.third.shop-smarter.heading")}
              </Text>
            </Flex>
            <Flex>
              <Text className="flex-text-desc-third ff-manrope">
                {t("landing-page.third.shop-smarter.desc")}
              </Text>
            </Flex>
          </Flex>
          <Flex gap="large" vertical align="center" justify="center">
            <Flex>
              <ThumbsUp />
            </Flex>
            <Flex>
              <Text className="flex-text-brand-third ff-manrope">
                {t("landing-page.third.real-people.heading")}
              </Text>
            </Flex>
            <Flex>
              <Text className="flex-text-desc-third ff-manrope">
                {t("landing-page.third.real-people.desc")}
              </Text>
            </Flex>
          </Flex>
          <Flex gap="large" vertical align="center" justify="center">
            <Flex>
              <Family />
            </Flex>
            <Flex>
              <Text className="flex-text-brand-third ff-manrope">
                {t("landing-page.third.simplified.heading")}
              </Text>
            </Flex>
            <Flex>
              <Text className="flex-text-desc-third ff-manrope">
                {t("landing-page.third.simplified.desc")}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default WhatHappensSection;
