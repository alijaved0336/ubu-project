import propTypes from "prop-types";

function Bell({ width = "27", height = "27", fill = "#3A5BFF" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.103 6.08073C11.103 4.88411 12.0731 3.91406 13.2697 3.91406C14.4663 3.91406 15.4364 4.88411 15.4364 6.08073C17.9715 7.2795 19.6382 9.7795 19.7697 12.5807V15.8307C19.935 17.1966 20.7392 18.4028 21.9364 19.0807H4.60303C5.80023 18.4028 6.60436 17.1966 6.76969 15.8307V12.5807C6.90118 9.7795 8.56784 7.2795 11.103 6.08073"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0195 19.0811V20.1644C10.0195 21.9593 11.4746 23.4144 13.2695 23.4144C15.0645 23.4144 16.5195 21.9593 16.5195 20.1644V19.0811"
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

Bell.propTypes = {
  width: propTypes.string,
  height: propTypes.string,
  fill: propTypes.string,
};

export default Bell;
