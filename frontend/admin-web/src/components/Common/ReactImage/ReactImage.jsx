import React, { useId, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Image as AntImage } from "antd";
import { BlurhashCanvas } from "react-blurhash";
import fallbackImage from "@src/assets/images/placeholder.jpg";

import cn from "@src/cn";

const ReactImage = ({
  src,
  blurHash,
  placeholder,
  width = 400,
  height = 400,
  alt,
  className,
  containerClassName,
  rootClassName,
  children,
  preview = false,
  loading = "lazy",
  ...rest
}) => {
  const id = useId();
  const [loaded, setLoaded] = useState(false);
  const [imagePreview, setImagePreview] = useState(() => preview);

  const handleError = (e) => {
    e.target.src = fallbackImage; // Set the fallback image
    e.target.onError = null; // Prevent infinite loop if fallback also fails
    setImagePreview(false);
  };

  const style = useMemo(
    () =>
      placeholder && !loaded
        ? {
            backgroundImage: `url(${placeholder})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
        : undefined,
    [placeholder, loaded]
  );

  return (
    <div
      className={cn(containerClassName, "tw-relative", className, {
        "before:tw-absolute before:tw-content-[''] before:tw-w-full before:tw-h-full before:tw-top-0 before:tw-left-0 before:tw-animate-pulse before:tw-inset-0 before:tw-opacity-0 before:tw-bg-white":
          !loaded,
      })}
      id={id}
      style={style}
    >
      {!loaded && !placeholder && blurHash && (
        <BlurhashCanvas
          hash={blurHash}
          width={width}
          height={height}
          punch={1}
          className={cn(
            "tw-inset-0 tw-animate-glow tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-full",
            className
          )}
        />
      )}

      <AntImage
        {...rest}
        src={src}
        alt={alt}
        preview={imagePreview}
        loading={loading}
        rootClassName={cn("!tw-w-full", rootClassName, {
          "tw-opacity-0": !loaded,
        })}
        onLoad={() => setLoaded(true)}
        className={cn(className)}
        onError={handleError}
      />
      {children && children}
    </div>
  );
};

ReactImage.propTypes = {
  src: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  blurHash: PropTypes.string,
  placeholder: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  rootClassName: PropTypes.string,
  preview: PropTypes.bool,
  loading: PropTypes.string,
  children: PropTypes.node,
};
export default ReactImage;
