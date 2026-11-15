import React, { useRef } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel } from "antd";

const CustomCarousal = ({ children }) => {
  const carouselRef = useRef(null);

  return (
    <div className="tw-relative">
      <button
        className="tw-text-[0.75rem] tw-text-[#858D9D] tw-bg-[#858D9D2E] tw-p-[7px] tw-cursor-pointer tw-absolute tw-transform tw--translate-y-1/2 tw-z-10 tw-left-[78%] sm:tw-left-[90%] tw-top-[-20px] tw-transition-all md:tw-left-[80%] xs:tw-left-[85%] xxs:tw-left-[80%]"
        onClick={() => carouselRef.current?.prev()}
      >
        <LeftOutlined />
      </button>

      <Carousel ref={carouselRef} infinite>
        {children}
      </Carousel>

      <button
        className="tw-text-[0.75rem] tw-text-[#858D9D] tw-bg-[#858D9D2E] tw-p-[7px] tw-cursor-pointer tw-absolute  tw-transform tw--translate-y-1/2 tw-z-10 tw-right-0 tw-top-[-20px]"
        onClick={() => carouselRef.current?.next()}
      >
        <RightOutlined />
      </button>
    </div>
  );
};

export default CustomCarousal;
