import { Flex, Radio, Checkbox, Typography, Input } from "antd";
import "./InfluencerForm.less";
import { Controller } from "react-hook-form";
import { useState, useMemo } from "react";
import CheckboxCard from "../../../components/CheckboxCard";
import { EXTRACT_VALUES } from "../../../utils/formateFunctions";
const InfluencerForm = ({
  data,
  watch,
  errors,
  unregister,
  control,
  setCheckedState,
  setValue,
}) => {
  const { Text } = Typography;
  const [inputValues, setInputValues] = useState({});
  const [gender, setGender] = useState("");

  const handleGenderChange = (value) => {
    const genderMap = {
      Male: 17,
      Female: 16,
      "Non-binary": 31,
    };

    setCheckedState((prevState) => ({...prevState,selectedGender : genderMap[value] || 0}))
    setGender(value);
    const unregisterFields = {
      Male: ["16", "31"],
      Female: ["17", "31"],
      "Non-binary": ["16", "17"],
      default: ["16", "17", "31"],
    };

    const fieldsToUnregister =
      unregisterFields[value] || unregisterFields.default;
    fieldsToUnregister.forEach((field) => unregister(field));
  };

  
  const handleCheckboxChange = (checkedOptions) => {
    setCheckedState((prevState)=>({
      ...prevState,
      otherReg: checkedOptions.includes("Other Regions"),
      otherCountry: checkedOptions.includes(
        "Specific Countries (Please specify)"
      ),
      otherCity: checkedOptions.includes(
        "Specific Cities / Regions (Please specify)"
      ),
    }));
  };
  const handleLangChange = (checkedOptions) => {
    if (checkedOptions.includes("Other")) {
      setCheckedState((prevState) => ({
        ...prevState,
        otherLang: true,
      }));
    }
  };
  const handleEthChange = (checkedOptions) => {
    if (checkedOptions.target.value === "Other") {
      setCheckedState((prevState) => ({
        ...prevState,
        otherEth: true,
      }));
    }
  };
  let field = [];

  const watchField2 = useMemo(() => {
    if (data) {
      field = watch(
        String(
          Object.values(data)
            .flat()
            .find((value) => value.sr_no === 30)?.sr_no
        )
      );
      return field;
    }
    return {};
  }, [data, field]);

  let field2 = [];

  const watchField = useMemo(() => {
    if (data) {
      field2 = watch(
        String(
          Object.values(data)
            .flat()
            .find((value) => value.sr_no === 4)?.sr_no
        )
      );
      return field2;
    }
    return {};
  }, [data, field2]);

  let radioField = [];
  const radioWatchField = useMemo(() => {
    if (data) {
      radioField = watch(
        String(
          Object.values(data)
            .flat()
            .find((value) => value.sr_no === 3)?.sr_no
        )
      );
      return radioField;
    }
    return {};
  }, [data, radioField]);

  const handleInputChange = (optionKey, e) => {
    const { value } = e.target;
    setInputValues((prev) => ({
      ...prev,
      [optionKey]: value,
    }));
    setValue(optionKey, value);
  };
  return (
    <Flex vertical align="start" className="inf-form-pdiv" gap="large">
      {Object.entries(data).map(([key, category]) => (
        <Flex vertical className="inf-demographics" gap="middle" key={key}>
          <Text className="inf-demographics-text">
            {category[0]?.question_category}
          </Text>
          <Text className="inf-demographics-text-desc">
            {category[0]?.question_category_description &&
              category[0]?.question_category_description}
          </Text>
          {category.length > 0 &&
            category.map((questions) => {
              const shouldDisplay =
                (questions.sr_no === 16 && gender === "Female") ||
                (questions.sr_no === 17 && gender === "Male") ||
                (questions.sr_no === 31 && gender === "Non-binary") ||
                (questions.sr_no !== 16 &&
                  questions.sr_no !== 17 &&
                  questions.sr_no !== 31);

              return shouldDisplay ? (
                questions.is_multi_selected ? (
                  <Flex
                    vertical
                    className="inf-demographics-child"
                    gap="middle"
                    key={questions.sr_no}
                  >
                    <Text
                      className={
                        questions.title
                          ? "inf-demographics-text2"
                          : "inf-demographics-text2-ques"
                      }
                    >
                      {questions?.title || questions?.question}{" "}
                      {errors[questions?.sr_no] && (
                        <Text style={{ marginLeft: "2rem" }} type="danger">
                          {errors[questions?.sr_no].message === "Required"
                            ? "This field is required"
                            : errors[questions?.sr_no].message}
                        </Text>
                      )}
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
                          className="checkbox-card"
                          name={String(questions.sr_no)}
                        />
                      ) : (
                        <Controller
                          name={String(questions.sr_no)}
                          control={control}
                          render={({ field }) => (
                            <>
                              <Checkbox.Group
                                value={field.value}
                                onChange = {(checkedValues) => 
                                {
                                  field.onChange(checkedValues)
                                  handleCheckboxChange(checkedValues)
                                }
                                }
                                className="inf-geo-options"
                              >
                                <Flex className="inf-geo-options-2">
                                  <Text className="inf-geo-loc-text" style={{marginTop:"1rem"}}>
                                    {"North America: (United States)"}
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
                                  <Text className="inf-geo-loc-text" style={{marginTop:"2rem"}}>
                                    {"North America: (Canada)"} 
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
                                  <Text className="inf-geo-loc-text" style={{marginTop:"2rem"}}>
                                    {"North America: (Mexico)"}
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
                                        {questions.options[13].option}{" "}
                                        {errors.otherReg && (
                                          <Text
                                            type="danger"
                                            style={{ marginLeft: "2rem" }}
                                          >
                                            {"This field is Required"}
                                          </Text>
                                        )}
                                      </Checkbox>
                                      {watchField2 &&
                                        watchField2.includes(
                                          "Other Regions"
                                        ) && (
                                          <Controller
                                            name="otherReg"
                                            control={control}
                                            render={({ field }) => (
                                              <Flex vertical>
                                                <Input
                                                  {...field}
                                                  placeholder="Other Regions"
                                                  className={
                                                    errors.otherReg
                                                      ? "input-error"
                                                      : "input-field"
                                                  }
                                                />
                                              </Flex>
                                            )}
                                          />
                                        )}
                                    </Flex>
                                    <Flex className="custom-input-main">
                                      <Checkbox
                                        className="checkbox-text"
                                        value={questions.options[14].option}
                                      >
                                        {questions.options[14].option}{" "}
                                        {errors.otherCountry && (
                                          <Text
                                            type="danger"
                                            style={{ marginLeft: "2rem" }}
                                          >
                                            {"This field is Required"}
                                          </Text>
                                        )}
                                      </Checkbox>
                                      {watchField2 &&
                                        watchField2.includes(
                                          "Specific Countries (Please specify)"
                                        ) && (
                                          <Controller
                                            name="otherCountry"
                                            control={control}
                                            render={({ field }) => (
                                              <Flex vertical>
                                                <Input
                                                  {...field}
                                                  placeholder="Specific Countries (Please specify)"
                                                  className={
                                                    errors.otherCountry
                                                      ? "input-error"
                                                      : "input-field"
                                                  }
                                                />
                                              </Flex>
                                            )}
                                          />
                                        )}
                                    </Flex>
                                    <Flex className="custom-input-main">
                                      <Checkbox
                                        className="checkbox-text"
                                        value={questions.options[15].option}
                                      >
                                        {questions.options[15].option}{" "}
                                        {errors.otherCity && (
                                          <Text
                                            type="danger"
                                            style={{ marginLeft: "2rem" }}
                                          >
                                            {" This field is Required"}
                                          </Text>
                                        )}
                                      </Checkbox>

                                      {watchField2 &&
                                        watchField2.includes(
                                          "Specific Cities / Regions (Please specify)"
                                        ) && (
                                          <Controller
                                            name="otherCity"
                                            control={control}
                                            render={({ field }) => (
                                              <Flex vertical>
                                                <Input
                                                  {...field}
                                                  placeholder="Specific Cities / Regions (Please specify)"
                                                  className={
                                                    errors.otherCity
                                                      ? "input-error"
                                                      : "input-field"
                                                  }
                                                />
                                              </Flex>
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
                            className="checkbox-card"
                            name={String(questions.sr_no)}
                          />
                        ) : (
                          <Controller
                            name={String(questions.sr_no)}
                            control={control}
                            render={({ field }) => (
                              <Checkbox.Group
                                value={field.value}
                                onChange={(checkedValues) => {
                                  field.onChange(checkedValues);
                                  handleLangChange(checkedValues);
                                }}
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
                                    {watchField &&
                                        watchField.includes(
                                          "Other"
                                        ) && option.option === "Other" &&(
                                          <Controller
                                            name="otherLang"
                                            control={control}
                                            render={({ field }) => (
                                              <Flex vertical>
                                                <Input
                                                  {...field}
                                                  placeholder="Other Language"
                                                  className="input-field"
                                                  style={{marginLeft:"2rem", width:"200px"}}
                                                />
                                                {errors.otherLang && (
                                                  <Text type="danger" style={{width:"10rem", alignItems:"center", display:"flex", marginLeft:"1rem"}}>
                                                    {"Required"}
                                                  </Text>
                                                )}
                                              </Flex>
                                            )}
                                          />
                                        )}
                                  </Flex>
                                ))}
                              </Checkbox.Group>
                            )}
                          />
                        )}
                      </Flex>
                    )}
                  </Flex>
                ) : (
                  <Flex
                    vertical
                    className="inf-demographics-child"
                    gap="middle"
                    key={questions.sr_no}
                  >
                    <Text
                      className={
                        questions.title
                          ? "inf-demographics-text2"
                          : "inf-demographics-text2-ques"
                      }
                    >
                      {questions?.title || questions?.question}{" "}
                      {errors[questions?.sr_no] && (
                        <Text style={{ marginLeft: "2rem" }} type="danger">
                          {errors[questions?.sr_no].message === "Required"
                            ? "This field is required"
                            : errors[questions?.sr_no].message}
                        </Text>
                      )}
                    </Text>
                    <Text className="inf-demographics-text2-desc">
                      {questions.description && questions.description}
                    </Text>

                    <Flex className="inf-demographics-options" gap="large">
                      {questions?.sr_no === 2 ? (
                        <Radio.Group className="inf-demographics-radiogroup">
                          {questions?.options.map((option) => (
                            <Flex
                              key={option.option}
                              className="inf-demographic-item"
                            >
                              <Controller
                                name={String(questions.sr_no)}
                                control={control}
                                render={({ field }) => (
                                  <Radio
                                    {...field}
                                    className="inf-demographics-radio"
                                    value={option.option}
                                    onChange={(e) => {
                                      handleGenderChange(e.target.value);
                                      field.onChange(e);
                                    }}
                                  >
                                    {option.option}
                                  </Radio>
                                )}
                              />
                            </Flex>
                          ))}
                        </Radio.Group>
                      ) : (
                        <Radio.Group className="inf-demographics-radiogroup">
                          {questions?.options.map((option) => (
                            <Flex
                              key={option.option}
                              className="inf-demographic-item"
                            >
                              <Controller
                                name={String(questions.sr_no)}
                                control={control}
                                render={({ field }) => (
                                  <Radio
                                    {...field}
                                    className="inf-demographics-radio"
                                    value={option.option}
                                    onChange={(e) => {
                                      const cleanValue = EXTRACT_VALUES(
                                        e.target.value
                                      );
                                      field.onChange(cleanValue);
                                      handleEthChange(e);
                                    }}
                                  >
                                    {option.option}
                                  </Radio>
                                )}
                              />
                              {radioWatchField &&
                                radioField.includes("Other") &&
                                option.option === "Other" && (
                                  <Controller
                                    name="otherEth"
                                    control={control}
                                    render={({ field }) => (
                                      <Flex horizontal>
                                        <Input
                                          {...field}
                                          placeholder="Enter your ethnicity"
                                          className="input-field"
                                          style={{
                                            marginLeft: "2rem",
                                            width: "200px",
                                          }}
                                        />
                                        {errors.otherEth && (
                                          <Text
                                            type="danger"
                                            style={{
                                              width: "10rem",
                                              alignItems: "center",
                                              display: "flex",
                                              marginLeft: "1rem",
                                            }}
                                          >
                                            {"Required"}
                                          </Text>
                                        )}
                                      </Flex>
                                    )}
                                  />
                                )}
                            </Flex>
                          ))}
                        </Radio.Group>
                      )}
                    </Flex>
                  </Flex>
                )
              ) : null;
            })}
        </Flex>
      ))}
    </Flex>
  );
};

export default InfluencerForm;
