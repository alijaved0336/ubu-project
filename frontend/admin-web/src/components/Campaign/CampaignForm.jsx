import { useEffect, useState } from "react";
import { Form, Row, Col, Collapse, Tag, Flex, Radio } from "antd";

import { AmazonOutlined, LinkOutlined, PlusOutlined } from "@ant-design/icons";
import {
  UBUInput,
  UBUDatePicker,
  UBUInputNumber,
  UBUTextArea,
  Text as UBUText,
  UBUSelect,
  Text,
} from "@src/components";
import UBUListContainer from "../UBUListContainer/UBUListContainer";
import ProductDropdown from "@src/pages/products/ProductDropdown";
import { CampaignStatus } from "@src/utils/constant";
import cn from "@src/cn";
import { Button } from "../Common/Widgets";
import moment from "moment";
import {
  setHashtags,
  setInputValue,
  setValue,
  setCustomRevisions,
  setCustomTurnaroundTime,
  setAvailableOptions,
  setSelectedOption,
  setDeliverableCount,
  setDeliverables,
  setCampaignAcceptanceDeadline,
  setProductChoice,
  setPublicationDates,
  setSelectedProduct,
  setTotalCompensation,
  setAdvertisemntUrl,
  setBrandGuidelines,
  setDescription,
  setTurnAroundTime,
  setNumberOfRevisions,
  setAdditionalRequirements,
  setSpecialConditions,
  setCampaignName,
} from "@src/store/features/campaignFormSlice";
import { useDispatch, useSelector } from "react-redux";

const { Panel } = Collapse;

const CampaignForm = ({
  form,
  hashtagData,
  deliverablesData,
  productData,
  status,
}) => {
  const dispatch = useDispatch();

  // Selectors
  const {
    hashtags,
    inputValue,
    value,
    deliverables,
    selectedOption,
    deliverableCount,
    availableOptions,
    customRevisions,
    customTurnaroundTime,
    campaignAcceptanceDeadline,

    selectedProduct,
  } = useSelector((state) => state.campaignForm || {});

  const [availableTasks, setAvailableTasks] = useState(() => availableOptions);

  useEffect(() => {
    dispatch(setAvailableOptions(availableTasks));
  }, [availableTasks, dispatch]);

  const handleInputChange = (e) => {
    dispatch(setInputValue(e.target.value));
  };

  useEffect(() => {
    if (hashtagData && hashtagData?.length > 0) {
      dispatch(setHashtags(hashtagData));
    }
    if (deliverablesData) {
      dispatch(setDeliverables(deliverablesData));
      form.setFieldsValue({ deliverables: deliverablesData }); // Update form values
      const usedOptions = deliverablesData?.map(
        (deliverable) => deliverable?.type
      );

      setAvailableTasks((prevTasks) =>
        prevTasks.filter((option) => !usedOptions?.includes(option))
      );
    }
  }, [hashtagData, deliverablesData, dispatch, form, productData]);

  const disabledPastDatesForAcceptanceDate = (current) => {
    return current && current < moment().add(4, "days").startOf("day");
  };

  const disabledPastDatesForPublishableDate = (current) => {
    const campaignAcceptanceDeadline = form.getFieldValue(
      "campaignAcceptanceDeadline"
    );

    if (!campaignAcceptanceDeadline) {
      return (
        current && current.isBefore(moment().add(8, "days").startOf("day"))
      );
    }

    return (
      current &&
      current.isBefore(campaignAcceptanceDeadline.add(4, "days").startOf("day"))
    );
  };

  const validateCampaignAcceptanceDeadline = (_, value) => {
    const publicationDate = form.getFieldValue("publicationDates");
    if (value && publicationDate && value >= publicationDate) {
      form.setFields([
        {
          name: "publicationDates",
          errors: [
            "Publication date must be after campaign acceptance deadline.",
          ],
        },
      ]);
      return Promise.reject(
        new Error("Deadline of acceptance must be before publication date")
      );
    }

    form.setFields([
      {
        name: "publicationDates",
        errors: [],
      },
    ]);
    return Promise.resolve();
  };

  const validatePublicationDate = (_, value) => {
    const campaignAcceptanceDeadline = form.getFieldValue(
      "campaignAcceptanceDeadline"
    );
    if (
      value &&
      campaignAcceptanceDeadline &&
      value <= campaignAcceptanceDeadline
    ) {
      form.setFields([
        {
          name: "campaignAcceptanceDeadline",
          errors: ["Deadline of acceptance must be before publication date"],
        },
      ]);
      return Promise.reject(
        new Error(
          "Publication date must be after campaign acceptance deadline."
        )
      );
    }

    form.setFields([
      {
        name: "campaignAcceptanceDeadline",
        errors: [],
      },
    ]);
    return Promise.resolve();
  };

  const handleInputConfirm = () => {
    if (inputValue && !hashtags.includes(inputValue)) {
      const newHashtags = [...hashtags, inputValue];
      dispatch(setHashtags(newHashtags));
      dispatch(setInputValue(""));

      // Update the form field value and validate the hashtags field
      form.setFieldsValue({ hashtags: newHashtags });
      form.validateFields(["hashtags"]);
    }
  };

  const handleTagClose = (removedTag) => {
    const newHashtags = hashtags.filter((tag) => tag !== removedTag);
    dispatch(setHashtags(newHashtags));

    // Update the form field value and validate the hashtags field
    form.setFieldsValue({ hashtags: newHashtags });
    form.validateFields(["hashtags"]);
  };

  const handleRevisionsChange = (value) => {
    dispatch(setCustomRevisions(value === "custom"));
    dispatch(setNumberOfRevisions(value));
  };

  const handleTurnaroundTimeChange = (value) => {
    dispatch(setCustomTurnaroundTime(value === "custom"));
    dispatch(setTurnAroundTime(value));
  };

  const handleAddDeliverable = () => {
    if (selectedOption) {
      const newDeliverables = [
        ...deliverables,
        { type: selectedOption, count: deliverableCount },
      ];
      form.setFieldsValue({ deliverables: newDeliverables });

      dispatch(setDeliverables(newDeliverables));

      setAvailableTasks((prevTasks) =>
        prevTasks.filter((item) => item !== selectedOption)
      );

      dispatch(setSelectedOption(null));
      dispatch(setDeliverableCount(1));
    }
  };

  const handleRemoveDeliverable = (index) => {
    const removed = deliverables[index];
    const newDeliverables = deliverables.filter((_, i) => i !== index);
    dispatch(setDeliverables(newDeliverables));
    form.setFieldsValue({ deliverables: newDeliverables });
    setAvailableTasks((prevTasks) => [...prevTasks, removed.type]);
  };

  const forMap = (tag) => (
    <Tag
      closable
      onClose={() => {
        if (!disabled) {
          handleTagClose(tag);
        }
      }}
      key={tag}
      color="black"
      className={cn({
        "tw-pointer-events-none tw-cursor-not-allowed": disabled,
      })}
      style={{ color: "white", marginRight: "8px", marginBottom: "2px" }}
    >
      {`#${tag}`}
    </Tag>
  );

  const disabled = status && status !== CampaignStatus.PENDING;

  return (
    <div className="campaign-form-class">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Campaign Name"
            name="campaignName"
            rules={[{ required: true, message: "Please enter campaign name" }]}
          >
            <UBUInput
              type="text"
              placeholder="Enter Campaign Name"
              onChange={(e) => dispatch(setCampaignName(e.target.value))}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Hashtags"
            name="hashtags"
            rules={[
              {
                required: true,
                validator: (_, value) => {
                  console.log("Validating hashtags:", { value, inputValue });

                  // if (inputValue) {
                  //   console.log(
                  //     "Validation failed: User started typing but didn't press enter"
                  //   );
                  //   form.setFields([
                  //     {
                  //       name: "hashtags",
                  //       errors: ["Press Enter to add the hashtag"],
                  //     },
                  //   ]);
                  //   return Promise.reject(
                  //     new Error("Press Enter to add the hashtag")
                  //   );
                  // }

                  if (value && value.length > 0) {
                    console.log("Validation passed");
                    form.setFields([{ name: "hashtags", errors: [] }]); // Clear errors
                    return Promise.resolve();
                  } else {
                    console.log("Validation failed: No hashtags entered");
                    form.setFields([
                      {
                        name: "hashtags",
                        errors:
                          inputValue && inputValue.length > 0
                            ? ["Press Enter to add the hashtag"]
                            : ["Please enter at least one hashtag"],
                      },
                    ]);
                    // return Promise.reject(
                    //   new Error("Please enter at least one hashtag")
                    // );
                  }
                },
              },
            ]}
          >
            <Flex horizontal gap={"0.5rem"} align="stretch">
              <UBUInput
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onPressEnter={handleInputConfirm}
                disabled={disabled}
                placeholder="Press enter to add hashtag"
              />
              <Button
                type="primary"
                onClick={handleInputConfirm}
                disabled={disabled}
                key={"addHashtags"}
              >
                <PlusOutlined />
              </Button>
            </Flex>

            {hashtags.length > 0 && (
              <div style={{ marginBottom: "8px", marginTop: "8px" }}>
                {hashtags.map(forMap)}
              </div>
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Total Compensation"
            name="totalCompensation"
            rules={[
              { required: true, message: "Please enter total compensation" },
            ]}
          >
            <UBUInputNumber
              prefix="$"
              min={0}
              onChange={(value) => dispatch(setTotalCompensation(value))}
              style={{ width: "100%" }}
              placeholder="0.0"
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Campaign Acceptance Deadline"
            name="campaignAcceptanceDeadline"
            rules={[
              {
                required: true,
                message: "Please select campaign's acceptance deadline date.",
              },
              { validator: validateCampaignAcceptanceDeadline },
            ]}
          >
            <UBUDatePicker
              style={{ width: "100%" }}
              disabledDate={disabledPastDatesForAcceptanceDate}
              onChange={(date) => {
                dispatch(setCampaignAcceptanceDeadline(date));
                dispatch(setPublicationDates(null));
                form.setFieldsValue({
                  publicationDates: null,
                });
              }}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Publication Dates"
            name="publicationDates"
            rules={[
              { required: true, message: "Please select publication date" },
              { validator: validatePublicationDate },
            ]}
          >
            <UBUDatePicker
              style={{ width: "100%" }}
              disabledDate={disabledPastDatesForPublishableDate}
              disabled={disabled || !campaignAcceptanceDeadline}
              onChange={(date) => dispatch(setPublicationDates(date))}
            />
          </Form.Item>
        </Col>
      </Row>
      <div>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Deliverables"
              name="deliverables"
              rules={[
                {
                  required: true,
                  message: "Please select your desired deliverable.",
                },
              ]}
            >
              <Flex vertical gap={"1rem"}>
                <Flex gap={"1rem"} align="center">
                  <UBUSelect
                    value={selectedOption}
                    onChange={(value) => dispatch(setSelectedOption(value))}
                    options={availableOptions.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                    disabled={disabled}
                  />
                  <UBUInputNumber
                    min={1}
                    value={deliverableCount}
                    onChange={(value) => dispatch(setDeliverableCount(value))}
                    placeholder="Count"
                    disabled={disabled}
                  />
                  <Button
                    type="primary"
                    onClick={handleAddDeliverable}
                    disabled={disabled}
                    key={"add"}
                  >
                    Add
                  </Button>
                </Flex>
                {!(deliverables.length === 0) && (
                  <UBUListContainer
                    dataSource={deliverables}
                    onRemove={handleRemoveDeliverable}
                    disabled={disabled}
                  />
                )}
              </Flex>
            </Form.Item>
          </Col>
        </Row>
      </div>
      <div>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Add Product"
              name="productChoice"
              rules={[
                {
                  required: true,
                  message: "Please select your desired product choice.",
                },
              ]}
            >
              <Flex vertical gap={"1rem"}>
                <Flex gap={"1rem"} align="center">
                  <div
                    style={{
                      border: "2px solid #d9d9d9",
                      borderRadius: "8px",
                      padding: "10px",
                      textAlign: "left",
                      width: "220px",
                      height: "110px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                    className={cn({
                      "tw-cursor-not-allowed": disabled,
                    })}
                    onClick={() => {
                      if (!disabled) {
                        dispatch(setValue(1));
                        dispatch(setProductChoice(1));

                        form.setFieldsValue({ productChoice: 1 });
                      }
                    }}
                  >
                    <Radio
                      value={1}
                      checked={value === 1}
                      onChange={() => {
                        if (!disabled) {
                          dispatch(setValue(1));
                          dispatch(setProductChoice(1));

                          form.setFieldsValue({ productChoice: 1 });
                        }
                      }}
                      style={{
                        alignSelf: "flex-start",
                        margin: 0,
                        padding: 0,
                      }}
                      disabled={disabled}
                    />
                    <Flex
                      vertical
                      align="center"
                      style={{
                        textAlign: "center",
                        margin: 0,
                        padding: 0,
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      <AmazonOutlined style={{ fontSize: 40 }} />
                      <span style={{ marginTop: "4px" }}>
                        Add Amazon Product URL
                      </span>
                    </Flex>
                  </div>

                  <div
                    style={{
                      border: "2px solid #d9d9d9",
                      borderRadius: "8px",
                      padding: "10px",
                      textAlign: "left",
                      width: "250px",
                      height: "110px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                    className={cn({
                      "tw-cursor-not-allowed": disabled,
                    })}
                    onClick={() => {
                      if (!disabled) {
                        dispatch(setValue(2));
                        dispatch(setProductChoice(2));

                        form.setFieldsValue({ productChoice: 2 });
                      }
                    }}
                  >
                    <Radio
                      value={2}
                      checked={value === 2}
                      onChange={() => {
                        if (!disabled) {
                          dispatch(setValue(2));
                          dispatch(setProductChoice(2));

                          form.setFieldsValue({ productChoice: 2 });
                        }
                      }}
                      style={{
                        alignSelf: "flex-start",
                        margin: 0,
                        padding: 0,
                      }}
                      disabled={disabled}
                    />
                    <Flex
                      vertical
                      align="center"
                      style={{
                        textAlign: "center",
                        margin: 0,
                        padding: 0,
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        className="footer-flex-3-1-text ff-manrope"
                        style={{
                          fontSize: 36,
                          fontWeight: "bold",
                          margin: 0, // Remove margin
                        }}
                      >
                        UBU
                      </Text>
                      <span style={{ marginTop: "4px" }}>
                        Add from UBU Product Collection
                      </span>
                    </Flex>
                  </div>
                </Flex>
                {value === 2 && (
                  <Form.Item
                    label="Select Product"
                    name="selectedProduct"
                    rules={[
                      { required: true, message: "Please select a product" },
                    ]}
                  >
                    <ProductDropdown
                      selectedProductId={selectedProduct?.id}
                      onSelectProduct={(product) => {
                        dispatch(setSelectedProduct(product));

                        form.setFieldsValue({ selectedProduct: product });
                      }}
                      disabled={disabled}
                    />
                  </Form.Item>
                )}

                {value === 1 && (
                  <Form.Item
                    // label="Advertisement Link"
                    name="advertisemntUrl"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (!value) {
                            return Promise.resolve(); // Optional field, no value is fine
                          }

                          // Regular expression to match a URL starting with amazon.com
                          const amazonUrlPattern =
                            /^(https?:\/\/(?:www\.)?amazon\.com[^\s]*)$/;

                          // Split by spaces to check if more than one URL
                          const urls = value.trim().split(/\s+/);

                          if (urls.length > 1) {
                            return Promise.reject("Only one URL is allowed");
                          }

                          if (!amazonUrlPattern.test(value.trim())) {
                            return Promise.reject(
                              "Please enter a valid Amazon URL starting with amazon.com"
                            );
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <UBUTextArea
                      rows={2}
                      placeholder="Enter a single valid Amazon URL"
                      onChange={(e) =>
                        dispatch(setAdvertisemntUrl(e.target.value))
                      }
                      disabled={disabled}
                    />
                  </Form.Item>
                )}
              </Flex>
            </Form.Item>
          </Col>
        </Row>
      </div>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Brand Guidelines"
            name="brandGuidelines"
            rules={[{ type: "url", message: "Please enter a valid URL" }]}
          >
            <UBUInput
              prefix={<LinkOutlined />}
              placeholder="https://example.com"
              disabled={disabled}
              onChange={(e) => dispatch(setBrandGuidelines(e.target.value))}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <UBUTextArea
              rows={3}
              placeholder="Enter Description of Work"
              onChange={(e) => dispatch(setDescription(e.target.value))}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </Row>

      <Collapse bordered={false} style={{ marginBottom: "20px" }}>
        <Panel
          header={
            <UBUText className={"fs-14 fw-500"}>
              Revisions{" "}
              <UBUText className={"fs-12 tw-text-black-60"}>(optional)</UBUText>
            </UBUText>
          }
          key="1"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Number of Revisions "
                name="numberOfRevisions"
                rules={[
                  {
                    validator: async (_, value) => {
                      const turnAroundTime =
                        form.getFieldValue("turnAroundTime");
                      if (value && !turnAroundTime) {
                        return Promise.resolve();
                      }
                      if (!value && turnAroundTime) {
                        return Promise.reject(
                          "Please select Number of Revisions if Turnaround Time is selected"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <UBUSelect
                  style={{ width: "100%" }}
                  value={form.numberOfRevisions}
                  onChange={(value) => {
                    handleRevisionsChange(value);
                    form.validateFields(["turnAroundTime"]); // Trigger validation
                  }}
                  options={[
                    ...Array(10)
                      .keys()
                      .map((value) => ({ lable: value, value })),
                    { value: "custom", label: "Custom" },
                  ]}
                  disabled={disabled}
                />
              </Form.Item>
              {customRevisions && (
                <Form.Item label="Enter Custom Number">
                  <UBUInputNumber
                    min={1}
                    onChange={(value) => dispatch(setNumberOfRevisions(value))}
                    style={{ width: "100%" }}
                    disabled={disabled}
                  />
                </Form.Item>
              )}
            </Col>
            <Col span={12}>
              <Form.Item
                label="Revision Turnaround Time"
                name="turnAroundTime"
                rules={[
                  {
                    validator: async (_, value) => {
                      const numberOfRevisions =
                        form.getFieldValue("numberOfRevisions");
                      if (value && !numberOfRevisions) {
                        return Promise.resolve();
                      }
                      if (!value && numberOfRevisions) {
                        return Promise.reject(
                          "Please select Turnaround Time if Number of Revisions is selected"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                {/* <Select
                  placeholder="Select Time"
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    handleTurnaroundTimeChange(value);
                    form.validateFields(["numberOfRevisions"]); // Trigger validation
                  }}
                >
                  <Option value="12">12 Hours</Option>
                  <Option value="24">24 Hours</Option>
                  <Option value="48">48 Hours</Option>
                  <Option value="custom">Custom</Option>
                </Select> */}

                <UBUSelect
                  placeholder="Select Time"
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    handleTurnaroundTimeChange(value);

                    form.validateFields(["numberOfRevisions"]); // Trigger validation
                  }}
                  options={[
                    ...[12, 24, 48].map((ele) => ({
                      value: ele,
                      label: `${ele} Hours`,
                    })),
                    { value: "custom", label: "Custom" },
                  ]}
                  disabled={disabled}
                />
              </Form.Item>
              {customTurnaroundTime && (
                <Form.Item label="Enter Custom Time (Hours)">
                  <UBUInputNumber
                    min={1}
                    style={{ width: "100%" }}
                    onChange={(value) => dispatch(setTurnAroundTime(value))}
                    disabled={disabled}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>
        </Panel>

        <Panel
          header={
            <UBUText className={"fs-14 fw-500"}>
              Additional Requirements{" "}
              <UBUText className={"fs-12 tw-text-black-60"}>(optional)</UBUText>
            </UBUText>
          }
          key="2"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="additionalRequirements">
                <UBUTextArea
                  rows={3}
                  placeholder="Enter any additional requirements"
                  disabled={disabled}
                  onChange={(e) =>
                    dispatch(setAdditionalRequirements(e.target.value))
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Panel>

        <Panel
          header={
            <UBUText className={"fs-14 fw-500"}>
              Special Conditions{" "}
              <UBUText className={"fs-12 tw-text-black-60"}>(optional)</UBUText>
            </UBUText>
          }
          key="3"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="specialConditions">
                <UBUTextArea
                  rows={3}
                  placeholder="Enter any special conditions"
                  disabled={disabled}
                  onChange={(e) =>
                    dispatch(setSpecialConditions(e.target.value))
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </div>
  );
};

export default CampaignForm;
