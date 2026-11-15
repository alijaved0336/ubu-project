import PropTypes from "prop-types";
import { Button as AntButton } from "antd";
import styled from "styled-components";
import cn from "@src/cn";

const StyledButton = styled(AntButton)`
  &&.ant-btn.ant-btn-color-primary.ant-btn-variant-outlined:hover,
  &&.ant-btn.ant-btn-color-primary.ant-btn-variant-dashed:hover {
    border-color: #858d9d; /* Hover border color */
    color: #858d9d; /* Hover background color */
  }
`;

const Button = ({
  className,
  onClick,
  disabled,
  loading,
  children,
  type = "primary",
  variant = "solid",
  color = "primary",
  ...rest
}) => {
  return (
    <StyledButton
      {...rest}
      rootClassName={cn(
        "tw-rounded-lg tw-py-5 tw-px-6 tw-border active:tw-shadow-inner tw-shadow-btn tw-flex tw-justify-center tw-items-center tw-whitespace-normal tw-font-manrope tw-font-bold",
        className
      )}
      type={type}
      color={color}
      variant={variant}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  variant: PropTypes.string,
  color: PropTypes.string,
};

export default Button;
