import propTypes from "prop-types";

function LocationIcon({ width = "14", height = "16"}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="7" cy="6.99436" rx="2" ry="1.99827" fill="#8F8F8F" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.59107 15.0558C5.99517 15.4136 6.27478 15.6612 6.3 15.6864C6.7 16.0861 7.3 16.0861 7.7 15.7863C7.75 15.7364 8.77502 14.8122 9.80003 13.888C10.825 12.9638 11.85 12.0396 11.9 11.9896C13.3 10.6908 14 8.89231 14 6.99395C14 3.09732 10.9 0 7 0C3.1 0 0 3.09732 0 6.99395C0 8.89231 0.7 10.6908 2.1 11.8897C2.1 11.9644 4.39281 13.9947 5.59107 15.0558ZM7 13.6876L3.6 10.6902C2.6 9.69109 2 8.39221 2 6.99342C2 4.19584 4.2 2.09766 7 2.09766C9.8 2.09766 12 4.29575 12 7.09333C12 8.49212 11.4 9.69109 10.4 10.6902L7 13.6876Z"
        fill="#8F8F8F"
      />
    </svg>
  );
}

LocationIcon.propTypes = {
  width: propTypes.string,
  height: propTypes.string,
};

export default LocationIcon;
