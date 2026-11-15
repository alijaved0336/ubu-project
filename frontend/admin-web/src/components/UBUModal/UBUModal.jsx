import React from "react";
import { Modal } from "antd";
import propTypes from "prop-types";
import { Text } from "..";

import "./UBUModal.less";

function UBUModal({ children, title, ...rest }) {
  return (
    <Modal
      className="UBUModal"
      wrapClassName="UBUModal-wrapper"
      title={<Text className={"fs-16 fw-600"}>{title}</Text>}
      {...rest}
    >
      {children}
    </Modal>
  );
}

UBUModal.propTypes = {
  children: propTypes.node,
  title: propTypes.string,
};

export default UBUModal;
