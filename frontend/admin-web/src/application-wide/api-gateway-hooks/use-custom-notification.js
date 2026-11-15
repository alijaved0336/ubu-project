
import { useNavigate } from 'react-router-dom';
import { Button, message, notification, Space } from 'antd';
const useCustomNotification = () => {
  const [api, contextHolder] = notification.useNotification();
  //const navigate = useNavigate();
  const openNotification = (type, message, description, navigate='' ,url='') => {
    api[type]({
      message: message,
      description: description,
      duration: 2,
      onClose: () => {
        if (url) {
         navigate(url); 
        }
      },
    });
  };
  return { openNotification, contextHolder };
};
export default useCustomNotification;