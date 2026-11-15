import { Checkbox } from "antd";
import propTypes from "prop-types";
import styled from "styled-components";

import { Text } from "@src/components";

const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox,
  .ant-checkbox-inner {
    width: 100%;
    height: 100%;
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: black;
    border-color: black;
  }

  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner {
    border-color: black;
  }
`;

function UBUCheckbox({ label, ...rest }) {
  return (
    <StyledCheckbox {...rest}>
      {label && <Text className={"fs-12"}>{label}</Text>}
    </StyledCheckbox>
  );
}

UBUCheckbox.propTypes = {
  label: propTypes.string,
};

export default UBUCheckbox;
