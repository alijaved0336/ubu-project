import propTypes from "prop-types";

function DoubleTickIcon({ width = "22", height = "12" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 22 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 6.75L4.75 10.5L13.75 1.5M10 9L11.5 10.5L20.5 1.5"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

DoubleTickIcon.propTypes = {
  width: propTypes.string,
  height: propTypes.string,
};

export default DoubleTickIcon;
