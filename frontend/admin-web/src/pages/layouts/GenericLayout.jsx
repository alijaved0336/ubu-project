import { Flex, Typography } from "antd";
import "./GenericLayout.less";
import { Container } from "@src/components";
import Banner from "@src/assets/generice-bg.png";
import ReactImage from "@src/components/Common/ReactImage/ReactImage";
import { Heading, Paragraph } from "@src/components/Common/Typography";

const GenericLayout = ({ heading, description, children, subHeader }) => {
  const { Text } = Typography;
  return (
    <>
      <Flex className="parent-generic-header " vertical>
        <ReactImage
          src={Banner}
          alt="banner"
          blurHash="L05q|s00IoxuD%xuofD%IUt7V@ay"
          className="sm:tw-aspect-[482/85] tw-aspect-[2/1] -tw-z-[1] tw-w-full"
          containerClassName="tw-relative"
        >
          <div className="tw-absolute sm:tw-aspect-[482/85] tw-aspect-[2/1] tw-top-0 tw-left-0 tw-w-full  tw-bg-gradient-to-r tw-from-[rgba(0,0,0,0.5)] tw-to-[rgba(0,0,0,0.5)]" />
          <div className="tw-flex tw-justify-between tw-items-center tw-flex-col tw-font-manrope tw-text-white tw-absolute tw-top-1/2 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2 tw-h-full tw-py-3">
            {subHeader && (
              <Heading
                level={3}
                className="md:tw-text-2xl sm:tw-text-xl tw-text-lg tw-font-vogue"
              >
                {subHeader}
              </Heading>
            )}
            <Heading
              level={1}
              className="md:tw-text-4xl sm:tw-text-3xl tw-text-2xl tw-my-auto tw-font-vogue"
            >
              {heading}
            </Heading>
            {description && <Paragraph>{description}</Paragraph>}
          </div>
        </ReactImage>
        {/* <Flex className="generic-header" justify="center" align="center">
          {subHeader && (
            <Text className="generic-sub-header-text">{subHeader}</Text>
          )}
          <Text
            className={`generic-header-text ${
              description ? "aboutus-header" : ""
            } ${subHeader ? "padding-by-sub" : ""}`}
          >
            {heading}
          </Text>
          {description && (
            <Text className="generic-header-text2">{description}</Text>
          )}
        </Flex> */}

        <Container overflow="hidden">{children}</Container>
      </Flex>
    </>
  );
};
export default GenericLayout;
