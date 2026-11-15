import { useState } from "react";
import { Flex } from "antd";
import { CustomButton, Text } from "@src/components";
import StraightArrows from "@src/assets/straight-arrows.svg";
import AiImage from "@src/assets/ai-image.png";
import HeadingUnder from "@src/assets/images/Vector 12.png";
import GrayArrow from "@src/assets/gray-arrow.svg";
import Container from "@src/components/Common/Container/Container";
import { Collapse } from "antd";
import Icon1 from "@src/assets/btn1-icon.svg";
import Icon2 from "@src/assets/btn2-icon.svg";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import NavigateToIOSModal from "@src/components/Modals/NavigateToIOSModal";
import ReactImage from "@src/components/Common/ReactImage/ReactImage";

const StyledCollapse = styled(Collapse)`
  .ant-collapse-arrow {
    svg {
      /* width: 20px;
      height: 20px; */
      font-weight: 600;
      font-size: 1.125rem;
    }
  }
`;
const mission = `
  Our mission is to transform the shopping experience into a
  celebration of individuality and self-expression. UBU empowers
  you to find what makes you feel confident, valued, and
  authentically you—because when we change ourselves for the
  better, we inspire the world to do the same.
`;
const vision = `
  We believe that when everyone feels empowered to embrace their
  uniqueness, it creates a ripple effect of positivity and
  connection. UBU is here to help you express yourself, find your
  people, and shine your brightest.
`;
const differences = `
  UBU is the only platform that truly personalizes the shopping
  experience. By matching shoppers to creators using body scans,
  we make it easy to find styles that fit and flatter you. Our
  group shopping feature goes even further, letting you save the
  sizes and preferences of family and friends, so you can shop for
  loved ones with confidence. We also believe in supporting
  creators with an abundance mindset—they’re free to post
  anywhere, but UBU is the only platform that connects them
  directly with shoppers who share their body type and style. This
  builds lasting relationships that benefit both creators and
  shoppers: creators can offer long-term style advice, and
  shoppers enjoy personalized inspiration that’s tailored just for
  them. That’s what makes UBU different!
`;
const items = [
  {
    key: "1",
    headerClass:
      "tw-text-[1.25rem] tw-font-semibold tw-font-manrope tw-p-[0.5rem] tw-cursor-pointer tw-flex !tw-items-center",
    label: "OUR MISSION",

    children: (
      <p className="tw-text-[1.125rem] lg:tw-col-span-4 md:tw-col-span-3 tw-font-manrope tw-leading-[2rem] tw-flex tw-justify-center">
        {mission}
      </p>
    ),
  },
  {
    key: "2",
    label: "OUR VISION",
    headerClass:
      "tw-text-[1.25rem] tw-font-semibold tw-font-manrope tw-p-[0.5rem] tw-cursor-pointer tw-flex !tw-items-center",
    children: (
      <p className="tw-text-[1.125rem] lg:tw-col-span-4 md:tw-col-span-3 tw-font-manrope tw-leading-[2rem] tw-flex tw-justify-center">
        {vision}
      </p>
    ),
  },
  {
    key: "3",
    label: "UBU DIFFERENCES",
    headerClass:
      "tw-text-[1.25rem] tw-font-semibold tw-font-manrope tw-p-[0.5rem] tw-cursor-pointer tw-flex  !tw-items-center",
    children: (
      <p className="tw-text-[1.125rem] lg:tw-col-span-4 md:tw-col-span-3 tw-font-manrope tw-leading-[2rem] tw-flex tw-justify-center">
        {differences}
      </p>
    ),
  },
];
const WelcomeSection = () => {
  const navigate = useNavigate();
  const [changeSection, setChangeSection] = useState("mission");
  const onSectionsChanged = (section) => {
    setChangeSection(section);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <Container className="xl:tw-max-w-[78rem] tw-mx-auto lg:tw-px-4 xl:tw-px-0 cen">
      <div className=" tw-mt-20 tw-justify-center">
        <div className="tw-mb-[1.5rem] tw-flex tw-gap-5 tw-flex-wrap tw-justify-center">
          <Text className="tw-text-[1.875rem] sm:tw-text-[2.5rem] ff-classy lg:tw-text-[3.125rem] tw-font-normal tw-font-manrope tw-text-[#000000]">
            Welcome to
          </Text>
          <div className="tw-flex tw-justify-center tw-flex-col">
            <Text className="tw-text-[1.875rem] sm:tw-text-[2.5rem] lg:tw-text-[3.125rem] tw-font-manrope tw-text-[#184235] ff-classy tw-mt-[0.1rem]">
              UBU
            </Text>
            <div className="tw-w-[5rem] sm:tw-w-[6.25rem] lg:tw-w-[7.95rem] tw-h-[0.625rem] sm:tw-h-[0.75rem] lg:tw-h-[0.925rem] tw-mt-2">
              <img src={HeadingUnder} alt="img-under" />
            </div>
          </div>
        </div>

        <div className="welcome-11 xl:tw-max-w-[78rem] tw-mx-auto tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-3  tw-mb-10">
          <CustomButton
            icon={<img src={Icon1} />}
            onClick={() => navigate("/registration/")}
            variant={"black"}
            className="xl"
          >
            UBU Bussiness
          </CustomButton>
          <CustomButton
            icon={<img src={Icon2} />}
            onClick={() => navigate("/registration/")}
            variant={"default"}
            className="xl"
          >
            UBU Creator
          </CustomButton>

          <CustomButton
            icon={<img src={Icon2} />}
            onClick={() => setIsModalVisible(true)}
            variant={"default"}
            className="xl"
          >
            UBU Shopper
          </CustomButton>
        </div>
        <Text className="tw-text-[0.875rem] sm:tw-text-[1rem] lg:tw-text-[1.125rem] tw-font-manrope tw-leading-[2rem] tw-text-[#585858] tw-font-medium tw-tracking-[1%] tw-my-[2.5rem]">
          UBU is a space where your individuality shines. When you embrace who
          you are, you empower others to do the same—together, we’re creating a
          world that celebrates diversity, connection, and confidence.
        </Text>
      </div>

      <div className="tw-grid lg:tw-grid-cols-8 tw-gap-8 tw-mt-[2rem] md:tw-grid-cols-6 tw-grid-cols-1">
        <div className="md:tw-flex tw-flex-col lg:tw-col-span-2 md:tw-col-span-3 tw-hidden">
          <div
            onClick={() => onSectionsChanged("mission")}
            className={`tw-mb-[4.5rem] tw-border-b ${
              changeSection === "mission"
                ? "tw-border-black !tw-text-black"
                : "!tw-text-[#B3B3B3] !tw-border-[#B3B3B3]"
            } tw-text-[1.25rem] tw-font-semibold tw-font-manrope tw-p-[0.5rem] tw-cursor-pointer tw-flex tw-justify-between tw-items-center`}
          >
            <span>OUR MISSION</span>
            <span className="tw-flex-1 tw-flex tw-justify-end">
              <img
                src={changeSection === "mission" ? StraightArrows : GrayArrow}
                alt="StraightArrows"
              />
            </span>
          </div>

          <div
            onClick={() => onSectionsChanged("vision")}
            className={`tw-mb-[4.5rem] tw-border-b ${
              changeSection === "vision"
                ? "!tw-border-black !tw-text-black"
                : "!tw-text-[#B3B3B3] !tw-border-[#B3B3B3]"
            } tw-text-[1.25rem] tw-font-semibold tw-font-manrope tw-p-[0.5rem] tw-cursor-pointer tw-flex tw-justify-between tw-items-center`}
          >
            <span>OUR VISION</span>
            <span className="tw-flex-1 tw-flex tw-justify-end">
              <img
                src={changeSection === "vision" ? StraightArrows : GrayArrow}
                alt="StraightArrows"
              />
            </span>
          </div>

          <div
            onClick={() => onSectionsChanged("differences")}
            className={`tw-border-b ${
              changeSection === "differences"
                ? "tw-border-black !tw-text-black"
                : "!tw-text-[#B3B3B3] !tw-border-[#B3B3B3]"
            } tw-text-[1.25rem] tw-font-semibold tw-font-manrope tw-p-[0.5rem] tw-cursor-pointer tw-flex tw-justify-between tw-items-center`}
          >
            <span>UBU DIFFERENCES</span>
            <span className="tw-flex-1 tw-flex tw-justify-end">
              <img
                src={
                  changeSection === "differences" ? StraightArrows : GrayArrow
                }
                alt="StraightArrows"
              />
            </span>
          </div>
        </div>

        {changeSection === "mission" ? (
          <div className="tw-text-[1.125rem] lg:tw-col-span-4 md:tw-col-span-3 tw-font-manrope tw-leading-[2rem] md:tw-flex tw-justify-center tw-hidden">
            <p>
              Our mission is to transform the shopping experience into a
              celebration of individuality and self-expression. UBU empowers you
              to find what makes you feel confident, valued, and authentically
              you—because when we change ourselves for the better, we inspire
              the world to do the same.
            </p>
          </div>
        ) : changeSection === "vision" ? (
          <div className="tw-text-[1.125rem] lg:tw-col-span-4 md:tw-col-span-3 tw-font-manrope tw-leading-[2rem] md:tw-flex tw-justify-center tw-hidden">
            <p>
              We believe that when everyone feels empowered to embrace their
              uniqueness, it creates a ripple effect of positivity and
              connection. UBU is here to help you express yourself, find your
              people, and shine your brightest.
            </p>
          </div>
        ) : (
          <div className=" tw-text-[1.125rem] lg:tw-col-span-4 md:tw-col-span-3 tw-font-manrope tw-leading-[2rem] md:tw-flex tw-justify-center tw-hidden">
            <p>
              UBU is the only platform that truly personalizes the shopping
              experience. By matching shoppers to creators using body scans, we
              make it easy to find styles that fit and flatter you. Our group
              shopping feature goes even further, letting you save the sizes and
              preferences of family and friends, so you can shop for loved ones
              with confidence. We also believe in supporting creators with an
              abundance mindset—they’re free to post anywhere, but UBU is the
              only platform that connects them directly with shoppers who share
              their body type and style. This builds lasting relationships that
              benefit both creators and shoppers: creators can offer long-term
              style advice, and shoppers enjoy personalized inspiration that’s
              tailored just for them. That’s what makes UBU different!
            </p>
          </div>
        )}
        <div className="md:tw-hidden tw-block">
          <StyledCollapse items={items} defaultActiveKey={["1"]} />
        </div>

        <div className="lg:tw-col-span-2 tw-col-span-full tw-justify-self-stretch">
          <ReactImage
            src={AiImage}
            loading="lazy"
            blurHash="LGDJVOO^RiMw.TIrbw%0RPD%WGjG"
            alt="AiImage"
            className="tw-w-full tw-h-full tw-aspect-square tw-rounded-xl"
          />
        </div>
      </div>

      <NavigateToIOSModal
        key={isModalVisible}
        isOpen={isModalVisible}
        setIsOpen={setIsModalVisible}
      />
    </Container>
  );
};

export default WelcomeSection;
