import { Table as AntTable } from "antd";
import styled from "styled-components";

const Table = styled(AntTable)`
  font-family: "Manrope";

  .ant-table-thead {
    .ant-table-cell {
      color: #6b7280;
      font-weight: 600;
    }
  }

  .ant-table-row-expand-icon {
    color: #000000 !important; /* Ensure the default color is black */
    transition: color 0.3s, border-color 0.3s; /* Smooth transition */
  }

  .ant-table-row-expand-icon:hover,
  .ant-table-row-expand-icon:focus,
  .ant-table-row-expand-icon:active {
    color: #000000 !important; /* Black color on hover, focus, and active */
    border-color: #000000 !important; /* Black border on hover, focus, and active */
  }

  .ant-table-row-expand-icon-collapsed,
  .ant-table-row-expand-icon-expanded {
    color: #000000 !important; /* Ensure consistent color for both states */
  }

  .ant-table-container .ant-table-content::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .ant-table-container .ant-table-content::-webkit-scrollbar-thumb {
    background-color: #d4d4d4;
    border-radius: 4px;
  }

  .ant-table-container .ant-table-content::-webkit-scrollbar-thumb:hover {
    background-color: #b0b0b0;
  }

  .ant-table-container .ant-table-content::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export default Table;
