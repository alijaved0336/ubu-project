import React, { useState, useRef, useEffect, useMemo } from "react";

import Cropper from "react-cropper";
import CustomModal from "./Modals/CustomModal";
import { Heading } from "./Common/Typography";
import PropTypes from "prop-types";
import { Button } from "./Common/Widgets";
import "cropperjs/dist/cropper.css";
import cn from "@src/cn";
import { resizeImage } from "@src/utils/helpers";

export default function ImageResizer({
  image,
  onCropDone,
  onCancel,
  shape = "default",
}) {
  const [loaded, setLoaded] = useState(false);
  const [isCroppingAndResizing, setIsCroppingAndResizing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const cropperRef = useRef(null);

  const imageSrc = useMemo(() => {
    return image ? URL.createObjectURL(image) : "";
  }, [image]);

  useEffect(() => {
    const imageToLoad = new Image();

    imageToLoad.onload = () => {
      setLoaded(true);
    };

    imageToLoad.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    console.log(loaded);
  }, [loaded]);

  const handleCrop = async () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas().toBlob(async (blob) => {
        if (blob) {
          setIsCroppingAndResizing(true);

          // const compressedImage = await resizeImage(blob);
          const file = new File([blob], image?.name, {
            type: `${image?.type}`,
          });

          setIsCroppingAndResizing(false);

          onCropDone(file);
        }
      }, `${image?.type}`);
    }
  };

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper && cropper.getCroppedCanvas()) {
      const canvas = cropper.getCroppedCanvas({
        maxWidth: 400,
        maxHeight: 400,
        imageSmoothingQuality: "high",
      });
      setPreviewUrl(canvas.toDataURL());
    }
  };
  return (
    <CustomModal
      title={
        <Heading className="tw-font-manrope tw-font-bold" level={2}>
          Resize Image
        </Heading>
      }
      width="680px"
      isOpen={!!image}
      className="!tw-h-auto"
      onCancel={onCancel}
      centered
      maskClosable={false}
      bodyWrapperClassName="tw-p-4"
      footer={
        <div className="tw-flex tw-items-center tw-gap-3 tw-justify-center">
          <Button
            className="tw-w-full"
            type="secondary"
            variant="outlined"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="tw-w-full"
            onClick={handleCrop}
            loading={isCroppingAndResizing}
          >
            Confirm
          </Button>
        </div>
      }
    >
      <div className="tw-space-y-3">
        <div className="tw-h-[400px] tw-flex tw-items-center tw-justify-center">
          {image && loaded && (
            <Cropper
              ref={cropperRef}
              style={{ height: 400, width: "100%" }}
              zoomTo={0}
              zoomOnTouch
              aspectRatio={shape === "circle" ? 1 : undefined}
              autoCropArea={0.8}
              src={imageSrc}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              checkOrientation={false}
              guides={true}
              crop={onCrop}
            />
          )}
        </div>
        {previewUrl && (
          <div className="tw-mx-auto tw-w-72 tw-h-72 tw-max-w-md tw-rounded tw-overflow-hidden tw-shadow">
            <img
              src={previewUrl}
              alt="Preview"
              className={cn(
                "tw-w-full tw-h-full tw-rounded-md tw-border tw-aspect-auto tw-object-cover"
              )}
            />
          </div>
        )}
      </div>
    </CustomModal>
  );
}

ImageResizer.propTypes = {
  image: PropTypes.object,
  shape: PropTypes.string,
  onCropDone: PropTypes.func,
  onCancel: PropTypes.func,
};
