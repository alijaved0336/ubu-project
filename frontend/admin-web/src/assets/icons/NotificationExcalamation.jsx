import propTypes from "prop-types";

function NotificationExcalamation({ width = "33", height = "33" }) {
    return (
        <svg width={width} height={height} viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.769531" y="0.0859375" width="32" height="32" rx="16" fill="#FFF8DD" />
            <path d="M17.4936 8.586L25.4321 22.336C25.6623 22.7346 25.5257 23.2443 25.1271 23.4744C25.0005 23.5475 24.8567 23.586 24.7105 23.586H8.83333C8.3731 23.586 8 23.2129 8 22.7527C8 22.6064 8.03851 22.4627 8.11165 22.336L16.0502 8.586C16.2803 8.18742 16.79 8.05086 17.1886 8.28097C17.3152 8.35412 17.4205 8.45932 17.4936 8.586ZM15.9386 19.4194V21.086H17.6052V19.4194H15.9386ZM15.9386 13.586V17.7527H17.6052V13.586H15.9386Z" fill="#FFCC00" />
        </svg>

    );
}

NotificationExcalamation.propTypes = {
    width: propTypes.string,
    height: propTypes.string,
};

export default NotificationExcalamation;
