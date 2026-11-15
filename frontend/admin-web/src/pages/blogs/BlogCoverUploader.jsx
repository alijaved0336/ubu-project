import PropTypes from "prop-types";
import { useState } from "react";
import BlackImageIcon from "@src/assets/icons/BlackImageIcon";
import ImageResizer from "@src/components/ImageResizer";
import "./BlogCoverUploader.less";
import { message, Skeleton } from "antd";
import { resizeImage } from "@src/utils/helpers";
import { Button } from "@src/components/Common/Widgets";

const BlogCoverUploader = ({
  media,
  setMedia,
  isLoading,
  enableResizer = false,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleFileChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      message.error("Only JPEG and PNG files are allowed.");
      return;
    }

    if (enableResizer) {
      // Open the Image Resizer for cropping
      setIsImageLoading(true);
      const compressedImage = await resizeImage(file);
      setSelectedImage(compressedImage); // Open image in cropper
      setIsImageLoading(false);
    } else {
      // Directly add image if resizer is disabled
      const newMedia = {
        file,
        url: URL.createObjectURL(file),
        type: "image",
        extension: file.name.split(".").pop(),
      };
      setMedia([...media, newMedia]);
    }
  };

  const handleCropDone = (croppedImage) => {
    const newMedia = {
      file: croppedImage,
      url: URL.createObjectURL(croppedImage),
      type: "image",
      extension: croppedImage.name.split(".").pop(),
    };

    setMedia([...media, newMedia]);
    setSelectedImage(null); // Close modal
  };

  const handleRemoveFile = (e) => {
    document.getElementById("media-input").value = "";
    e.preventDefault();
    setMedia([]);
  };

  return (
    <div className="blog-media">
      <div className="blog-media-upload">
        {isLoading ? (
          <Skeleton.Button block active size="large" style={{ height: 138 }} />
        ) : (
          <div className="blog-media-placeholder">
            <div className="blog-media-preview">
              {media.length > 0 ? (
                media.map((file, index) => (
                  <div key={index} className="blog-media-item tw-w-[80%]">
                    <img src={file.url} alt={`media-${index}`} />
                    <button
                      className="blog-remove-media-button"
                      onClick={handleRemoveFile}
                    >
                      X
                    </button>
                  </div>
                ))
              ) : (
                <BlackImageIcon />
              )}
            </div>

            <input
              type="file"
              accept="image/png,image/jpeg"
              id="media-input"
              onChange={handleFileChange}
              className="blog-media-input"
            />
            <div className="blog-media-instructions">
              <p>Supported Formats: JPEG, PNG</p>
              <Button
                loading={isImageLoading}
                type="button"
                className="tw-mx-auto tw-mt-3"
                onClick={() => document.getElementById("media-input").click()}
              >
                Select Image
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Show Image Resizer only if enabled */}
      {enableResizer && selectedImage && (
        <ImageResizer
          image={selectedImage}
          onCropDone={handleCropDone}
          onCancel={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

BlogCoverUploader.propTypes = {
  media: PropTypes.array,
  setMedia: PropTypes.func,
  isLoading: PropTypes.bool,
  enableResizer: PropTypes.bool, // New prop to control the resizer
};

export default BlogCoverUploader;
