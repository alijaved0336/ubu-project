import PropTypes from "prop-types";
import "./Tags.less";

import { useState } from "react";
import { Text } from "@src/components";
import { Skeleton, Popover, Flex, Button } from "antd";
import { grayColor, vibrantColors } from "@src/utils/constant";
import { PlusOutlined } from "@ant-design/icons";

const Tags = ({ tags, setTags, isLoading, tagLimit = 7, tagType = "text" }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTag = () => {
    if (inputValue.trim() && (tags?.length < tagLimit || !tags)) {
      if (tagType === "text") {
        setTags([...tags, inputValue.trim()]);
      } else if (tagType === "object") {
        setTags([...tags, { tagName: inputValue.trim(), tagColor: grayColor }]);
      }
      setInputValue("");
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleTagRemove = (tagToRemove) => {
    if (tagType === "text") {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    } else if (tagType === "object") {
      setTags(tags.filter((tag) => tag.tagName !== tagToRemove.tagName));
    }
  };

  const handleColorChange = (tagName, color) => {
    setTags(
      tags.map((tag) =>
        tag.tagName === tagName ? { ...tag, tagColor: color } : tag
      )
    );
  };

  return (
    <div className="tags">
      <h2>Tags</h2>
      <div className="tags-input-container">
        {isLoading ? (
          <Skeleton.Button block active size="large" />
        ) : (
          <>
            {tags?.map((tag, index) => (
              <Popover
                key={index}
                content={
                  tagType === "object" ? (
                    <Flex vertical gap={4}>
                      <Text className="fs-14 fw-700">Change Color</Text>
                      {vibrantColors.map((color, index) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: color.hexaValue,
                            width: "100px",
                            height: "30px",
                            cursor: "pointer",
                            borderRadius: "4px",
                          }}
                          onClick={() => handleColorChange(tag.tagName, color.hexaValue)}
                        />
                      ))}
                    </Flex>
                  ) : null
                }
                placement="bottom"
              >
                <div
                  style={{
                    backgroundColor:
                      tagType === "text" ? grayColor : tag.tagColor,
                  }}
                  className="tag-item"
                >
                  {tagType === "text" ? tag : tag.tagName}
                  <button
                    type="button"
                    className="tag-remove-button"
                    onClick={() => handleTagRemove(tag)}
                  >
                    x
                  </button>
                </div>
              </Popover>
            ))}
            {tags?.length < tagLimit || !tags ? (
              <Flex className="tw-flex-grow tw-gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Enter tags, separated by enter"
                className="tags-input"
              />
              <Button
                size="large"
                type="primary"
                onClick={handleAddTag}
              >
                <PlusOutlined />
              </Button>
              </Flex>
            
            ) : (
              <div className="tags-limit-message">
                You cannot add more than {tagLimit} tags.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

Tags.propTypes = {
  tags: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(
      PropTypes.shape({
        tagName: PropTypes.string.isRequired,
        tagColor: PropTypes.string,
      })
    ),
  ]),
  setTags: PropTypes.func.isRequired,
  tagLimit: PropTypes.number,
  isLoading: PropTypes.bool,
  tagType: PropTypes.oneOf(["text", "object"]),
};

export default Tags;
