import PropTypes from "prop-types";
import axiosInstance from "@src/application-wide/axios/axios-instance";

import { Text } from "@src/components";
import { useEffect, useState } from "react";
import { Flex, Input, Skeleton } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const TagsDropDown = ({
  tagList,
  handleProductChange,
  callTagsByUserId = true,
}) => {
  const [productOptions, setProductOptions] = useState([]);
  const [productOptionsLoading, setProductOptionsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProductOptions = async () => {
      try {
        setProductOptionsLoading(true);
        const apiUrl = callTagsByUserId ? "tags" : "tags/public";
        const response = await axiosInstance.get(apiUrl);
        setProductOptions(response.data);
      } catch (error) {
        console.error("Error fetching product options:", error);
      } finally {
        setProductOptionsLoading(false);
      }
    };

    fetchProductOptions();
  }, [callTagsByUserId]);

  const filteredOptions = productOptions.filter((option) =>
    option.tagName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Flex vertical className="tw-gap-2 tw-max-h-72 tw-w-72">
      <Input
        className="tw-font-manrope fs-14 fw-500 tw-text-gray-500"
        size="large"
        placeholder="Search Tags"
        prefix={<SearchOutlined className="tw-text-gray-500" />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {productOptionsLoading ? (
        <Skeleton.Button block active size="large" />
      ) : (
        <Flex vertical className="tw-gap-2 tw-overflow-auto scrollbar-hidden">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <Flex
                onClick={() => handleProductChange(option)}
                key={index}
                className={`tw-h-14 tw-rounded-lg tw-items-center tw-p-4 tw-cursor-pointer fs-12 fw-400 ${
                  tagList?.some((product) => product.id === option.id)
                    ? "tw-bg-gray-50"
                    : ""
                } hover:tw-bg-gray-50`}
              >
                <Text className="tw-font-manrope fs-14 fw-500 tw-text-gray-500">
                  {option.tagName}
                </Text>
              </Flex>
            ))
          ) : (
            <Flex className="tw-items-center tw-p-4">
              <Text className="tw-font-manrope fs-14 fw-500 tw-text-gray-500">
                No tags found
              </Text>
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );
};

TagsDropDown.propTypes = {
  tagList: PropTypes.array,
  handleProductChange: PropTypes.func,
  callTagsByUserId: PropTypes.bool,
};

export default TagsDropDown;