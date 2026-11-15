import { Skeleton } from "antd";

const BlogCardSkeleton = () => {
  return (
    <Skeleton.Button
      active
      size="large"
      style={{ height: 200, width: "100%" }}
    />
  );
};

export default BlogCardSkeleton;
