import BlogInformation from "./BlogInformation";
import SuccessModal from "@src/components/SuccessModal/SuccessModal";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import "./CreateBlog.less";

import { Button, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@src/utils/showNotification";
import { isSuccess } from "@src/utils/responseHelpers";
import { hasInvalidFontSizes } from "@src/utils/formateFunctions";

const CreateBlog = () => {
  const navigate = useNavigate();
  const [manuallyAddedMedia, setManuallyAddedMedia] = useState([]);
  const [submitting, setIsSubmitting] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [tags, setTags] = useState([]);
  const [generalInfo, setGeneralInfo] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const warnings = [
      { condition: !generalInfo.title, message: "Please enter blog title" },
      {
        condition: !generalInfo.description,
        message: "Please enter blog description",
      },
    ];

    for (const { condition, message: warningMessage } of warnings) {
      if (condition) {
        message.warning(warningMessage);
        return;
      }
    }

    if (hasInvalidFontSizes(generalInfo.description)) {
      message.warning("You cannot have different font sizes within paragraphs");
      return;
    }

    setIsSubmitting(true);
    const productData = {
      title: generalInfo.title,
      description: generalInfo.description,
      files: manuallyAddedMedia.length ? manuallyAddedMedia : [],
    };

    if (tags.length > 0) {
      productData.tags = tags.map((tag) => {
        if (!tag.isNew) {
          return {
            ...tag,
            value: tag.value.toString(),
          };
        }
        return tag;
      });
    }

    try {
      const formData = new FormData();
      for (const key in productData) {
        if (key === "files") {
          productData[key].forEach((fileData) => {
            console.log(fileData)
            formData.append(`files`, fileData.file);
          });
        } else if (key === "tags") {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      }
      const res = await axiosInstance.post("/blog", formData);
      if (isSuccess(res.status)) {
        setIsSuccessModalVisible(true);
      } else {
        showNotification({
          notificationType: "error",
          message: `Something went wrong`,
          description: "Blog could not be created",
        });
      }
    } catch (error) {
      console.error(error);
      showNotification({
        notificationType: "error",
        message: `Something went wrong`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-blog-container">
      <div className="add-blog-content">
        <div className="add-blog-header">
          <h1 className="tw-font-bold tw-text-lg">Create Blog</h1>
          <button
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
        <form>
          <div className="form-content">
            <div className="blog-left-section">
              <BlogInformation
                tags={tags}
                setTags={setTags}
                generalInfo={generalInfo}
                setGeneralInfo={setGeneralInfo}
                parent={"Post"}
                media={manuallyAddedMedia}
                setMedia={setManuallyAddedMedia}
              />
            </div>
          </div>
          <div className="submit-button-container">
            <Button
              loading={submitting}
              type="submit"
              onClick={handleSubmit}
              className="submit-button"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
      {isSuccessModalVisible && (
        <SuccessModal
          onClose={() => navigate("/dashboard/blogs")}
          heading={"Blog Created Successfully!"}
          message={"Your blog has been created"}
        />
      )}
    </div>
  );
};

export default CreateBlog;
