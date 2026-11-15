import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import "./CheckboxCard.less";
import { Flex, Checkbox, Typography } from "antd";
import { EXTRACT_VALUES } from "../../utils/formateFunctions";

const CheckboxCard = ({ questions, control, name }) => {
  const { Text } = Typography;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isSegmentQuestion, setIsSegementQuestion] = useState(false);
  useEffect(() => {
    questions.user_type === 'segment'?setIsSegementQuestion(true):setIsSegementQuestion(false)
  }, [questions]);
  // console.log(questions);
  return (
    <Flex>
      <Controller
        name={String(name)}
        control={control}
        render={({ field }) => (
          <Checkbox.Group
            value={field.value}
            onChange={(values) => {
              field.onChange(values);
              setSelectedOptions(values);
            }}
            className="inf-demographics-radiogroup-2"
          >
            {questions?.options.map((option) => (
              <Flex key={option.option}>
                <Checkbox
                  value={EXTRACT_VALUES(option.option)}
                  checked={selectedOptions.includes(option.option)}
                  onChange={(e) => {
                    const { checked, value } = e.target;
                    const newSelectedOptions = checked
                      ? [...selectedOptions, value]
                      : selectedOptions.filter((item) => item !== value);

                    setSelectedOptions(newSelectedOptions);
                    field.onChange(newSelectedOptions);
                  }}
                  className={`card-main ${
                    selectedOptions.includes(option.option)
                      ? "card-main-checked"
                      : ""
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
                </Checkbox>
              </Flex>
            ))}
          {isSegmentQuestion &&<Flex key={"all-" + questions.id + "-" + name}>
            <Checkbox
              value="All"
              onChange={(e) => {
                const { checked, value } = e.target;
                const newSelectedOptions = checked
                  ? [...selectedOptions, value]
                  : selectedOptions.filter((item) => item !== value);

                setSelectedOptions(newSelectedOptions);
                field.onChange(newSelectedOptions);
              }}
              className={`card-main ${
                selectedOptions.includes("All") ? "card-main-checked" : ""
              }`}
            >
              <Flex className="card-body">
                <Text className="checkbox-option-text">Any</Text>
              </Flex>
            </Checkbox>
          </Flex>}
          </Checkbox.Group>
        )}
      />
    </Flex>
  );
};

export default CheckboxCard;
