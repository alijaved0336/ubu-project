import PropTypes from "prop-types";
import "./DocumentPreview.less";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { UBUModal } from "@src/components";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const DocumentPreview = ({ docUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numPages, setNumPages] = useState(1);
  const [pageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="document-preview-container">
      {/* Small Thumbnail Div */}
      <div className="document-header">
        <div
          className="document-thumbnail"
          onClick={() => setIsModalOpen(true)}
        >
          <Document className={'tw-flex tw-justify-center'} file={docUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page scale={1.25} pageNumber={pageNumber} width={200} />
          </Document>
        </div>
      </div>

      <UBUModal
        title="Campaign Document"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width="50%"
        footer={[]}
      >
        <Document className={'tw-overflow-auto tw-flex'} file={docUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <div className="tw-flex tw-w-full tw-flex-col tw-items-center">
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                className="document-page"
                key={index}
                scale={1.15}
                pageNumber={index + 1}
              />
            ))}
          </div>
        </Document>
        <p></p>
      </UBUModal>
    </div>
  );
};

DocumentPreview.propTypes = {
  docUrl: PropTypes.string,
};


export default DocumentPreview;
