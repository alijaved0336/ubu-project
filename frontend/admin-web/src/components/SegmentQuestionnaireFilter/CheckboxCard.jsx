import React from "react";
import { Checkbox } from "antd";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Paragraph } from "@src/components/Common/Typography";

const StyledCheckboxCard = styled(Checkbox)`
  /* Base styles */
  padding: 16px;
  border-radius: 8px;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  cursor: pointer;

  &.ant-checkbox-wrapper {
    border: 1px solid #fafafa;
  }
  /* Checked State */
  &.ant-checkbox-wrapper-checked {
    border: 1px solid #1e1e1e;
  }
`;

const CheckboxCard = ({ option, ...rest }) => {
  return (
    <StyledCheckboxCard value={option?.option} {...rest}>
      <div className="tw-flex tw-gap-4 tw-items-start">
        <div>
          <Paragraph className="tw-font-manrope tw-text-sm tw-font-bold">
            {option?.option}
          </Paragraph>
          {option?.option_discription && (
            <Paragraph className="tw-font-manrope tw-text-xs tw-font-normal tw-italic">
              {option?.option_discription}
            </Paragraph>
          )}
        </div>
      </div>
    </StyledCheckboxCard>
  );
};

CheckboxCard.propTypes = {
  option: PropTypes.object,
};
export default CheckboxCard;
