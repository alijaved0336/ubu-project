import PropTypes from "prop-types";

function EditIconNew({ width = "24", height = "24", onClick }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick} // Attach the onClick handler
    >
      <circle cx="12.6426" cy="12" r="12" fill="black" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.3996 17.2472L17.8873 9.75954L14.8855 6.75781L7.39786 14.2455V17.2472H10.3996ZM14.8855 8.08146L16.5636 9.75954L15.3535 10.9697L13.6755 9.29157L14.8855 8.08146ZM13.0136 9.9534L14.6917 11.6315L10.0119 16.3113H8.33382V14.6332L13.0136 9.9534Z"
        fill="white"
      />
    </svg>
  );
}

EditIconNew.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  onClick: PropTypes.func,
};

export default EditIconNew;