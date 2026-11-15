import ErrorIcon from "@src/assets/icons/ErrorIcon";
import React from "react";
import { Heading } from ".";
import { FALLBACK_ERROR_MESSAGE } from "@src/utils/constant";
import PropTypes from "prop-types";
import cn from "@src/cn";

const Error = ({ message = "", className }) => {
  return (
    <div className={cn("tw-font-manrope tw-text-center", className)}>
      <ErrorIcon className="tw-mx-auto" />
      <Heading
        className="tw-font-semibold tw-text-red-400    tw-rounded-lg tw-w-fit tw-mx-auto"
        level={3}
      >
        {message || FALLBACK_ERROR_MESSAGE}
      </Heading>
    </div>
  );
};

Error.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
};

export default Error;
