import { Input } from "antd";
import styled from "styled-components";
import { useCallback, useState } from "react";
import debounce from "lodash/debounce";
import PropTypes from "prop-types";
import { CloseCircleOutlined } from "@ant-design/icons";

const CustomSearchInput = styled(Input.Search)`
  .ant-input-wrapper {
    height: 100%;
    border-radius: 8px;
  }
  .ant-input-group-addon {
    display: none;
  }

  .ant-input-affix-wrapper {
    height: 100%;
    font-size: 0.875rem;
    font-weight: 400;
    font-family: Manrope;
    padding: 12px;
    border-radius: 8px !important;
    .ant-input-prefix svg {
      width: 16px;
      height: 16px;
      fill: #858d9d;
    }
    &:hover {
      border-color: #e0e2e7; // Replace with your theme color for hover
    }

    &:focus,
    &:focus-visible,
    &:focus-within,
    &:active {
      outline: none;
      border-color: #e0e2e7;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    }
  }
`;

const SearchComponent = ({ onSearch, className, ...rest }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 500), // 500ms delay
    []
  );

  // Handle input change
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <CustomSearchInput
      {...rest}
      // placeholder="Search..."
      value={searchTerm}
      onChange={handleChange} // Calls the debounced function
      allowClear={{
        clearIcon: (
          <CloseCircleOutlined
            style={{ fontSize: 20, transform: "translate(-20% -20%)" }}
          />
        ),
      }}
      className={className}
    />
  );
};

SearchComponent.propTypes = {
  className: PropTypes.string,
  onSearch: PropTypes.func,
};

export default SearchComponent;
