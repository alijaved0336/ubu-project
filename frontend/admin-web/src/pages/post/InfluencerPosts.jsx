import "./infPost.less";

import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";

import PostList from "./PostList";
import PostsProvider from "@src/components/Providers/PostsProvider";
import PostHeader from "./PostHeader";

const InfluencerPosts = () => {
  return (
    <PostsProvider>
      <div className="tw-mb-8">
        <UBUBreadCrumb
          items={[
            { title: "Dashboard" },
            {
              title: "Posts",
            },
          ]}
        />

        <PostHeader />
        <PostList />
      </div>
    </PostsProvider>
  );
};
export default InfluencerPosts;
