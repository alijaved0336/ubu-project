import "../../pages/products/ViewProduct.css"; // Make sure to create this CSS file
import styled from "styled-components";

import { Card, message } from "antd";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import { Heading, Paragraph } from "@src/components/Common/Typography";

import { capitalize } from "@src/utils/helpers";
import UBUTag from "@src/components/Tag/Tag";
import NewEditIcon from "@src/assets/icons/NewEditIcon";
import ViewPostSkeleton from "./ViewPostSkeleton";
import { useGetPostByIdQuery } from "@src/store/api/postsApi";
import ItemCarousel from "@src/components/Common/Carousels/ItemCarousel/ItemCarousel";
import ItemCardSkeleton from "@src/components/Common/Cards/ItemCard/ItemCardSkeleton";
import ItemCard from "@src/components/Common/Cards/ItemCard/ItemCard";
import cn from "@src/cn";

export const StyledViewPostCard = styled(Card)`
  &:hover {
    .slick-arrow {
      visibility: visible;
      width: 2rem;
      height: 2rem;
    }
  }
  .ant-card-head {
    padding-left: 0;
    padding-right: 0;
    border-bottom: unset;
  }
  .ant-card-body {
    padding: 0;
  }
  .ant-card-cover {
    /* margin-top: 1rem; */
    /* margin-bottom: 1rem; */

    img,
    video {
      border-radius: 8px 8px 0 0;
    }
  }
`;

const ViewPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoading, post } = useGetPostByIdQuery(id, {
    selectFromResult: ({ isError, isFetching, isLoading, data }) => ({
      isLoading: isLoading || isFetching,
      error: isError,
      post: data,
    }),
    refetchOnMountOrArgChange: true,
  });

  const status = post?.status?.toLowerCase() || "";

  // const handleBack = () => {
  //   navigate("/dashboard/posts");
  // };


  const handleEdit = () => {
    navigate(`/dashboard/posts/${post?.id}/edit`);
  };

  if (isLoading) return <ViewPostSkeleton />;

  const onProductView = (id) => {
    const product = post?.affiliateProducts?.find(product => product.id === id)
    if (product && product.link) {
      window.open(product.link, "_blank");
    }else{
      message.error("There is some issue with the link. Please try again later.")
    }
  }
  

  return (
    <div className="tw-mb-8">
      <StyledViewPostCard
        style={{ width: "100%" }}
        className="hover:tw-shadow-avatar tw-transition-all tw-duration-150 tw-w-full tw-p-4"
      >
        <UBUBreadCrumb
          items={[
            { title: "Dashboard" },
            {
              title: <NavLink to="/dashboard/posts">Posts</NavLink>,
            },
            { title: "View" },
          ]}
        />
        <div className="tw-flex tw-justify-end tw-items-center tw-mb-4">
          <NewEditIcon onClick={handleEdit} />
        </div>
        <div className="tw-grid lg:tw-grid-cols-2 tw-grid-cols-1 tw-gap-5 tw-font-manrope">
          <div>
            <ItemCarousel
              media={post?.media}
              mediaContainerClassName="tw-max-h-max"
              mediaClassName="tw-aspect-square"
              className="tw-max-w-[600px] tw-mx-auto"
              showArrowsOnHover={false}
            />
          </div>
          <div className=" tw-space-y-4">
            <Heading
              level={5}
              className="tw-font-manrope tw-font-bold tw-cursor-pointer "
            >
              {post?.title}
            </Heading>

            <div className="tw-space-y-3 tw-mt-4 ">
              <Heading level={3} className="tw-font-semibold">
                Description
              </Heading>
              <Paragraph
                className="tw-font-manrope tw-text-gray-medium tw-text-sm  "
                dangerouslySetInnerHTML={{ __html: post?.body }}
              />
            </div>
            <div className="tw-space-y-4 ">
              <div className="tw-flex tw-gap-3 tw-items-center">
                <span className="tw-text-sm tw-text-black-label width-16">Status:</span>
                <div className="tw-flex tw-gap-2 tw-flex-wrap tw-items-center eighty-width">
                  <Paragraph
                    className={cn(
                      "tw-flex tw-justify-center tw-items-center tw-px-3 tw-py-[5px] tw-rounded-lg tw-bg-green-published tw-text-black-label tw-font-normal tw-text-sm tw-w-max",
                      {
                        "tw-bg-green-published": status === "published",
                        "tw-bg-yellow-300": status === "draft",
                      }
                    )}
                  >
                    {capitalize(post?.status)}
                  </Paragraph>
                </div>
              </div>
              <div className="tw-flex tw-gap-3 tw-items-center">
                <span className="tw-text-sm tw-text-black-label width-16">Tags:</span>

                <div className="tw-flex tw-items-center tw-gap-2 tw-flex-wrap eighty-width">
                  {post?.tags?.map((tag) => (
                    <UBUTag key={tag} text={tag} />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </StyledViewPostCard>

      {post?.affiliateProducts?.length > 0 && (
        <>
          <Heading level={4} className="tw-mt-5 tw-mb-3">
            Associated Products
          </Heading>
          <div className="tw-grid lg:tw-grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] tw-grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] md:tw-justify-items-start tw-justify-items-center tw-gap-8  ">
            {isLoading ? (
              <>
                <ItemCardSkeleton />
                <ItemCardSkeleton />
                <ItemCardSkeleton />
                <ItemCardSkeleton />
                <ItemCardSkeleton />
              </>
            ) : (
              <>
                {post?.affiliateProducts?.map((product, index) => {
                  // console.log("Mapped item:", { product, index }); // Log each item
                  return (
                    <ItemCard
                      type="postProduct"
                      key={index}
                      postProduct={product}
                      onView={(id) => onProductView(id)}

                    />
                  );
                })}

              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewPost;

