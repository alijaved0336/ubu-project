import React from 'react';
import './UploadMedia.less';
import { UploadOutlined } from '@ant-design/icons';
const UploadMedia = ({ onUpload }) => {
  return (
    <div className="upload-media-component">
      <div className='upload-text'>Upload Media</div>
      <div className="upload-media">
        <label className="upload-label" htmlFor="fileUpload">
          <div className="upload-icon">
            <UploadOutlined style={{ fontSize: '24px', color: '#ccc' }} />
          </div>
          <p>Click to upload and attach files</p>
          <span>PNG, JPG or mp4 (max. 1080×1080px)</span>
          <span style={{color: '#f5a0a0'}}>Maximum 9 Media Items are Allowed</span>
        </label>
        <input
          id="fileUpload"
          type="file"
          multiple
          accept="image/png, image/jpeg, video/mp4"
          onChange={onUpload}
          hidden
        />
      </div>
    </div>
  );
};

export default UploadMedia;
