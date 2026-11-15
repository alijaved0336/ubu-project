import propTypes from "prop-types";

function Delete({ widht = "24", height = "24" }) {
  return (
    <svg
      width={widht}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="11.897" cy="12" rx="11.8169" ry="12" fill="black" />
      <path
        d="M10.6035 10.8984V14.8382"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.1914 10.8984V14.8382"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.72461 8.26953H17.0703"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.01758 8.26953H11.8972H15.7769V15.4924C15.7769 16.5804 14.9084 17.4623 13.837 17.4623H9.9574C8.88607 17.4623 8.01758 16.5804 8.01758 15.4924V8.26953Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.95703 6.95779C9.95703 6.2325 10.536 5.64453 11.2502 5.64453H12.5435C13.2577 5.64453 13.8367 6.2325 13.8367 6.95779V8.27104H9.95703V6.95779Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

Delete.propTypes = {
  widht: propTypes.string,
  height: propTypes.string,
};

export default Delete;
