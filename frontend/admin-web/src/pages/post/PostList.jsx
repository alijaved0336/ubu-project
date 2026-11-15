import { usePosts } from "@src/components/Providers/PostsProvider";
import ItemCard from "@src/components/Common/Cards/ItemCard/ItemCard";
import ItemCardSkeleton from "@src/components/Common/Cards/ItemCard/ItemCardSkeleton";
import NoData from "@src/components/NoData";

const PostList = () => {
  const { isLoading, posts, onView, onEdit, onDelete, filters, onCreate } =
    usePosts();

  const handleOpenCreatePostModal = () => {
    onCreate();
  };

  if (!isLoading && !posts?.length) {
    return (
      <div style={{ display: "contents" }}>
        <div className="tw-flex tw-justify-center tw-items-center tw-w-full tw-gap-5">
          {!filters?.searchTerm ? (
            <NoData
              componentName="post"
              onClick={handleOpenCreatePostModal}
              isMessage={false}
            />
          ) : (
            <NoData
              isMessage
              message={`No post found against this search "${filters?.searchTerm}"`}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="tw-grid lg:tw-grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] tw-grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] md:tw-justify-items-start tw-justify-items-center tw-gap-8">
      {isLoading ? (
        <>
          <ItemCardSkeleton />
          <ItemCardSkeleton />
          <ItemCardSkeleton />
          <ItemCardSkeleton />
          <ItemCardSkeleton />
        </>
      ) : (
        posts?.map((post) => (
          <ItemCard
            type="post"
            key={post?.id}
            post={post}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default PostList;
