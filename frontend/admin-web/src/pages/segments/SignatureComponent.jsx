// SignaturePadComponent.jsx
import React, { useRef, useEffect, useState } from "react";
import SignaturePad from "signature_pad";
import "./SignatureComponent.less"; // Make sure to include the CSS file with the above styles
import axiosInstance from "../../application-wide/axios/axios-instance";
import SmallLoader from "../../components/SmallLoader";
import { Spin, Button, Flex } from "antd";
import { v4 as uuidv4 } from "uuid";
import { CustomButton, Text } from "@src/components";
import { Delete } from "@src/assets/icons";

const SignatureComponent = ({ handleSignatureInsert, isLoading, inf_id }) => {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);
  const [signatureUploadLoading, setSignatureUploadLoading] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Initialize SignaturePad
    signaturePadRef.current = new SignaturePad(canvas);

    signaturePadRef.current.addEventListener("beginStroke", () => {
      setHasSignature(true);
    });

    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
        signaturePadRef.current = null;
      }
    };
  }, []);

  const clearSignature = () => {
    signaturePadRef.current && signaturePadRef.current.clear();
    setHasSignature(false);
  };

  const base64ToBlob = (base64) => {
    const byteString = atob(base64.split(",")[1]); // Decode base64
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0]; // Get MIME type

    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  };

  const handleInsert = () => {
    setSignatureUploadLoading(true);
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      // const dataURL = signaturePadRef.current.toDataURL();
      const dataURL = signaturePadRef.current.toDataURL("image/png");
      const blob = base64ToBlob(dataURL);
      const file = new File([blob], `signature-${uuidv4()}.png`, {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("files", file);
      formData.append("folderName", "signatures");

      axiosInstance
        .post("/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(
            "File2 uploaded successfully:",
            response.data.urls[0].url
          );
          handleSignatureInsert(response.data.urls[0].url);
          clearSignature();
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        })
        .finally(() => {

          setSignatureUploadLoading(false);
        });
    }
  };

  return (
    <div className="signature-container">
      <Flex vertical gap={8}>
        <Flex justify="space-between" align="center">
          <Text className="fs-18 fw-600 tw-text-black-300 signature-title">
            Signature
          </Text>
          <div className="delete-icon-wrapper" onClick={clearSignature}>
            <Delete />
          </div>
        </Flex>

        <canvas ref={canvasRef} className="signature-pad-canvas"></canvas>
      </Flex>
      <div className="signature-actions">
        <CustomButton
          className="signature-insert-button"
          variant={"black"}
          onClick={handleInsert}
          loading={isLoading || signatureUploadLoading}
          disabled={!hasSignature}
        >
          Insert Signature
        </CustomButton>
      </div>
    </div>
  );
};

export default SignatureComponent;
