import React, { useState } from "react";
import { Input } from "antd";

const EditableTextArea = ({
  initialValue = "", // Default initial value
  placeholder = "Please enter text", // Default placeholder
  onChange, // Callback to handle input changes
  autoSize = { minRows: 4, maxRows: 11 }, // Default autoSize behavior
  ...props // Spread operator for additional props
}) => {
  const [value, setValue] = useState(initialValue);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Call the parent-provided onChange handler if it exists
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Input.TextArea
      value={value || undefined} 
      onChange={handleInputChange}
      placeholder={placeholder}
      autoSize={autoSize}
      {...props}
      className="tw-font-manrope tw-border tw-border-gray-300 focus:tw-border-black hover:tw-border-black"
    />
  );
};

export default EditableTextArea;
