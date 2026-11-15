import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import "./ViewProduct.css"; // Make sure to create this CSS file
import axiosInstance from "../../application-wide/axios/axios-instance";
import { Button, Carousel, Flex, Tooltip } from "antd";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import NewEditIcon from "@src/assets/icons/NewEditIcon";
import ItemCarousel from "@src/components/Common/Carousels/ItemCarousel/ItemCarousel";
import { Heading, Paragraph } from "@src/components/Common/Typography";
import { Card, message } from "antd";
import styled from "styled-components";
import cn from "@src/cn";
import { capitalize, formattedAmount } from "@src/utils/helpers";
import UBUTag from "@src/components/Tag/Tag";
import ItemCard from "@src/components/Common/Cards/ItemCard/ItemCard";
import ViewPostSkeleton from "../post/ViewPostSkeleton";
import ViewProductSkeleton from "./ViewProductSkeleton";


export const StyledViewProductCard = styled(Card)`
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

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const status = (product?.status === "true" || product?.status === true) ? 'published' : 'draft'

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      const apiUrl = `/products/${id}`; // Replace with your API endpoint

      try {
        const response = await axiosInstance.get(apiUrl);
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }finally{
        setLoading(false)
      }
    };

    fetchProduct();
  }, [id]);

  if (loading || !product) return <ViewProductSkeleton />;


  const handleBack = () => {
    navigate("/dashboard/products");
  };

  const handleEdit = () => {
    navigate(`/dashboard/products/edit/${product?.id}`)
  };



  return (
    <div className="tw-mb-8">
      <StyledViewProductCard
        style={{ width: "100%" }}
        className="hover:tw-shadow-avatar tw-transition-all tw-duration-150 tw-w-full tw-p-4"
      >

        <UBUBreadCrumb
          items={[
            { title: "Dashboard" },
            {
              title: <NavLink to={"/dashboard/products"}>Products</NavLink>,
            },
            { title: "View" },
          ]}
        />
        <Flex gap="small" justify="end" className=" tw-mb-4" style={{ width: "100%" }}>
          <Button onClick={handleEdit}>
            Edit
          </Button>

          <Button onClick={handleBack}>
            Back
          </Button>
        </Flex>

        <div className="tw-grid lg:tw-grid-cols-2 tw-grid-cols-1 tw-gap-5 tw-font-manrope">

          <div>
            <ItemCarousel
              media={product?.media}
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
              {product?.name}
            </Heading>

            <div className="tw-space-y-3 tw-mt-4 ">
              <Heading level={3} className="tw-font-semibold">
                Description
              </Heading>
              <Paragraph
                className="tw-font-manrope tw-text-gray-medium tw-text-sm  "
                dangerouslySetInnerHTML={{ __html: product?.description }}
              />
            </div>


            <div className="tw-space-y-4 ">


              <div className="tw-flex tw-gap-3 tw-items-center">
                <span className="tw-text-sm tw-text-black-label width-18">Category:</span>
                <div className="tw-flex tw-items-center tw-gap-2 tw-flex-wrap eighty-width">
                  {product.category?.name}
                </div>
              </div>

              <div className="tw-flex tw-gap-3 tw-items-center">
                <span className="tw-text-sm tw-text-black-label">Sub-category:</span>
                <div className="tw-flex tw-items-center tw-gap-2 tw-flex-wrap eighty-width">
                  {product.sub_category?.name}
                </div>
              </div>

              <div className="tw-flex tw-gap-3 tw-items-center">
                <span className="tw-text-sm tw-text-black-label width-16">Gender:</span>
                <div className="tw-flex tw-items-center tw-gap-2 tw-flex-wrap eighty-width">
                  {product.genders?.name}
                </div>
              </div>


              <div className="tw-flex tw-gap-3 tw-items-center">
                <span className="tw-text-sm tw-text-black-label width-16">Style:</span>
                <div className="tw-flex tw-items-center tw-gap-2 tw-flex-wrap eighty-width">
                  {product.styles?.name || "Not specified"}
                </div>
              </div>

              <div className="tw-flex tw-gap-3 tw-items-center">
                <span className="tw-text-sm tw-text-black-label">Available Sizes:</span>
                <div className="tw-flex tw-items-center tw-gap-2 tw-flex-wrap eighty-width">
                  {product.productSizes.map((size) => size.size.label).join(", ")}
                </div>
              </div>

              <div className="tw-flex tw-gap-3 tw-items-center">
                <span className="tw-text-sm tw-text-black-label width-16">Price:</span>
                <div className="tw-flex tw-items-center tw-gap-2 tw-flex-wrap eighty-width">
                  {formattedAmount(product?.price)}
                </div>
              </div>


              <div className="tw-flex tw-gap-3 tw-items-center">
                <span className="tw-text-sm tw-text-black-label width-16">Tags:</span>
                <div className="tw-flex tw-items-center tw-gap-2 tw-flex-wrap eighty-width">
                  {product?.tags?.map((tag) => (
                    <UBUTag key={tag} text={tag} />
                  ))}
                </div>
              </div>


              <div className="tw-flex tw-gap-3 tw-items-center">
                <span className="tw-text-sm tw-text-black-label width-16">Colors:</span>
                <div className="tw-flex tw-items-center tw-gap-2 tw-flex-wrap eighty-width">
                  <Flex gap={4} align="center" wrap={false}>
                    {product?.colors && Object.keys(product?.colors).length > 0 ? (
                      Object.keys(product?.colors).map((color_name) => (
                        <Tooltip key={color_name} title={color_name}>
                          <span
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              backgroundColor: product?.colors[color_name], // Directly using color
                              border: "1px solid black",
                              display: "inline-flex", // Fixes disappearing issue
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          />
                        </Tooltip>
                      ))
                    ) : (
                      <Tooltip title="No Color">
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            border: "1px solid #ccc",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "red",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          ✕
                        </span>
                      </Tooltip>
                    )}
                  </Flex>
                </div>
              </div>







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
                    {capitalize(status)}
                  </Paragraph>
                </div>
              </div>





            </div>  
          </div>
        </div>
      </StyledViewProductCard>



    </div>
  );
};

export default ViewProduct;
