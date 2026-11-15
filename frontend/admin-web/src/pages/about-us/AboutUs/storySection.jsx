import { Flex } from "antd";
import { Button } from "@src/components/Common/Widgets";
import Image1 from "@src/assets/image1.png";
import Image2 from "@src/assets/image2.png";
import { Text } from "@src/components";
import Container from "@src/components/Common/Container/Container";
import ReactImage from "@src/components/Common/ReactImage/ReactImage";

const StorySection = () => {
  return (
    <Container>
      <div className="tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-10 tw-mt-12 md:tw-justify-items-stretch tw-justify-items-center">
        <div className="tw-justify-self-stretch md:tw-order-1 tw-order-2">
          <ReactImage
            src={Image2}
            alt="Image2"
            className="tw-w-full tw-h-auto tw-aspect-[367/468]"
            loading="lazy"
            blurHash="LOJ7RA0*$g9a_M$iJ7$%xaS0$%t7"
          />
        </div>
        <div className="tw-w-full tw-h-auto md:tw-order-2 tw-order-1">
          <div>
            <Flex
              //   className="aboutus-welcome-1-1"
              justify="center"
              align="center"
            >
              <Text className="tw-text-[1.875rem] sm:tw-text-[2.5rem] lg:tw-text-[3.125rem]  tw-font-manrope tw-text-[#000000]">
                Our Story
              </Text>
            </Flex>
            {/* <Flex vertical align="center" className="aboutus-welcome-1-2">
              <Flex className="aboutus-welcome-1-2-1">
                <Text className="flex-text-welcome ff-classy tw-text-[1.875rem] sm:tw-text-[2.5rem] lg:tw-text-[3.125rem]">
                  Story
                </Text>
              </Flex>

              <Flex className="">
                <img
                  src={HeadingUnder}
                  alt="img-under"
                  className="heading-under-img-welcome tw-relative tw-left-2 tw-top-2"
                />
              </Flex>
            </Flex> */}
          </div>
          <p className="tw-text-base tw-leading-[32px] tw- tw-font-medium  tw-mt-8 tw-text-center tw-leading-6 tw-font-manrope tw-text-[#111111] tw-tracking-[1%]">
            UBU started as a solution to a frustrating challenge. As someone
            who’s petite (a.k.a. short!), finding creators who looked like
            me—and whose style felt relatable—was nearly impossible. I’d spend
            hours scrolling, hoping to spot someone close to my size and shape,
            and usually came up empty.
          </p>
          <p className="tw-text-base tw-leading-[32px] tw-font-medium  tw-mt-2 tw-text-center tw-leading-6  tw-font-manrope tw-text-[#111111] tw-tracking-[1%]">
            When I talked to friends, I realized I wasn’t alone. Whether it was
            a long torso, short legs, broad shoulders, or a lack of cultural
            representation, so many people felt unseen. That’s when I knew
            something had to change.
          </p>
          <div className="tw-flex tw-justify-center tw-items-center tw-mt-8 tw-px-4 sm:tw-px-8 md:tw-mt-6">
            <Button>Learn More</Button>
          </div>
        </div>
        <div className="tw-justify-self-stretch tw-col-span-full lg:tw-col-span-1 tw-order-3">
          <ReactImage
            src={Image1}
            alt="Image1"
            className="tw-w-full tw-h-auto tw-aspect-[92/117] tw-rounded-2xl"
            loading="lazy"
            blurHash="LKEMwJy?XT=ft,tlRjiwMdwI%M9t"
          />
        </div>
      </div>
    </Container>
  );
};

export default StorySection;
