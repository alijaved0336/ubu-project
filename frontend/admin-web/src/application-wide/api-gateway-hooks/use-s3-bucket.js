import { useState } from 'react';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const useS3Upload = () => {
  const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME;
  const region = import.meta.env.VITE_AWS_REGION;
  const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
  const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);


  const s3 = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const uploadFile = async (file, key) => {
    setIsUploading(true);
    setError(null);
    setFileUrl(null);
  
    try {
      const uploadParams = {
        Bucket: bucketName,
        Key: key || file.name,
        Body: file,
        ContentType: file.type,
        ACL: 'public-read', // Make the file publicly readable
      };
  
      const command = new PutObjectCommand(uploadParams);
  
      // Upload the file
      await s3.send(command);
  
      // Generate the permanent public URL
      const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${uploadParams.Key}`;
      
      setFileUrl(publicUrl);
      setIsUploading(false);
  
      return { success: true, key: uploadParams.Key, url: publicUrl };
    } catch (err) {
      console.error('S3 Upload Error:', err);
      setError(err);
      setIsUploading(false);
      return { success: false, error: err };
    }
  };
  

  return {
    uploadFile,
    uploadProgress,
    isUploading,
    error,
    fileUrl, // Return the file URL
  };
};

export default useS3Upload;
