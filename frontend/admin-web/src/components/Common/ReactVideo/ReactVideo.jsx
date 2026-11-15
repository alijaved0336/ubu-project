import React, { useState } from "react";
import ReactImage from "../ReactImage/ReactImage";
import PropTypes from "prop-types";
import placeholderVideo from "@src/assets/images/no-video-available.jpg";
import cn from "@src/cn";

const ReactVideo = ({ url, mediaContainerClassName, className, extension }) => {
  const [hasError, setHasError] = useState(false);

  const handleVideoError = () => {
    setHasError(true); // Trigger fallback image display
  };

  return (
    <>
      {hasError ? (
        <ReactImage
          src={placeholderVideo}
          className={className}
          mediaContainerClassName={mediaContainerClassName}
        />
      ) : (
        <div className={cn(mediaContainerClassName)}>
          <video controls className={cn(className)} onError={handleVideoError}>
            <source src={url} type={`video/${extension}`} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </>
  );
};

ReactVideo.propTypes = {
  url: PropTypes.string,
  mediaContainerClassName: PropTypes.string,
  className: PropTypes.string,
  extension: PropTypes.string,
};

export default ReactVideo;
