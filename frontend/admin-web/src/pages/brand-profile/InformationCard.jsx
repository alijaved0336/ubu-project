import PropTypes from "prop-types";
import LocationIcon from "@src/assets/icons/LocationIcon";
import LinkIcon from "@src/assets/icons/LinkIcon";
import Link from "antd/es/typography/Link";
import BrandInfoCardSkeleton from "@src/components/Skeletons/BrandInfoCardSkeleton";
// import DoubleTickIcon from "@src/assets/icons/DoubleTickIcon";

import { Flex, Image } from "antd";
import { Text } from "@src/components";
import { getRandomColor } from "@src/utils/commonFunctions";
import { useTranslation } from "react-i18next";

const InformationCard = ({ isInfoLoading, information, calledFrom }) => {
  const { t } = useTranslation();

  return (
    <div
      // align="flex-start"
      className="profile-card tw-gap-4 card"
    >
      {isInfoLoading ? (
        <BrandInfoCardSkeleton />
      ) : (
        <>
          <Flex className="tw-justify-between tw-w-full">
            <Flex
              className={`tw-gap-4 ${
                calledFrom === "influencer"
                  ? "tw-flex-col"
                  : "tw-flex-row tw-items-center"
              }`}
            >
              {information?.user.avatar ? (
                <Image
                  src={information?.user.avatar}
                  className="profile-image"
                  alt="Profile"
                  preview={false}
                />
              ) : (
                <div
                  className="brand-avatar-fallback"
                  style={{ backgroundColor: getRandomColor() }}
                >
                  {information?.brand_name?.charAt(0)?.toUpperCase() ||
                    information?.user.first_name.charAt(0)?.toUpperCase() +
                      information?.user.last_name.charAt(0)?.toUpperCase()}
                </div>
              )}
              <Text
                className={`fw-800 ${
                  calledFrom === "influencer" ? "fs-24" : "fs-44"
                } `}
              >
                {information?.brand_name ||
                  information?.user.first_name +
                    " " +
                    information?.user.last_name}
              </Text>
            </Flex>
            {/* <Flex align="center" justify="right">
              <Button
                className="tw-p-4 tw-h-10 fw-600"
                color="default"
                variant="filled"
                icon={<DoubleTickIcon />}
              >
                Following
              </Button>
              <CustomButton
                variant={"black"}
                className="contact-btn tw-p-4 tw-h-10 fw-500"
              >
                Follow
              </CustomButton>
            </Flex> */}
          </Flex>
          <Flex vertical gap={12} className="profile-details">
            {calledFrom === "brand" ? (
              <Text className="fs-16 fw-700">
                {t("brand-profile-page.info-card.about-us")}
              </Text>
            ) : (
              <></>
            )}

            <Text className="fs-14 tw-text-gray-slategray tw-leading-6">
              {information?.description || information?.bio}
            </Text>

            {/* <div>
              <Text className="tw-leading-6 fs-14 fw-700 tw-mr-2">
                Category:
              </Text>
              <Text className="tw-leading-6 fs-14 tw-text-black-60">
                Clothing, Clothing, Clothing, Clothing, Clothing, Clothing,
                Clothing, Clothing, Clothing, Clothing, Clothing,
              </Text>
            </div> */}

            <Flex align="center" gap={12}>
              <Flex align="center" gap={4}>
                <LocationIcon />
                <Text className="fs-14 tw-text-black-60">
                  {information?.user.city}, {information?.user.state}
                </Text>
              </Flex>
              <Flex align="center" gap={4}>
                <LinkIcon />
                {calledFrom === "brand" ? (
                  <Link
                    href={`${information?.company_website ?? ""}`}
                    target="_blank"
                  >
                    <Text className="fs-14 fw-500 tw-text-center">
                      {information?.company_website}
                    </Text>
                  </Link>
                ) : (
                  <Text className="fs-14 fw-500 tw-text-center">
                    {information?.user.email}
                  </Text>
                )}
              </Flex>
            </Flex>
          </Flex>
        </>
      )}
    </div>
  );
};

InformationCard.propTypes = {
  isInfoLoading: PropTypes.bool,
  information: PropTypes.object,
  calledFrom: PropTypes.string,
};

export default InformationCard;
