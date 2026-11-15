import React from "react";
import { List, Button } from "antd";
import styled from "styled-components";

const StyledList = styled(List)`
  &.ant-list-bordered {
    border-radius: 8px;
    border-color: #e0e2e7;

    .ant-list-item {
      font-size: 0.875rem;
      font-weight: 400;
      font-family: Manrope;
      padding: 0.5rem;
    }

    .ant-list-item-actions > li > .ant-btn-link {
      font-size: 0.75rem;
      color: #d9d9d9; /* Set color to black */

      &:hover {
        color: #d9d9d9; /* Keep black on hover */
      }
    }

    .ubu-list-remove-container-btn {
      font-family: Manrope;
      font-weight: 400;
      font-size: 0.875rem;
      color: #000; /* Set color to black */

      &:hover {
        color: #d9d9d9; /* Keep black on hover */
      }
    }

    &:hover {
      border-color: #d9d9d9;
    }
    .minus-icon {
      font-size: 0.875rem;
    }
  }
`;

const UBUListContainer = ({ dataSource, onRemove, disabled = false }) => {
  return (
    <StyledList
      bordered
      dataSource={dataSource}
      renderItem={(item, index) => (
        <List.Item
          actions={[
            <Button
              className="ubu-list-remove-container-btn"
              type="link"
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  onRemove(index);
                }
              }}
            >
              <span className="minus-icon">Remove</span>
            </Button>,
          ]}
        >
          {`${item.type} - ${item.count}`}
        </List.Item>
      )}
    />
  );
};

export default UBUListContainer;
