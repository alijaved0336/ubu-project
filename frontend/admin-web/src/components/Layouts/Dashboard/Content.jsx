import cn from "@src/cn";
import { Layout } from "antd";
import PropTypes from "prop-types";

const { Content: AntdContent } = Layout;

const Content = ({ children, isVerified, isLoadingUser }) => {
  return (
    <AntdContent
      id="dashoard-main"
      className={cn(
        "main-dashboard-wrapper tw-relative  tw-overflow-auto tw-h-full"
      )}
    >
      {children}
    </AntdContent>
  );
};

Content.propTypes = {
  children: PropTypes.node,
  isVerified: PropTypes.bool,
  isLoadingUser: PropTypes.bool,
};

export default Content;
