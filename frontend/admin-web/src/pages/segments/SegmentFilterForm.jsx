// src/components/SegmentFilterForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./SegmentFilterForm.less"; // Import the new LESS file
import {
  Grid,
  Flex,
  Typography,
  Checkbox,
  Button,
  Form,
  Radio,
  Input,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import CheckboxCard from "../../components/CheckboxCard";
const SegmentFilterForm = ({
  questionnaireData,
  handleInputChange,
  control,
  errors,
  watchField,
  // watch,
}) => {

  // let field2 = []
  // const watchField2 = useMemo(() => {
  //   if (questionnaireData) {
  //     field2 = watch(String(
  //       Object.values(questionnaireData)
  //         .flat()
  //         .find((value) => value.sr_no === 3)?.id)
  //     );
  //     return field2;
  //   }
  //   return [];
  // }, [questionnaireData, field2]);

  // let field = []
  // const watchField3 = useMemo(() => {
  //   if (questionnaireData) {
  //     field = watch(String(
  //       Object.values(questionnaireData)
  //         .flat()
  //         .find((value) => value.sr_no === 4)?.id)
  //     );
  //     return field;
  //   }
  //   return [];
  // }, [questionnaireData, field]);
  
  const { Text } = Typography;
  const [inputValues, setInputValues] = useState({});
  return (
    <div style={{ padding: "20px" }}>
      <Flex vertical align="start" className="inf-form-pdiv" gap="large">
        {Object.entries(questionnaireData).map(([key, category]) => (
          <Flex vertical className="inf-demographics" gap="middle" key={key}>
            <Text className="inf-demographics-text">
              {category[0]?.question_category}
            </Text>
            <Text className="inf-demographics-text-desc">
              {category[0]?.question_category_description &&
                category[0]?.question_category_description}
            </Text>
            {category.length > 0 &&
              category.map((questions) => (
                <Flex
                  vertical
                  className="inf-demographics-child"
                  gap="middle"
                  key={questions.id}
                >
                  <Text
                    className={
                      questions.title
                        ? "inf-demographics-text2"
                        : "inf-demographics-text2-ques"
                    }
                  >
                    {questions?.title || questions?.question}
                  </Text>
                  <Text className="inf-demographics-text2-desc">
                    {questions.description}
                  </Text>

                  {questions.question_category === "Geographic Location" ? (
                    questions?.options?.some(
                      (option) => option.option_description
                    ) ? (
                      <CheckboxCard
                        questions={questions}
                        control={control}
                        name={String(questions.id)}
                      />
                    ) : (
                      <Controller
                        name={String(questions.id)}
                        control={control}
                        render={({ field }) => (
                          <>
                            <Checkbox.Group
                              value={field.value}
                              onChange={field.onChange}
                              className="inf-geo-options"
                            >

                              <Flex className="inf-geo-options-2">
                                <Flex
                                  key={"all-"+questions.id+"-north"}
                                  className="inf-demographic-item"
                                  style={{marginBottom: '10px'}}
                                >
                                  <Checkbox
                                    value="All"
                                    className="brand-cbs-row-cb"
                                  >
                                    Any
                                  </Checkbox>
                                </Flex>
                                <Text className="inf-geo-loc-text">
                                  {"North America:(United States)"}
                                </Text>
                                <Flex className="inf-geo-radiogroup">
                                  {questions.options
                                    .slice(0, 6)
                                    .map((option) => (
                                      <Flex
                                        key={option.option}
                                        className="inf-demographic-item"
                                      >
                                        <Checkbox
                                          value={option.option}
                                          className="brand-cbs-row-cb"
                                        >
                                          {option.option}
                                        </Checkbox>
                                      </Flex>
                                    ))}
                                </Flex>
                              </Flex>
                              <Flex className="inf-geo-options-2">
                                <Text className="inf-geo-loc-text">
                                  {"North America:(Canada)"}
                                </Text>
                                <Flex className="inf-geo-radiogroup">
                                  {questions.options
                                    .slice(6, 9)
                                    .map((option) => (
                                      <Flex
                                        key={option.option}
                                        className="inf-demographic-item"
                                      >
                                        <Checkbox
                                          value={option.option}
                                          className="brand-cbs-row-cb"
                                        >
                                          {option.option}
                                        </Checkbox>
                                      </Flex>
                                    ))}
                                </Flex>
                              </Flex>
                              <Flex className="inf-geo-options-2">
                                <Text className="inf-geo-loc-text">
                                  {"North America:(Mexico)"}
                                </Text>
                                <Flex className="inf-geo-radiogroup">
                                  {questions.options
                                    .slice(9, 13)
                                    .map((option) => (
                                      <Flex
                                        key={option.option}
                                        className="inf-demographic-item"
                                      >
                                        <Checkbox
                                          value={option.option}
                                          className="brand-cbs-row-cb"
                                        >
                                          {option.option}
                                        </Checkbox>
                                      </Flex>
                                    ))}
                                </Flex>
                              </Flex>

                              <Flex className="inf-geo-options-2">
                                <Flex className="inf-geo-radiogroup-last">
                                  <Flex className="custom-input-main">
                                    <Checkbox
                                      className="checkbox-text"
                                      value={questions.options[13].option}
                                    >
                                      {questions.options[13].option}
                                    </Checkbox>

                                    {watchField &&
                                      watchField.includes("Other Regions") && (
                                        <Controller
                                          name="Region"
                                          control={control}
                                          defaultValue={
                                            inputValues["Other Regions"] || ""
                                          }
                                          render={({ field }) => (
                                            <Input
                                              {...field}
                                              className="input-field"
                                              placeholder="Other Regions"
                                              onChange={(e) => {
                                                field.onChange(e); // Update react-hook-form state
                                                handleInputChange(
                                                  "Other Regions",
                                                  e
                                                ); // Update custom inputValues
                                              }}
                                            />
                                          )}
                                        />
                                      )}
                                  </Flex>

                                  <Flex className="custom-input-main">
                                    <Checkbox
                                      className="checkbox-text"
                                      value={questions.options[14].option}
                                    >
                                      {questions.options[14].option}
                                    </Checkbox>

                                    {watchField &&
                                      watchField.includes(
                                        "Specific Countries (Please specify)"
                                      ) && (
                                        <Controller
                                          name="Country"
                                          control={control}
                                          defaultValue={
                                            inputValues[
                                              "Specific Countries (Please specify)"
                                            ] || ""
                                          }
                                          render={({ field }) => (
                                            <Input
                                              {...field}
                                              className="input-field"
                                              placeholder="Specific Countries (Please specify)"
                                              onChange={(e) => {
                                                field.onChange(e);
                                                handleInputChange(
                                                  "Specific Countries (Please specify)",
                                                  e
                                                );
                                              }}
                                            />
                                          )}
                                        />
                                      )}
                                  </Flex>
                                  <Flex className="custom-input-main">
                                    <Checkbox
                                      className="checkbox-text"
                                      value={questions.options[15].option}
                                    >
                                      {questions.options[15].option}
                                    </Checkbox>

                                    {watchField &&
                                      watchField.includes(
                                        "Specific Cities / Regions (Please specify)"
                                      ) && (
                                        <Controller
                                          name="City"
                                          control={control}
                                          defaultValue={
                                            inputValues[
                                              "Specific Cities / Regions (Please specify)"
                                            ] || ""
                                          }
                                          render={({ field }) => (
                                            <Input
                                              {...field}
                                              className="input-field"
                                              placeholder="Specific Cities / Regions (Please specify)"
                                              onChange={(e) => {
                                                field.onChange(e);
                                                handleInputChange(
                                                  "Specific Cities / Regions (Please specify)",
                                                  e
                                                );
                                              }}
                                            />
                                          )}
                                        />
                                      )}
                                  </Flex>
                                </Flex>
                              </Flex>
                            </Checkbox.Group>
                          </>
                        )}
                      />
                    )
                  ) : (
                    <Flex className="inf-demographics-options" gap="large">
                      {questions?.options?.some(
                        (option) => option.option_discription
                      ) ? (
                        <CheckboxCard
                          questions={questions}
                          control={control}
                          name={questions.id}
                        />
                      ) : (
                        <Controller
                          name={String(questions.id)}
                          control={control}
                          render={({ field }) => (
                            <Checkbox.Group
                              value={field.value}
                              onChange={field.onChange}
                              className="inf-demographics-radiogroup"
                            >

                              {questions?.options.map((option) => (
                                
                                <Flex
                                  key={option.option}
                                  className="inf-demographic-item"
                                >
                                  <Checkbox
                                    value={option.option}
                                    className="brand-cbs-row-cb"
                                  >
                                    {option.option}
                                  </Checkbox>
                                  {/* {watchField3 &&  questions.sr_no === 4&& watchField3.includes('Other') &&option.option === 'Other' && (
                                    <Controller
                                      name="otherLang"
                                      control={control}
                                      render={({ field }) => (
                                        <Flex vertical>
                                          <Input
                                            {...field}
                                            placeholder="Enter your Language "
                                            className="input-field"
                                            style={{
                                              marginLeft: "2rem",
                                              width: "200px",
                                            }}
                                          />
                                        </Flex>
                                      )}
                                    />
                                  )}
                                    {watchField2 &&  questions.sr_no === 3&& watchField2.includes('Other') &&option.option === 'Other' && (
                                    <Controller
                                      name="otherEth"
                                      control={control}
                                      render={({ field }) => (
                                        <Flex vertical>
                                          <Input
                                            {...field}
                                            placeholder="Enter your Ethnicity"
                                            className="input-field"
                                            style={{
                                              marginLeft: "2rem",
                                              width: "200px",
                                            }}
                                          />
                                        </Flex>
                                      )}
                                    />
                                  )} */}
                                </Flex>
                              ))}
                              <Flex
                                key={"all-"+questions.id}
                                className="inf-demographic-item"
                              >
                                <Checkbox
                                  value="All"
                                  className="brand-cbs-row-cb"
                                >
                                  Any
                                </Checkbox>
                              </Flex>
                            </Checkbox.Group>
                          )}
                        />
                      )}
                    </Flex>
                  )}

                  {errors[questions?.title || questions?.question] && (
                    <Text type="danger">
                      {errors[questions?.title || questions?.question].message}
                    </Text>
                  )}
                </Flex>
              ))}
          </Flex>
        ))}
      </Flex>
    </div>
  );
};

export default SegmentFilterForm;
