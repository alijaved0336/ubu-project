import React, { useState } from "react";
import PropTypes from "prop-types";
import MediaContext from "./MediaContext";
import "./Media.less";
import ImageResizer from "../ImageResizer";
import { message, Skeleton, Upload } from "antd";
import {
  maxAllowedManualMedia,
  maxSizeOfSingleMediaItemInMb,
} from "@src/utils/constant";
import { UploadOutlined } from "@ant-design/icons";
import { Button } from "../Common/Widgets";
import { resizeImage } from "@src/utils/helpers";

const Media = ({
  media,
  setMedia,
  mediaLimit = maxAllowedManualMedia,
  maxSizeLimitInMb = maxSizeOfSingleMediaItemInMb,
  isLoading,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleFileChange = async (e) => {
    e.preventDefault();
    const MAX_FILE_SIZE = maxSizeLimitInMb * 1024 * 1024;
    const remainingSlots = mediaLimit - media.length;

    if (remainingSlots <= 0 || e.target.files.length > remainingSlots) {
      return message.warning(
        `You cannot upload more than ${mediaLimit} media items.`
      );
    }

    let file = e.target.files[0];
    const fileType = file.type.split("/")[0];

    if (file.size > MAX_FILE_SIZE) {
      return message.warning(`File exceeds ${maxSizeLimitInMb}MB limit.`);
    }

    if (fileType === "image") {
      setIsImageLoading(true);
      const compressedImage = await resizeImage(file);
      setSelectedImage(compressedImage); // Open image in cropper
      setIsImageLoading(false);
    } else if (fileType === "video") {
      const newMedia = {
        id: Date.now(),
        file,
        url: URL.createObjectURL(file),
        type: "video",
      };
      setMedia([...media, newMedia]);
    } else {
      message.warning(
        "Unsupported file format. Only images and videos are allowed."
      );
    }
  };

  const handleRemoveFile = (e, index) => {
    const updatedMedia = media.filter((_, i) => i !== index);
    setMedia(updatedMedia);
  };

  const handleCropDone = (croppedImage) => {
    console.log({ croppedImage });
    const newMedia = {
      id: Date.now(),
      file: croppedImage,
      url: URL.createObjectURL(croppedImage),
      type: "image",
    };
    setMedia([...media, newMedia]);
    setSelectedImage(null);
  };

  return (
    <div className="media">
      <h2>Media</h2>
      <div className="media-upload">
        <label className="media-label">Upload Media</label>
        {isLoading ? (
          <Skeleton.Button block active size="large" style={{ height: 138 }} />
        ) : (
          <div className="media-placeholder">
            {/* Display Media Here */}
            <MediaContext
              media={media}
              setMedia={setMedia}
              handleRemoveFile={handleRemoveFile}
            />

            <div className="media-instructions tw-space-y-2">
              <p>Upload images or videos.</p>

              {/* <Upload
                showUploadList={false}
                beforeUpload={handleFileChange}
                onChange={handleFileChange}
                accept="image/*,video/*"
                rootClassName="tw-block"
              ></Upload> */}
              <input
                type="file"
                accept="image/*,video/*"
                id="media-input"
                onChange={handleFileChange}
                className="media-input"
              />

              <Button
                icon={<UploadOutlined />}
                className="tw-mx-auto"
                loading={isImageLoading}
                onClick={() => document.getElementById("media-input").click()}
              >
                Add Media
              </Button>

              {/* <button
                type="button"
                className="add-image-button"
                onClick={() => document.getElementById("media-input").click()}
              >
                Add Media
              </button> */}
            </div>
          </div>
        )}
      </div>

      {/* Image Crop Modal */}
      {selectedImage && (
        <ImageResizer
          image={selectedImage}
          onCropDone={handleCropDone}
          onCancel={() => {
            const newMedia = {
              id: Date.now(),
              file: selectedImage,
              url: URL.createObjectURL(selectedImage),
              type: "image",
            };
            setMedia([...media, newMedia]);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
};

Media.propTypes = {
  media: PropTypes.array,
  setMedia: PropTypes.func,
  isLoading: PropTypes.bool,
  mediaLimit: PropTypes.number,
  maxSizeLimitInMb: PropTypes.number,
};

export default Media;
