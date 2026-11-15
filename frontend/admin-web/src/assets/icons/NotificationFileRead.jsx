import propTypes from "prop-types";

function NotificationFileRead({ width = "33", height = "33" }) {
    return (
        <svg width={width} height={height} viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.769531" y="0.759521" width="32" height="32" rx="16" fill="#ECF5FF"/>
        <path d="M8.63986 12.4716L16.3454 7.85012C16.6093 7.69183 16.9391 7.69189 17.2029 7.85027L24.9019 12.4716C25.0274 12.5469 25.1042 12.6825 25.1042 12.8288V23.4263C25.1042 23.8865 24.7311 24.2596 24.2708 24.2596H9.27083C8.8106 24.2596 8.4375 23.8865 8.4375 23.4263V12.8289C8.4375 12.6825 8.51432 12.5469 8.63986 12.4716ZM10.1042 13.5368V22.593H23.4375V13.5364L16.7739 9.5366L10.1042 13.5368ZM16.8206 18.1749L21.2338 14.4557L22.3078 15.7302L16.8325 20.3444L11.2408 15.736L12.3008 14.4499L16.8206 18.1749Z" fill="#0A84FF"/>
        </svg>
    );
}

NotificationFileRead.propTypes = {
    width: propTypes.string,
    height: propTypes.string,
};

export default NotificationFileRead;
