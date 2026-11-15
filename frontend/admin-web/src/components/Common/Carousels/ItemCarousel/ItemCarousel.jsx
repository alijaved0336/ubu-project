import React, { useState } from "react";
import styled from "styled-components";
import { Carousel, Image } from "antd";
import PropTypes from "prop-types";
import cn from "@src/cn";
import placeholderImage from "@src/assets/images/placeholder.jpg";
import placeholderVideo from "@src/assets/images/no-video-available.jpg";
import ReactImage from "../../ReactImage/ReactImage";

const NextArrow = ({ className, onClick }) => {
  const handleClick = (event) => {
    event.stopPropagation(); // Stop event propagation
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div
      className={cn(
        className,
        "tw-flex tw-justify-center tw-items-center tw-rounded-full"
      )}
      style={{
        zIndex: 1,
      }}
      onClick={handleClick}
    />
  );
};

const PrevArrow = ({ className, onClick }) => {
  const handleClick = (event) => {
    event.stopPropagation(); // Stop event propagation
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div
      className={cn(
        className,
        "tw-flex tw-justify-center tw-items-center tw-rounded-full"
      )}
      style={{
        zIndex: 1,
      }}
      onClick={handleClick}
    />
  );
};

PrevArrow.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

NextArrow.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

export const StyledCarousel = styled(Carousel)`
  .slick-arrow {
    color: #000;
    width: 2rem;
    height: 2rem;
    box-sizing: border-box;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    ${({ showArrowsOnHover }) =>
      showArrowsOnHover &&
      `
      visibility: hidden;
      width: 0;
      height: 0;

    `}
  }

  .slick-next,
  .slick-prev {
    /* position: relative; */
    /* display: none; */
    display: flex;
    justify-content: center;
    align-items: center;
    &::after {
      position: unset;
      border-radius: unset;
      width: 8px;
      height: 8px;
    }
    &::before {
      content: unset;
    }
  }

  .slick-next {
    &::after {
      margin-left: -0.2rem;
    }
    &::before {
      content: unset;
    }
  }
  .slick-prev {
    &::after {
      margin-right: -0.2rem;
    }
  }
  .slick-dots {
    position: unset;
    margin-top: 1rem;
    li {
      button {
        border-radius: 50%;
        width: 0.5rem;
        height: 0.5rem;
        opacity: 1;
        background-color: #d9d9d9;
      }

      &.slick-active {
        width: 1rem;
        button {
          border-radius: 50%;
          width: 0.5rem;
          height: 0.5rem;
          background-color: #000;
        }
      }
    }
  }
`;

const CarouselImage = ({
  url,
  preview = true,
  placeholder,
  mediaContainerClassName,
  mediaClassName,
}) => {
  return (
    <div
      key={url}
      className={cn(
        "tw-p-[1px] tw-max-h-auto tw-aspect-square",
        mediaContainerClassName
      )}
    >
      <ReactImage
        src={url}
        placeholder={placeholder}
        preview={preview}
        alt="example"
        className={cn(
          "tw-object-cover !tw-w-full !tw-h-full !tw-rounded-lg tw-aspect-square",
          mediaClassName
        )}
        // rootClassName="tw-aspect-square"
        containerClassName={"!tw-w-full !tw-h-full"}
        loading="lazy"
      />
    </div>
  );
};

const CarouselVideo = ({
  url,
  mediaContainerClassName,
  mediaClassName,
  extension,
}) => {
  const [hasError, setHasError] = useState(false);

  const handleVideoError = () => {
    setHasError(true); // Trigger fallback image display
  };

  return (
    <>
      {hasError ? (
        <CarouselImage
          url={placeholderVideo}
          preview={false}
          mediaClassName={mediaClassName}
          mediaContainerClassName={mediaContainerClassName}
        />
      ) : (
        <div className={cn(" tw-rounded-lg", mediaContainerClassName)}>
          <video
            controls
            className={cn(
              "tw-w-full tw-object-cover tw-rounded-lg   tw-aspect-square",
              mediaClassName
            )}
            onError={handleVideoError}
          >
            <source src={url} type={`video/${extension}`} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </>
  );
};

const ItemCarousel = ({
  media,
  dots = false,
  mediaContainerClassName,
  mediaClassName,
  className,
  showArrowsOnHover = true,
}) => {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <StyledCarousel
        arrows
        speed={500}
        dots={dots}
        infinite={false}
        lazyLoad="ondemand"
        nextArrow={<NextArrow />}
        prevArrow={<PrevArrow />}
        showArrowsOnHover={showArrowsOnHover}
        className={className}
      >
        {!media?.length && (
          <CarouselImage
            url={placeholderImage}
            mediaClassName={mediaClassName}
            mediaContainerClassName={mediaContainerClassName}
          />
        )}
        {media?.map(({ url, type, extension, blurHash, placeholder } = {}) => (
          <>
            {type === "image" ? (
              <CarouselImage
                key={url}
                url={url}
                blurHash={blurHash}
                placeholder={placeholder}
                mediaClassName={mediaClassName}
                mediaContainerClassName={mediaContainerClassName}
              />
            ) : (
              <CarouselVideo
                key={url}
                url={url}
                extension={extension}
                mediaClassName={mediaClassName}
                mediaContainerClassName={mediaContainerClassName}
              />
            )}
          </>
        ))}
      </StyledCarousel>
    </div>
  );
};

CarouselImage.propTypes = {
  url: PropTypes.string,
  blurHash: PropTypes.string,
  preview: PropTypes.bool,
  placeholder: PropTypes.string,
  mediaContainerClassName: PropTypes.string,
  mediaClassName: PropTypes.string,
};

CarouselVideo.propTypes = {
  url: PropTypes.string,
  mediaContainerClassName: PropTypes.string,
  mediaClassName: PropTypes.string,
  extension: PropTypes.string,
};

ItemCarousel.propTypes = {
  media: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      extension: PropTypes.string,
    })
  ),
  dots: PropTypes.bool,
  mediaContainerClassName: PropTypes.string,
  mediaClassName: PropTypes.string,
  showArrowsOnHover: PropTypes.bool,
  className: PropTypes.string,
};

export default ItemCarousel;
