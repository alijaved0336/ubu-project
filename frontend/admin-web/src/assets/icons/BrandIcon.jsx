import React from "react";
import PropTypes from "prop-types";

const BrandIcon = ({
  width = "24",
  height = "24",
  fill = "white",
  className,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 512 511"
      fill="none"
    >
      <path
        d="M233.5 326.311H22.5C18.5218 326.311 14.7064 324.73 11.8934 321.917C9.08035 319.104 7.5 315.289 7.5 311.311V198.811C7.5 194.832 9.08035 191.017 11.8934 188.204C14.7064 185.391 18.5218 183.811 22.5 183.811H489.5C493.478 183.811 497.294 185.391 500.107 188.204C502.92 191.017 504.5 194.832 504.5 198.811V311.311C504.5 315.289 502.92 319.104 500.107 321.917C497.294 324.73 493.478 326.311 489.5 326.311H278.5M263.5 326.311H248.5"
        stroke="black"
        strokeWidth="15"
        strokeMiterlimit="22.93"
      />
      <path
        d="M44.21 183.811L42.74 131.931L101.26 100.321L132.87 41.8005L199.36 43.6905L256 8.81055L312.64 43.6905L379.12 41.8005L410.74 100.321L469.26 131.941L467.79 183.811M467.79 326.311L469.26 378.181L410.74 409.801L379.12 468.321L312.64 466.431L256 501.311L199.36 466.431L132.87 468.321L101.26 409.801L42.74 378.181L44.21 326.311"
        stroke="black"
        strokeWidth="15"
        strokeMiterlimit="22.93"
      />
      <path
        d="M163.46 100.651C185.47 87.4681 210.043 79.1407 235.532 76.2263C261.022 73.3118 286.84 75.8775 311.258 83.7516C335.676 91.6257 358.129 104.626 377.114 121.883C396.099 139.139 411.178 160.253 421.34 183.811M90.6599 183.811C103.609 153.871 124.422 127.996 150.89 108.931M421.34 326.311C407.413 358.605 384.333 386.113 354.951 405.44C325.568 424.767 291.169 435.066 256 435.066C220.831 435.066 186.432 424.767 157.049 405.44C127.666 386.113 104.587 358.605 90.6599 326.311"
        stroke="black"
        strokeWidth="15"
        strokeMiterlimit="22.93"
      />
      <path
        d="M338.5 142.561V127.561M308.5 127.561V112.561"
        stroke="black"
        strokeWidth="15"
        strokeMiterlimit="2.61"
      />
      <path
        d="M224.74 284.63L247.54 224.75H250.09L272.69 284.63"
        stroke="black"
        strokeWidth="15"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
      <path
        d="M231.85 269.721H265.69"
        stroke="black"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="bevel"
      />
      <path
        d="M319.57 285.371V224.751H322.23L359.74 284.441H362.41V224.631"
        stroke="black"
        strokeWidth="15"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
      <path
        d="M447.1 254.061C447.1 270.301 438.1 283.281 423.79 283.531H406.61V224.631H423.3C439 224.631 447.1 237.861 447.1 254.061Z"
        stroke="black"
        strokeWidth="15"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
      <path
        d="M67.8999 252.72H85.6199C89.8954 252.826 93.9602 254.598 96.9468 257.66C99.9334 260.721 101.605 264.828 101.605 269.105C101.605 273.382 99.9334 277.489 96.9468 280.55C93.9602 283.612 89.8954 285.384 85.6199 285.49H64.8999V224.75H82.5399C86.2529 224.75 89.8139 226.225 92.4394 228.851C95.0649 231.476 96.5399 235.037 96.5399 238.75C96.5399 242.463 95.0649 246.024 92.4394 248.649C89.8139 251.275 86.2529 252.75 82.5399 252.75"
        stroke="black"
        strokeWidth="15"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
      <path
        d="M157.15 260.33L177.15 283.99"
        stroke="black"
        strokeWidth="15"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M149.3 256.39L162.3 256.32C171.3 256.32 178.98 249.25 178.98 240.54C178.98 231.83 171.34 224.75 162.3 224.75H146.18V285.49"
        stroke="black"
        strokeWidth="15"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
    </svg>
  );
};

BrandIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string,
  fill: PropTypes.string,
};
export default BrandIcon;
