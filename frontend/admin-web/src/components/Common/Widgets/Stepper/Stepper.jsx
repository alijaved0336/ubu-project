import React from "react";
import { Steps } from "antd";
import cn from "@src/cn";
import PropTypes from "prop-types";
import styled from "styled-components";

export const StyledStepper = styled(Steps)`
  .ant-steps-item-finish .ant-steps-item-icon {
    background-color: rgba(0, 0, 0, 0.1);
    border-color: #e2e8f0;
  }

  &&.ant-steps-horizontal .ant-steps-item-tail {
    ${({ size }) =>
      size === "small" &&
      `
      top: 11px !important;
    `}

    &::after {
      height: 1.3px;
      border-radius: 8px;
    }
  }

  &&.ant-steps-horizontal .ant-steps-item-tail {
    padding: 0px 11px !important;
  }

  &&.ant-steps-vertical .ant-steps-item-tail {
    ${({ size }) =>
      size === "small" &&
      `
      top: 11px !important;
    `}

    &::after {
      height: 1.3px;
      border-radius: 8px;
    }
  }

  &&.ant-steps-vertical .ant-steps-item-tail {
    padding: 11px 0px !important;
  }
`;
const Stepper = ({ activeStep = 0, className, items, size }) => {
  return (
    <StyledStepper
      responsive
      size={size}
      className={cn("tw-font-manrope", className)}
      current={activeStep}
      items={items}
      labelPlacement="vertical"
    />
  );
};

Stepper.propTypes = {
  activeStep: PropTypes.number,
  className: PropTypes.string,
  items: PropTypes.array,
  size: PropTypes.oneOf(["small", "default"]),
};

export default Stepper;
