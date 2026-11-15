import BlogInformation from "./BlogInformation";
import SuccessModal from "@src/components/SuccessModal/SuccessModal";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import "./CreateBlog.less";

import { Button, message } from "antd";
import { useEffect, useState } from "react";
import { isSuccess } from "@src/utils/responseHelpers";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@src/utils/showNotification";
import { hasInvalidFontSizes } from "@src/utils/formateFunctions";

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [manuallyAddedMedia, setManuallyAddedMedia] = useState([]);
  const [submitting, setIsSubmitting] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalInfo, setGeneralInfo] = useState({
    title: "",
    description: "",
  });
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await axiosInstance.get(`blog/${id}`);
        const data = response.data;
        setGeneralInfo({ title: data.title, description: data.description });
        const options = response?.data?.blogTags?.map((blogTag) => ({
          value: blogTag.tag.id,
          label: blogTag.tag.tagName,
          isNew: false,
        }));
        setManuallyAddedMedia(data.media ?? []);
        setTags(options ?? []);
      } catch (error) {
        console.error("Error fetching product options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

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
          let urlData = [];
          if (productData.files) {
            productData.files.forEach((fileData) => {
              if (fileData.file) {
                formData.append(`files`, fileData.file);
              } else {
                urlData.push({
                  url: fileData.url,
                  type: fileData.type,
                  extension: fileData.extension,
                });
              }
            });
          }
  
          if (urlData.length > 0) {
            urlData.forEach((item, index) => {
              for (const key in item) {
                formData.append(`urls[${index}][${key}]`, item[key]);
              }
            });
          }
        } else if (key === "tags") {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      }
      const res = await axiosInstance.put(`/blog/${id}`, formData);
      if (isSuccess(res.status)) {
        setIsSuccessModalVisible(true);
      } else {
        showNotification({
          notificationType: "error",
          message: `Something Went Wrong`,
          description: "Blog could not be updated",
        });
      }
    } catch (error) {
      console.error(error);
      showNotification({
        notificationType: "error",
        message: `Something Went Wrong`,
        description: "Blog could not be updated",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-blog-container">
      <div className="add-blog-content">
        <div className="add-blog-header">
          <h1 className="tw-font-bold tw-text-lg">Edit Blog</h1>
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
                isLoading={loading}
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
          heading={"Blog Updated Successfully!"}
          message={"Your blog has been updated"}
        />
      )}
    </div>
  );
};

export default EditBlog;
