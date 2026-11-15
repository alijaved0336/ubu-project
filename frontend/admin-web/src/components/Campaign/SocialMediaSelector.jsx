import React from 'react';
import './SocialMediaSelector.less';
import { Checkbox } from 'antd';

const SocialMediaSelector = ({ selectedMedia, onClear }) => {
  return (
    <div className="social-media-checkboxes">
      <div className="social-media-item">
        <Checkbox checked />
        <i className="fab fa-instagram social-icon instagram" />
        <span className="social-label">Instagram</span>
      </div>
      <div className="social-media-item">
        <Checkbox disabled />
        <i className="fab fa-facebook-f social-icon facebook" />
        <span className="social-label">Facebook</span>
      </div>
      <div className="social-media-item">
        <Checkbox disabled/>
        <i className="fab fa-tiktok social-icon tiktok" />
        <span className="social-label">TikTok</span>
      </div>
    </div>
  );
};

export default SocialMediaSelector;
