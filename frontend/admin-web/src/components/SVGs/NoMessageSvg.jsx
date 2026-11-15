
import React from 'react';
import url from '../../assets/NoMessageSvg.svg'

const NoMessageSvg = ({ width = "100%", height = "100%", ariaLabel = 'No messages icon' }) => {
    return <img src={url} alt='image' width={width} height={height} aria-label={ariaLabel} role="img" />;
  };
  
export default NoMessageSvg;
