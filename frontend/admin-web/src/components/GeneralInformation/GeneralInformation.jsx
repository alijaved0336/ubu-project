import PropTypes from "prop-types";
import "./GeneralInformation.less";

import { Form, Skeleton } from "antd";
import { UBUInput, UBUTextArea } from "..";
import { useEffect } from "react";

const GeneralInformation = ({
  generalInfo,
  setGeneralInfo,
  parent,
  required,
  isLoading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(generalInfo);
  }, [generalInfo, form]);

  const handleValuesChange = (_, allValues) => {
    setGeneralInfo(allValues);
  };

  return (
    <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
      <div className="general-information">
        <h2>General Information</h2>

        <div className="input-group full-width">
          <label>{parent} Name</label>
          {isLoading ? (
            <Skeleton.Button block active size="large" />
          ) : (
            <Form.Item
              name="name"
              rules={[
                { required, message: "Name is required" },
                {
                  pattern: /\S+/,
                  message: "Name cannot be only spaces",
                },
              ]}
            >
              <UBUInput
                type="text"
                placeholder={`Type ${parent} name here...`}
              />
            </Form.Item>
          )}
        </div>

        {/* Description Input */}
        <div className="input-group full-width">
          <label>Description</label>
          {isLoading ? (
            <Skeleton.Button
              block
              active
              size="large"
              style={{ height: 190 }}
            />
          ) : (
            <Form.Item
              name="description"
              rules={[
                { required, message: "Description is required" },
                {
                  pattern: /\S+/,
                  message: "Description cannot be only spaces",
                },
              ]}
            >
              <UBUTextArea
                rows={6}
                placeholder={`Type ${parent} description here...`}
                className="textarea-input"
              />
            </Form.Item>
          )}
        </div>
      </div>
    </Form>
  );
};

GeneralInformation.propTypes = {
  generalInfo: PropTypes.object.isRequired,
  setGeneralInfo: PropTypes.func.isRequired,
  parent: PropTypes.string.isRequired,
  required: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default GeneralInformation;
