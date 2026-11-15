import propTypes from "prop-types";

function ThumbsUp({ width = "60", height = "59" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 59"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="30" cy="29.5" r="29" stroke="black" />
      <path
        d="M24.1511 40.1426H18.8574C17.8316 40.1426 17 39.3111 17 38.2854V28.9997C17 27.974 17.8316 27.1426 18.8574 27.1426H24.1511C24.305 27.1426 24.4297 27.2674 24.4297 27.4211V39.864C24.4297 40.0178 24.305 40.1426 24.1511 40.1426Z"
        stroke="#33363F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M24.4297 29L27.9484 21.9636C28.0775 21.7057 28.1445 21.4213 28.1445 21.133V17.8571C28.1445 16.8315 28.9761 16 30.002 16C32.0537 16 33.7168 17.6629 33.7168 19.7143V27.1429"
        stroke="#33363F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M30.002 27.1426H41.1414C42.3793 27.1426 43.2709 28.3306 42.9247 29.519L39.6788 40.6618C39.4479 41.4546 38.7213 41.9997 37.8955 41.9997H30.7713C30.2787 41.9997 29.8062 41.804 29.4579 41.4558L28.6886 40.6865C28.3403 40.3383 27.8678 40.1426 27.3752 40.1426H24.4297"
        stroke="#33363F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

ThumbsUp.propTypes = {
  width: propTypes.string,
  height: propTypes.string,
};

export default ThumbsUp;
