import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Paragraph } from "../Common/Typography";

const recaptchaKey = import.meta.env.VITE_FRONTEND_RECAPTCHA_SITE_KEY;
const errorMessage = "*Please complete the CAPTCHA.";

// eslint-disable-next-line react/display-name
const Recaptcha = forwardRef(({ onVerify }, ref) => {
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");

  const captchaRef = useRef(null);

  const handleVerify = (token) => {
    setVerified(!!token);
    setMessage("");

    if (onVerify) {
      onVerify(token);
    }
  };

  // Expose the reset method via ref
  useImperativeHandle(ref, () => ({
    reset: () => {
      captchaRef.current?.reset(); // Reset the ReCAPTCHA
      setVerified(false); // Reset verification state
      setMessage("");
    },
    setErrorMessage: () => {
      setMessage(errorMessage);
    },
  }));

  return (
    <div>
      <ReCAPTCHA
        size="normal"
        ref={captchaRef}
        sitekey={`${recaptchaKey}`}
        onChange={handleVerify}
      />
      {message && (
        <Paragraph className="tw-text-sm tw-text-[#ff4d4f]">
          {message}
        </Paragraph>
      )}
    </div>
  );
});

export default Recaptcha;
