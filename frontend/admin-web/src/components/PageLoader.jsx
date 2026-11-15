import { Spin } from 'antd'
import React from 'react'
import { memo } from 'react'

const PageLoader = () => (
  <Spin
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.7)', /* Slight white overlay */
      zIndex: '1000'
    }}
  />
)

export default memo(PageLoader)
