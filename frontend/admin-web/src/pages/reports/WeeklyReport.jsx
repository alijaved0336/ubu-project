import FileUploader from "@src/components/FileUploader/FileUploader";
import { showNotification } from "@src/utils/showNotification";
import { Spin } from "antd";
import { Button } from "@src/components/Common/Widgets";
import { useState } from "react";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import axios from "axios";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";

const WeeklyReport = () => {
  const [file, setFile] = useState();
  const [loading, isLoading] = useState(false);
  const handleUploadFile = async (e) => {
    e.preventDefault();
    if (file) {
      isLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axiosInstance.post(
          "/files/affiliate-weekly-report/upload",
          formData
        );
        isLoading(false);
        showNotification({
          notificationType: "success",
          message: "Upload successfully",
        });
        setFile(null)
      } catch (error) {
        console.error("Error fetching post data:", error);
        isLoading(false);
        showNotification({
          notificationType: "error",
          message: `${error?.response?.data?.message || error?.message}`,
        });
      }
    } else {
      showNotification({
        notificationType: "error",
        message: "File Not Uploaded",
        description: "Please upload only CSV file.",
      });
    }
  };
  return (
    <>
      <UBUBreadCrumb items={[{ title: "Dashboard" }, { title: "Reports" }]} />
      <div className="tw-h-full tw-flex tw-flex-col tw-justify-center">
        <FileUploader file={file} setFile={setFile} loading={loading} />
        <div className="tw-flex tw-justify-center">
          <Button
            onClick={handleUploadFile}
            className="tw-w-32 !tw-bg-[#DDDDDD]"
            variant="secondary"
          >
            Save File {loading ? <Spin /> : null}
          </Button>
        </div>
      </div>
    </>
  );
};

export default WeeklyReport;
