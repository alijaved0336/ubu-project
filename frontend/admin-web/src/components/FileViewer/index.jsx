import PropTypes from "prop-types";
import Link from "antd/es/typography/Link";

import { Flex, Image } from "antd";
import { useState, useEffect } from "react";

const FileViewer = ({ fileUrl }) => {
  const [fileType, setFileType] = useState("");

  useEffect(() => {
    const getFileExtension = (url) => {
      const ext = url.split(".").pop().toLowerCase();
      return ext;
    };

    setFileType(getFileExtension(fileUrl));
  }, [fileUrl]);

  const renderFile = () => {
    if (fileType === "mp4") {
      return (
        <video controls className="tw-w-72">
          <source src={fileUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (fileType === "png" || fileType === "jpg" || fileType === "jpeg") {
      return (
        <Flex className="tw-w-72">
          <Image preview={true} src={fileUrl} />{" "}
        </Flex>
      );
    }

    if (fileType === "pdf") {
      return (
        <iframe
          src={fileUrl}
          className="tw-w-72"
          height="500px"
          title="PDF Document"
        />
      );
    }

    if (fileType === "docx" || fileType === "doc") {
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${fileUrl}`}
          className="tw-w-72"
          height="500px"
          title="Word Document"
        />
      );
    }

    if (fileType === "xls" || fileType === "xlsx") {
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${fileUrl}`}
          className="tw-w-72"
          height="500px"
          title="Excel Document"
        />
      );
    }

    return (
      <Link target="_blank" href={fileUrl}>
        {fileUrl}
      </Link>
    );
  };

  return <div>{renderFile()}</div>;
};

FileViewer.propTypes = {
  fileUrl: PropTypes.string,
};

export default FileViewer;
