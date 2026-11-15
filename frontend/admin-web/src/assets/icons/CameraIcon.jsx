import propTypes from "prop-types";

function CameraIcon({ width = "44", height = "42" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 44 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_9680_10128)">
        <rect x="4" y="4" width="36" height="34" rx="17" fill="white" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.574 13.336C17.8479 12.9251 18.2191 12.5881 18.6545 12.3551C19.0899 12.122 19.5761 12 20.07 12H23.93C24.4239 12 24.9101 12.122 25.3455 12.3551C25.7809 12.5881 26.1521 12.9251 26.426 13.336L27.238 14.555C27.3293 14.6919 27.4531 14.8042 27.5982 14.8818C27.7434 14.9594 27.9054 15 28.07 15H29C29.7956 15 30.5587 15.3161 31.1213 15.8787C31.6839 16.4413 32 17.2044 32 18V27C32 27.7956 31.6839 28.5587 31.1213 29.1213C30.5587 29.6839 29.7956 30 29 30H15C14.2044 30 13.4413 29.6839 12.8787 29.1213C12.3161 28.5587 12 27.7956 12 27V18C12 17.2044 12.3161 16.4413 12.8787 15.8787C13.4413 15.3161 14.2044 15 15 15H15.93C16.0946 15 16.2566 14.9594 16.4018 14.8818C16.5469 14.8042 16.6707 14.6919 16.762 14.555L17.574 13.336ZM20 22C20 21.4696 20.2107 20.9609 20.5858 20.5858C20.9609 20.2107 21.4696 20 22 20C22.5304 20 23.0391 20.2107 23.4142 20.5858C23.7893 20.9609 24 21.4696 24 22C24 22.5304 23.7893 23.0391 23.4142 23.4142C23.0391 23.7893 22.5304 24 22 24C21.4696 24 20.9609 23.7893 20.5858 23.4142C20.2107 23.0391 20 22.5304 20 22ZM22 18C20.9391 18 19.9217 18.4214 19.1716 19.1716C18.4214 19.9217 18 20.9391 18 22C18 23.0609 18.4214 24.0783 19.1716 24.8284C19.9217 25.5786 20.9391 26 22 26C23.0609 26 24.0783 25.5786 24.8284 24.8284C25.5786 24.0783 26 23.0609 26 22C26 20.9391 25.5786 19.9217 24.8284 19.1716C24.0783 18.4214 23.0609 18 22 18Z"
          fill="#1E1E1E"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_9680_10128"
          x="0"
          y="0"
          width="44"
          height="42"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_9680_10128"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_9680_10128"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

CameraIcon.propTypes = {
  width: propTypes.string,
  height: propTypes.string,
};

export default CameraIcon;
