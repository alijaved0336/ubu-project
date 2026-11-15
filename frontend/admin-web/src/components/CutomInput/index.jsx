import { Checkbox, Input, Flex } from "antd";
import "./index.less";
function CustomInput({ checkboxValue, text, checkBoxField, inputField }) {
  return (
    <Flex className="custom-input-main">
      <Checkbox {...checkBoxField} className="checkbox-text">
        {text}
      </Checkbox>
      {checkboxValue === true && (
        <Input {...inputField} className="input-field" />
      )}
    </Flex>
  );
}
export default CustomInput;
