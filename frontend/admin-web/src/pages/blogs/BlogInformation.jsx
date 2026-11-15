import PropTypes from "prop-types";
import BlogCoverUploader from "./BlogCoverUploader";
import CustomRichTextEditor from "@src/components/CustomRichTextEditor/CustomRichTextEditor";
import CustomMultiSelect from "@src/components/CustomMultiSelect/CustomMultiSelect";
import "./BlogInformation.less";

import { Skeleton } from "antd";

const BlogInformation = ({
  generalInfo,
  setGeneralInfo,
  isLoading,
  tags,
  setTags,
  media,
  setMedia,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGeneralInfo({ ...generalInfo, [name]: value });
  };

  const handleChangee = (value) => {
    setGeneralInfo((prev) => ({ ...prev, description: value }));
  };
  return (
    <div className="blog-general-information">
      <div className="tw-mb-10">
        <h2>Blog Information</h2>
      </div>
      <div className="input-group full-width">
        <label>Title</label>
        {isLoading ? (
          <Skeleton.Button block active size="large" />
        ) : (
          <input
            type="text"
            name="title"
            className="custom-input-field-text"
            placeholder={`Enter title`}
            value={generalInfo.title}
            onChange={handleChange}
          />
        )}
      </div>
      <div className="input-group full-width">
        <label>Hashtags</label>
        <CustomMultiSelect
          tags={tags}
          setTags={setTags}
          isLoading={isLoading}
        />
      </div>

      <div className="input-group full-width">
        <label>Upload Cover Image</label>
        <BlogCoverUploader
          media={media}
          setMedia={setMedia}
          isLoading={isLoading}
          enableResizer
        />
      </div>

      <div className="input-group full-width textarea-group">
        <label>Description</label>
        {isLoading ? (
          <Skeleton.Button block active size="large" style={{ height: 190 }} />
        ) : (
          <CustomRichTextEditor
            theme="snow"
            value={generalInfo.description}
            onChange={handleChangee}
          />
        )}
      </div>
    </div>
  );
};

BlogInformation.propTypes = {
  generalInfo: PropTypes.object,
  setGeneralInfo: PropTypes.func,
  setTags: PropTypes.func,
  tags: PropTypes.array,
  setMedia: PropTypes.func,
  media: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default BlogInformation;
