import PropTypes from "prop-types";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import "./CustomMultiSelect.less";

import { Select, Skeleton } from "antd";
import { useEffect, useState } from "react";

const CustomMultiSelect = ({ tags, setTags, isLoading }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axiosInstance.get("tags");
        const mappedOptions = response?.data?.map((tag) => ({
          value: String(tag.id),
          label: tag.tagName,
          isNew: false,
        }));
        setOptions(mappedOptions);
      } catch (error) {
        console.error("Error fetching product options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (stringValues) => {
    const updatedTags = stringValues.map((strVal) => {
      const matchedOption = options.find(
        (opt) =>
          opt.value === strVal ||
          opt.label.toLowerCase() === strVal.toLowerCase()
      );

      if (matchedOption) {
        const numericID = Number(matchedOption.value);
        return {
          label: matchedOption.label,
          value: numericID,
          isNew: false,
        };
      }

      return {
        label: strVal,
        value: strVal,
        isNew: true,
      };
    });

    setTags(updatedTags);
  };

  return isLoading ? (
    <Skeleton.Button block active size="large" />
  ) : (
    <div>
      <Select
        className="custom-field-text"
        mode="tags"
        size="large"
        style={{ width: "100%" }}
        placeholder="Enter tags, separated by enter"
        value={tags?.map((tag) =>
          typeof tag.value === "number" ? String(tag.value) : tag.value
        )}
        onChange={handleChange}
        options={options}
        showSearch
        filterOption={(inputValue, option) =>
          option?.label?.toLowerCase().includes(inputValue.toLowerCase())
        }
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
      />
    </div>
  );
};

CustomMultiSelect.propTypes = {
  tags: PropTypes.array,
  setTags: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default CustomMultiSelect;
