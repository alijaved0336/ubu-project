import React, { useState } from "react";
import { Controller } from "react-hook-form";
import "./index.less";
import { Flex, Checkbox, Radio, Typography } from "antd";

const RadioButtonCard = ({ questions, control, name }) => {
  const { Text } = Typography;
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <Flex>
      <Radio.Group className="inf-demographics-radiogroup">
        {questions?.options.map((option) => (
          <Flex key={option.option}>
            <Controller
              name={String(name)}
              control={control}
              render={({ field }) => (
                <Radio
                  {...field}
                  value={option.option}
                  checked={selectedValue === option.option}
                  onChange={() => {
                    // Toggle selection
                    const newValue =
                      selectedValue === option.option ? null : option.option;
                    setSelectedValue(newValue);
                    field.onChange(newValue ? [newValue] : []);
                  }}
                  className={`card-main ${
                    selectedValue === option.option ? "card-main-checked" : ""
                  }`}
                >
                  <Flex className="card-body">
                    <Text className="checkbox-option-text">
                      {option.option}
                    </Text>
                    <Text className="checkbox-desc-text">
                      {option?.option_discription}
                    </Text>
                  </Flex>
                </Radio>
              )}
            />
          </Flex>
        ))}
      </Radio.Group>
    </Flex>
  );
};

export default RadioButtonCard;
