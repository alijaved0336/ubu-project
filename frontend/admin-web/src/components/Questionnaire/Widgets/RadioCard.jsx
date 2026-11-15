import React, { useState } from "react";
import PropTypes from "prop-types";
import { Radio, Skeleton } from "antd";

import styled from "styled-components";
import cn from "@src/cn";

const StyledRadio = styled(Radio)`
  padding: 8px 12px;
  border-radius: 58px;
  background-color: rgba(30, 30, 30, 0.07);
  display: flex;
  align-items: center;
  cursor: pointer;

  &.ant-radio-wrapper {
    border: 1px solid rgba(30, 30, 30, 0.07);
  }

  /* Remove Ant Design default dot */
  .ant-radio-inner {
    display: none !important;
  }

  /* Checked State */
  &.ant-radio-wrapper-checked {
    border: 1px solid #ffc529;
    background-color: rgba(255, 197, 41, 0.2);
  }
`;

const RadioCard = ({ option, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <StyledRadio value={option?.option} {...rest}>
      <div className="tw-flex tw-items-center tw-gap-2">
        {option?.image_url && (
          <>
            {!loaded && (
              <Skeleton.Avatar
                rootClassName="!tw-flex tw-items-center"
                shape="circle"
                size="small"
                active
                style={{ width: "2rem", height: "2rem" }}
              />
            )}
            <img
              src={option?.image_url}
              className={cn("tw-w-8 tw-h-8 tw-rounded-full", {
                "tw-hidden": !loaded,
              })}
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
            />
          </>
        )}
        <span>{option?.option}</span>
      </div>
    </StyledRadio>
  );
};

RadioCard.propTypes = {
  option: PropTypes.object,
};

export default RadioCard;
