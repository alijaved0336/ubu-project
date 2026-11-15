import React from "react";
import { Modal } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import cn from "@src/cn";
import { Button } from "../Common/Widgets";
import { CloseIcon } from "@src/assets/icons";

const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 32px 24px !important;
  }

  .ant-modal-body {
    padding: 0 !important;
  }
`;

const CustomModal = ({
  title,
  footer,
  isOpen,
  width,
  onCancel,
  children,
  bodyWrapperClassName,
  ...rest
}) => {
  return (
    <StyledModal
      {...rest}
      title={
        <div className="tw-flex tw-items-center tw-gap-2">
          {title}
          <Button
            className="!tw-min-w-0 tw-group !tw-min-h-0 tw-w-12 tw-h-12 !tw-p-0 tw-flex tw-items-center tw-justify-center tw-ml-auto"
            onClick={onCancel}
          >
            <CloseIcon
              width="16"
              height="16"
              color="white"
              // className="group-hover:tw-fill-black"
            />
          </Button>
        </div>
      }
      width={width}
      open={isOpen}
      className="!tw-h-auto"
      onCancel={onCancel}
      centered
      closeIcon={null}
      footer={footer}
    >
      <div className={cn("tw-mt-6", bodyWrapperClassName)}>{children}</div>
    </StyledModal>
  );
};

CustomModal.propTypes = {
  title: PropTypes.node,
  footer: PropTypes.node,
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  bodyWrapperClassName: PropTypes.string,
  width: PropTypes.string,
  children: PropTypes.node,
};

export default CustomModal;
