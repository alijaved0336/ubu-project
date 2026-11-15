import styled from "styled-components";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import PropTypes from "prop-types";
import { NextArrow, PrevArrow } from "../CarouselArrows";
import cn from "@src/cn";

export const StyledCarousel = styled(Slider)`
  .slick-slide {
    padding: 5px;

    > div {
      /* height: 100%; */
    }
  }

  /* Uncomment if needed later
    .slick-arrow {
      width: 10px !important;
      height: 17px !important;
    }
    */

  .slick-prev,
  .slick-next {
    font-size: 1rem;

    &:hover,
    &:focus {
      color: #79c200;
      outline: none;
      background: white;
    }
  }

  .slick-slider {
    .slick-arrow.slick-disabled {
      opacity: 0.25 !important;
      cursor: not-allowed;

      &:hover {
        color: black;
      }
    }
  }

  /* @media screen and (max-width: 767px) {
    .slick-slide {
      padding-left: 7px;
      padding-right: 7px;
    }

    .slick-prev,
    .slick-next {
      top: 35% !important;
    }

    .arrow-slider-main {
      height: 40px !important;
      width: 40px !important;
      border-radius: 6px;
      background-color: #fff !important;
      display: flex !important;
      align-items: center;
      justify-content: center;
      z-index: 99;

      &::before {
        font-size: 0px !important;
      }

      &.slick-next {
        right: -7px;
      }

      &.slick-prev {
        left: -7px;
      }
    }
  } */
`;

const ReactSlick = ({
  animation = "ease",
  autoPlay = false,
  pauseOnHover = true,
  infinite = false,
  swipeToSlide = false,
  speed = 500,
  className,
  children,
}) => {
  const settings = {
    slidesToShow: 5,
    slidesToScroll: 1,
    speed,
    infinite,
    pauseOnHover,
    swipeToSlide,
    autoplay: autoPlay,
    cssEase: animation,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className={cn("tw-w-full tw-relative", className)}>
      <StyledCarousel {...settings} arrows={true}>
        {children && children}
      </StyledCarousel>
    </div>
  );
};

ReactSlick.propTypes = {
  animation: PropTypes.string,
  className: PropTypes.string,
  autoPlay: PropTypes.bool,
  pauseOnHover: PropTypes.bool,
  infinite: PropTypes.bool,
  swipeToSlide: PropTypes.bool,
  speed: PropTypes.number,
  children: PropTypes.node,
};

export default ReactSlick;
