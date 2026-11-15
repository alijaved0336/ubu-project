import React from 'react';
import { Oval } from 'react-loader-spinner';
import './SmallLoader.less'; // We'll create this CSS file next

const SmallLoader = ({ height = 40, width = 40 }) => {
  return (
      <div className="small-loader-overlay">
        <Oval
          height={height}
          width={width}
          color="#000000"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor="#f3f3f3"
          strokeWidth={5}
          strokeWidthSecondary={5}
        />
      </div>
  );
};

export default SmallLoader;
