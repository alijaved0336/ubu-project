import React from "react";

import cn from "@src/cn";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

export const NextArrow = ({ className, style, onClick }) => {
  console.log({ className, style });
  const isDisabled = className?.split(" ")?.includes("slick-disabled");
  return (
    <RightOutlined
      className={cn(
        className,
        "!tw-flex tw-justify-center tw-items-center tw-rounded-full tw-bg-white arrow-slider-main before:tw-hidden tw-right-3 -tw-translate-y-1/2 tw-w-8 tw-h-8",
        {
          "!tw-hidden": isDisabled,
        }
      )}
      style={{ ...style, zIndex: 1, color: "black" }}
      onClick={onClick}
    />
  );
};

export const PrevArrow = ({ className, style, onClick }) => {
  const isDisabled = className?.split(" ")?.includes("slick-disabled");
  return (
    <LeftOutlined
      className={cn(
        className,
        "!tw-flex tw-justify-center tw-items-center tw-rounded-full tw-bg-white arrow-slider-main tw-left-3 -tw-translate-y-1/2 tw-w-8 tw-h-8",
        {
          "!tw-hidden": isDisabled,
        }
      )}
      style={{ ...style, zIndex: 1, color: "black" }}
      onClick={onClick}
    />
  );
};
