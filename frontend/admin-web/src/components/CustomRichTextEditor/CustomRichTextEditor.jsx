import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CustomRichTextEditor.less";

import { message } from "antd";
import { useEffect, useRef } from "react";

const CustomRichTextEditor = ({ value, onChange, placeholder }) => {
  const quillRef = useRef(null);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/jpeg", "image/png");
    input.setAttribute("multiple", "multiple");
    input.click();

    input.onchange = async () => {
      const files = Array.from(input.files);
      const validFiles = [];

      for (const file of files) {
        if (!["image/jpeg", "image/png"].includes(file.type)) {
          message.warning(`File "${file.name}" is not a valid JPEG or PNG image.`);
          continue;
        }

        const isValid = await validateImageDimensions(file);
        if (!isValid) {
          message.warning(
            `Image "${file.name}" does not meet the minimum dimensions (700x500).`
          );
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();

        validFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            quill.insertEmbed(range?.index, "image", event.target.result);
          };
          reader.readAsDataURL(file);
        });

      }
    };
  };

  const validateImageDimensions = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          if (img.width >= 500 && img.height >= 300) {
            resolve(true);
          } else {
            resolve(false);
          }
        };
        img.onerror = () => resolve(false);
        img.src = event.target.result;
      };
      reader.onerror = () => resolve(false);
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const toolbar = quill.getModule("toolbar");
      toolbar.addHandler("image", imageHandler);
    }
  }, []);

  const toolbarOptions = [
    [{ size: ["", "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
  ];

  const quillModules = {
    toolbar: toolbarOptions,
  };

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      modules={quillModules}
    />
  );
};

CustomRichTextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default CustomRichTextEditor;
