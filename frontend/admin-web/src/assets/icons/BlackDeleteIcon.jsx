import propTypes from "prop-types";

function BlackDeleteIcon({ width = "44", height = "42", onClick }) {
  return (
    <svg onClick={onClick} width={width} height={height} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11.4147" cy="11.7333" r="11.1864" fill="black"/>
    <path d="M8.79913 15.2529C8.79913 15.7821 9.23215 16.2152 9.7614 16.2152H13.6105C14.1398 16.2152 14.5728 15.7821 14.5728 15.2529V9.47924H8.79913V15.2529ZM9.7614 10.4415H13.6105V15.2529H9.7614V10.4415ZM13.3699 8.03582L12.8888 7.55469H10.4831L10.002 8.03582H8.31799V8.9981H15.0539V8.03582H13.3699Z" fill="white"/>
    </svg>
    
  );
}

BlackDeleteIcon.propTypes = {
  onClick: propTypes.func,
  width: propTypes.string,
  height: propTypes.string,
};

export default BlackDeleteIcon;
