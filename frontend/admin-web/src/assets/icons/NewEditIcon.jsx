import cn from "@src/cn";
import PropTypes from "prop-types";

const NewEditIcon = ({
  width = "32",
  height = "32",
  onClick,
  className,
  stroke = "black",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      onClick={onClick}
      className={cn("tw-cursor-pointer", className)}
      width={width}
      height={height}
    >
      <circle cx="16.0527" cy="16.1221" r="15.5" fill="black" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.1555 22.8965L22.8271 13.2249L18.9499 9.34766L9.27832 19.0193V22.8965H13.1555ZM18.9499 11.0574L21.1175 13.2249L19.5544 14.788L17.3869 12.6204L18.9499 11.0574ZM16.532 13.4753L18.6996 15.6428L12.6548 21.6875H10.4873V19.52L16.532 13.4753Z"
        fill="white"
      />
    </svg>
  );
};

NewEditIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  stroke: PropTypes.string,
};
export default NewEditIcon;
