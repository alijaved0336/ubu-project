import React, { useState } from "react";
import { Checkbox, Skeleton } from "antd";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Paragraph } from "@src/components/Common/Typography";
import cn from "@src/cn";

const StyledCheckboxCard = styled(Checkbox)`
  /* Base styles */
  padding: 16px;
  border-radius: 8px;
  background-color: #1e1e1e12;
  display: flex;
  align-items: center;
  cursor: pointer;

  /* Remove Ant Design default tick */
  .ant-checkbox-inner {
    display: none !important;
  }

  &.ant-checkbox-wrapper {
    border: 1px solid #ebebeb;
  }
  /* Checked State */
  &.ant-checkbox-wrapper-checked {
    border: 1px solid #ffc529;
    background-color: rgba(255, 197, 41, 0.2);
  }
`;

const CheckboxCardSmall = ({ option, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <StyledCheckboxCard value={option?.option} {...rest}>
      <div className="tw-flex tw-gap-4 tw-items-center">
        {option?.image_url && (
          <>
            {!loaded && (
              <Skeleton.Avatar
                rootClassName="!tw-flex tw-items-center"
                shape="square"
                size="default"
                active
                style={{ width: "52px", height: "52px" }}
              />
            )}
            <img
              src={option?.image_url}
              className={cn(
                "tw-object-cover tw-max-w-[52px] tw-max-h-[52px] tw-aspect-auto tw-rounded-lg tw-border tw-border-[#1e1e1e0d]",
                {
                  "tw-hidden": !loaded,
                }
              )}
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
            />
          </>
        )}
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

CheckboxCardSmall.propTypes = {
  option: PropTypes.object,
};

export default CheckboxCardSmall;
