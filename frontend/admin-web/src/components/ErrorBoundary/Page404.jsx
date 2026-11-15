import React from 'react';
import { Button, Result } from 'antd';
import './Page404.less';  // Import the less file

const Page404 = () => (
  <div className="page404">
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      // extra={<Button type="primary">Back Home</Button>}
    />
  </div>
);

export default Page404;
