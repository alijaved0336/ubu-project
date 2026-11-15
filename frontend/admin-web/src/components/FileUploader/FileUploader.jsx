import FileUploaderIcon from "@src/assets/fileuploader.svg";
import { showNotification } from "@src/utils/showNotification";
import TrashOutline from "@src/assets/trash-outline.svg";
import ReUpload from "@src/assets/re-upload.svg";
import { Tooltip } from "antd";
const FileUploader = ({ file, setFile, loading }) => {
  const handleFileChange = (e) => {
    e.preventDefault();
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "text/csv") {
        setFile(selectedFile);
        // showNotification({
        //   notificationType: "success",
        //   message: "Upload successfully"
        // });
      } else {
        setFile(null);
        showNotification({
          notificationType: "error",
          message: "Upload Failed",
          description: "Please upload only CSV file.",
        });
        console.error("Invalid file type:", selectedFile.type);
      }
    }
  };
  const handleRemoveFile = (e) => {
    e.preventDefault();
    setFile(null);
  };

  const handleAddImageClick = (e) => {
    e.preventDefault();
    document.getElementById("media-input").click();
  };
  return (
    <div className="">
      <h2 className="tw-text-[1.5rem] tw-text-center tw-font-medium">
        Upload Your File{" "}
      </h2>
      <div className=" tw-mt-4 tw-text-center">
        <label className="tw-text-base  tw-font-medium tw-text-[#9A9A9A] tw-w-[100%]">
          Drag and drop your file here, or click to select from your device.
        </label>

        <div className="tw-border-2 tw-border-dashed tw-border-gray-300 tw-mt-4 tw-p-4  tw-mb-5 tw-text-center tw-flex tw-justify-center">
          {file ? (
            <div className="tw-bg-white tw-p-5 tw-rounded-lg tw-shadow-md tw-w-1/2 tw-flex tw-flex-wrap tw-justify-center tw-items-center">
              <div className="tw-flex tw-items-center">
                <h1 className="tw-w-[80%]">{file?.name}</h1>
                <div className="tw-flex">
                  <Tooltip title="Remove">
                    <img
                      src={TrashOutline}
                      className={`file-icon ${
                        !loading ? "tw-cursor-pointer" : "tw-opacity-35"
                      } `}
                      alt="trash-outline-icon"
                      onClick={(e) => (!loading ? handleRemoveFile(e) : null)}
                    />
                  </Tooltip>
                  <Tooltip title="Re-Upload">
                    <img
                      src={ReUpload}
                      alt="re-uploader-icon"
                      className={`file-icon ${
                        !loading ? "tw-cursor-pointer" : "tw-opacity-35"
                      } `}
                      onClick={!loading ? handleAddImageClick : null}
                    />
                  </Tooltip>

                  <input
                    type="file"
                    multiple
                    accept=".csv"
                    id="media-input"
                    onChange={handleFileChange}
                    className="media-input"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <input
                type="file"
                multiple
                accept=".csv"
                id="media-input"
                onChange={handleFileChange}
                className="media-input"
              />
              <div className="tw-flex tw-justify-center">
                <img
                  src={FileUploaderIcon}
                  alt="file-uploader-icon"
                  className="tw-w-20 tw-text-center tw-cursor-pointer"
                  onClick={handleAddImageClick}
                />
              </div>
              <div className="media-instructions">
                <p className="tw-text-gray-500 tw-text-lg tw-font-semibold">
                  Click to upload and attach files.
                </p>
                <p className="tw-mt-1 tw-text-sm tw-font-normal">
                  Supported Formats: CSV
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
