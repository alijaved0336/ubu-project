import { notification } from "antd";

export const showNotification = ({
  notificationType,
  message,
  description,
  placement = "bottomRight",
  duration = 4.5,
}) => {
  notification[notificationType]({
    message,
    description,
    duration,
    placement,
  });
};
