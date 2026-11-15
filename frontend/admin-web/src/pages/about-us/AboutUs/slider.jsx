import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Kari from "@src/assets/kari.png";
import "./new-about.less";
import { Text } from "@src/components";
import { Button } from "@src/components/Common/Widgets";
import StraightArrows from "@src/assets/straight-arrows.svg";
import FeArrowLeft from "@src/assets/fe_arrow-left.svg";
import FeArrowRIght from "@src/assets/fe-arrow-right.svg";
import Container from "@src/components/Common/Container/Container";
import ReactImage from "@src/components/Common/ReactImage/ReactImage";

const SliderContent = () => {
  const [isHoveredLeft, setIsHoveredLeft] = useState(false);
  const [isHoveredRight, setIsHoveredRight] = useState(false);
  const scrollContainer = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainer.current;
    const scrollAmount = 200;

    if (container) {
      container.scrollBy({
        left: direction === "forward" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };
  return (
    <Container className="tw-relative tw-my-32 xl:tw-max-w-[calc(100%-188px)] tw-mx-auto tw-grid md:tw-grid-cols-3 tw-grid-cols-1 tw-gap-5 tw-justify-items-center">
      <div className="md:tw-col-span-2 tw-col-span-full">
        <div className="tw-col-span-10 tw-mt-8 tw-mb-6 lg:tw-mb-8">
          <Text className="tw-text-[1.75rem] sm:tw-text-[2.25rem] lg:tw-text-[3.125rem] ff-classy tw-font-normal ">
            Our Team: Dedicated to <br /> Empowering You to Be You. Team{" "}
          </Text>

          <p className="tw-text-[1.125rem] tw-mt-2  tw-leading-6 tw-text-[#585858] tw-font-normal tw-font-manrope">
            The UBU team is driven by a shared belief: when we help people
            embrace their authentic selves, We spark a <br /> positive energy
            that connects us all. Every voice matters, and every style inspires.
          </p>
        </div>
        <div className="tw-flex tw-justify-between    tw-space-x-4 tw-mb-4">
          <div className="tw-flex ">
            <Button>FOUNDERS</Button>
          </div>

          {/* <div className="tw-flex tw-justify-between">
            <div
              onClick={() => scroll("backward")}
              onMouseEnter={() => setIsHoveredLeft(true)}
              onMouseLeave={() => setIsHoveredLeft(false)}
              className={`tw-w-12 tw-h-12  tw-mr-5 tw-rounded-full tw-flex tw-items-center tw-justify-center  ${
                isHoveredLeft ? "hover:!tw-bg-black " : "tw-bg-[#F2F2F2F2]"
              }  tw-cursor-pointer `}
            >
              <img
                src={isHoveredLeft ? FeArrowRIght : FeArrowLeft}
                className={` ${
                  isHoveredLeft ? "!tw-rotate-180" : ""
                }  tw-flex tw-justify-center tw-items-center `}
              />
            </div>
            <div
              onClick={() => scroll("forward")}
              onMouseEnter={() => setIsHoveredRight(true)}
              onMouseLeave={() => setIsHoveredRight(false)}
              className="tw-w-12 tw-h-12 tw-flex tw-items-center tw-rounded-full tw-justify-center  tw-bg-[#F2F2F2F2] tw-cursor-pointer hover:tw-bg-black"
            >
              <img
                src={isHoveredRight ? FeArrowRIght : FeArrowLeft}
                className={`    ${
                  isHoveredRight ? "" : "!tw-rotate-180"
                }  tw-flex tw-justify-center tw-items-center `}
              />
            </div>
          </div> */}
        </div>
      </div>
      <div
        ref={scrollContainer}
        className="tw-w-full md:tw-col-span-1 tw-col-span-full"
        style={{ scrollBehavior: "smooth" }}
      >
        <div>
          <ReactImage
            src={Kari}
            alt="Kari"
            className="tw-w-full tw-h-full tw-rounded-lg tw-aspect-square"
            loading="lazy"
            blurHash="LaKdh^tRyYt7~Vt7Ioof9afkwbof"
          />

          <div>
            <div className="tw-flex tw-justify-between   tw-mt-5">
              <h1 className="tw-text-[2rem] tw-font-manrope tw-font-semibold">
                Kari Peters
              </h1>
            </div>
            <h1 className="tw-text-[1.125rem] tw-mt-2 tw-text-[#82828282] tw-font-manrope tw-font-medium">
              CEO and Founder
            </h1>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SliderContent;
