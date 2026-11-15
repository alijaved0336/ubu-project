import PropTypes from "prop-types";
import "./AddAmazonLink.less";
import { Form, Skeleton } from "antd";
import { UBUTextArea } from "..";
import { useEffect } from "react";

const AddAmazonLink = ({ productLink, setProductLink, parent, required, isLoading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (productLink) {
      form.setFieldsValue({ productLink });
    }
  }, [productLink, form]);

  const handleValuesChange = (_, allValues) => {
    setProductLink(allValues.productLink);
  };

  return (
    <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
      <div className="add-amazon-link">
        {
          isLoading ? 
          (
            <div>
              <h3>Product Link</h3>
              <Skeleton.Button block active size="large"/>
            </div>
          )
          :
          <Form.Item
            name="productLink"
            label="Product Link"
            rules={[
              { required, message: "Product link is required" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();

                  const amazonUrlPattern = /^(https?:\/\/(?:www\.)?amazon\.com[^\s]*)$/;
                  if (!amazonUrlPattern.test(value.trim())) {
                    return Promise.reject(new Error("Please enter a valid Amazon URL"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <UBUTextArea rows={2} placeholder="Enter a single valid Amazon Product URL" />
          </Form.Item>
        }  
      </div>
    </Form>
  );
};

AddAmazonLink.propTypes = {
  productLink: PropTypes.string.isRequired,
  setProductLink: PropTypes.func.isRequired,
  parent: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

export default AddAmazonLink;
