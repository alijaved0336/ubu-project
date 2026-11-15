import NoData from "@src/components/NoData";
import FooterLayout from "../layouts/FooterLayout";
import GenericLayout from "../layouts/GenericLayout";
import LandingPageLayout from "../layouts/LandingPageLayout";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import AfiliateProductIndexSkeleton from "@src/components/Skeletons/AfiliateProductIndexSkeleton";
import "./AffiliateProductsPage.css";

import { Flex, Carousel, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { isSuccess } from "@src/utils/responseHelpers";
import { useCallback, useEffect, useState } from "react";
import { showNotification } from "@src/utils/showNotification";
import { Text, UBUPagination, UBUSearch } from "@src/components";

const AffiliateProductsPage = () => {
  const [affiliateProducts, setAffiliateProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiUrl = `/affliate-products?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`;
      const res = await axiosInstance.get(apiUrl);
      if (isSuccess(res.status)) {
        setAffiliateProducts(res.data.products);
        setTotalItems(res.data.total);
      }
    } catch (error) {
      console.error(error);
      showNotification({
        notificationType: "error",
        message: `Something went wrong`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSearch = (value) => {
    setCurrentPage(1);
    setTotalItems(0);
    setSearchTerm(value);
  };

  const handlePaginationChange = (pageNumber, pageSize) => {
    setCurrentPage(pageNumber);
    setItemsPerPage(pageSize);
  };

  return (
    <LandingPageLayout>
      <FooterLayout>
        <Flex className="affiliate-products-container">
          <GenericLayout heading="Affiliate Products">
            <Flex className="tw-flex-col tw-justify-items-start lg:tw-flex-row tw-my-4 tw-justify-between tw-gap-4 tw-px-2">
              <UBUSearch
                prefix={<SearchOutlined />}
                placeholder="Search products..."
                onSearch={handleSearch}
                className="sm:tw-w-full lg:tw-w-[70%]"
                enterButton
              />
              {totalItems > 0 && (
                <UBUPagination
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  handlePaginationChange={handlePaginationChange}
                />
              )}
            </Flex>
            <div>
              {isLoading ? (
                <AfiliateProductIndexSkeleton />
              ) : affiliateProducts.length > 0 ? (
                <div className="tw-flex tw-flex-col tw-gap-4 tw-mb-4">
                  {affiliateProducts.map((item) => (
                    <Flex
                      key={item.id}
                      vertical
                      className="products-page-container"
                    >
                      <div className="item-list">
                        <Flex className="product-card-wrapper">
                          <div className="slider-container">
                            {item.images && item.images.length > 0 ? (
                              <Carousel dots={true} autoplay>
                                {item.images.map((media, index) => (
                                  <div key={index} className="carousel-media">
                                    {media.type === "video" ? (
                                      <video controls>
                                        <source
                                          src={media.url}
                                          type={`video/${media.extension}`}
                                        />
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    ) : (
                                      <img
                                        src={media.url}
                                        alt={item.name || item.title}
                                      />
                                    )}
                                  </div>
                                ))}
                              </Carousel>
                            ) : (
                              <Flex
                                justify="center"
                                align="center"
                                style={{ height: "100%" }}
                              >
                                <Text className="fs-14 fw-400 text-center">
                                  No Media Available
                                </Text>
                              </Flex>
                            )}
                          </div>
                          <Flex vertical className="meta-info-container">
                            <Text className={"fs-18 fw-500 text-ellipsis"}>
                              {item.title}
                            </Text>
                            <Text
                              className={
                                "fs-14 fw-400 text-gray-400 truncate-text"
                              }
                            >
                              {item.description || item.body}
                            </Text>
                            <Flex className="tags-wrapper">
                              {Array.isArray(item.tags) ? (
                                item.tags.map((tag, index) => (
                                  <Tag key={index} text={tag} />
                                ))
                              ) : (
                                <Text>No tags</Text>
                              )}
                            </Flex>

                            <Flex className="meta-info">
                              <Flex className="col color-box-wrapper">
                                <Text className={"fs-14 fw-400 no-wrap-text"}>
                                  Colors:
                                </Text>
                                <Flex gap={2}>
                                  {item.colors &&
                                  Object.keys(item.colors).length > 0 ? (
                                    Object.keys(item.colors).map(
                                      (color_name) => (
                                        <div
                                          key={color_name}
                                          className="color-circle"
                                        >
                                          <div
                                            className="circle"
                                            style={{
                                              backgroundColor:
                                                item.colors[color_name],
                                              border: "1px solid black",
                                            }}
                                            title={color_name}
                                          >
                                            <span className="cross">✕</span>
                                          </div>
                                        </div>
                                      )
                                    )
                                  ) : (
                                    <div className="color-circle no-color">
                                      <span className="cross">✕</span>
                                      <div className="tooltip">No Color</div>
                                    </div>
                                  )}
                                </Flex>
                              </Flex>

                              <Flex className="col">
                                <Text className={"fs-14 fw-400 no-wrap-text"}>
                                  Gender:{" "}
                                </Text>
                                <Text
                                  className={
                                    "fs-14 fw-400 text-gray-400 no-wrap-text"
                                  }
                                >
                                  {"Male/Female"}
                                </Text>
                              </Flex>

                              <Flex className="col">
                                <Text className={"fs-14 fw-400 no-wrap-text"}>
                                  Size 1:{" "}
                                </Text>
                                <Text
                                  className={
                                    "fs-14 fw-400 text-gray-400 no-wrap-text"
                                  }
                                >
                                  {item?.size || "N/A"}
                                </Text>
                              </Flex>

                              <Flex className="col">
                                <Text className={"fs-14 fw-400 no-wrap-text"}>
                                  Size 2:{" "}
                                </Text>
                                <Text
                                  className={
                                    "fs-14 fw-400 text-gray-400 no-wrap-text"
                                  }
                                >
                                  {item?.size || "N/A"}
                                </Text>
                              </Flex>
                            </Flex>
                          </Flex>

                          <Flex vertical className="price-container">
                            <Flex vertical align="end" gap={12}>
                              <Flex gap={4}>
                                <Text className={"fs-24 fw-600 no-wrap-text"}>
                                  {item?.currency}
                                </Text>
                                <Text className={"fs-24 fw-600 no-wrap-text"}>
                                  {item?.price}
                                </Text>
                              </Flex>
                              <Flex
                                vertical
                                className="buy-now-button-container"
                              >
                                <a
                                  href={item.affiliate_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="buy-now-button"
                                >
                                  Buy Now
                                </a>
                              </Flex>
                            </Flex>
                          </Flex>

                          <Flex className="edit-button">
                            {/* Add your edit button here */}
                          </Flex>
                        </Flex>
                      </div>
                    </Flex>
                  ))}
                </div>
              ) : (
                <>
                  {searchTerm ? (
                    <NoData
                      isMessage
                      message={`No affiliate product found against this search "${searchTerm}"`}
                    />
                  ) : (
                    <NoData
                      isMessage
                      message={`No affiliate products found.`}
                    />
                  )}
                </>
              )}
            </div>
          </GenericLayout>
        </Flex>
      </FooterLayout>
    </LandingPageLayout>
  );
};

export default AffiliateProductsPage;
