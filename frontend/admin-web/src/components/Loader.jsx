import React from 'react';
import './Loader.less';
import { Layout} from 'antd';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
