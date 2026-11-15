import React, { useState, useEffect, useCallback } from "react";

import axiosInstance from "../../application-wide/axios/axios-instance";
import BusinessCard from "./BusinessCard";
import "./BusinessIndex.less";

import { Flex, Typography, Checkbox, Input, Form, Radio } from "antd";
import { Controller, useForm } from "react-hook-form";
import { getRandomColor } from "@src/utils/commonFunctions";
import { useGetUserQuery } from "@src/store/api/userApi";
import { CustomButton, UBUPagination, UBUSearch } from "@src/components";
import { SearchOutlined } from "@ant-design/icons";
import BusinessCardSkeleton from "./BusinessCardSkeleton";
import CustomModal from "@src/components/Modals/CustomModal";
import { Heading } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";

const BusinessIndex = () => {
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });

  const [businesses, setBusinesses] = useState([]);
  const [potentialBrands, setPotentialBrands] = useState([]);

  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  const [isLoadingInfluencerById, setIsLoadingInfluencerById] = useState(true);

  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [questionnaireData, setQuestionnaireData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [totalItems, setTotalItems] = useState(0);

  const [visibleModal, setVisibleModal] = useState(false);

  const { Text } = Typography;
  const form = useForm();
  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    watch,
    setValue,
    reset,
  } = form;

  const loading = isLoadingBrands || isLoadingInfluencerById;

  const fetchBrands = useCallback(async () => {
    setIsLoadingBrands(true);

    try {
      const response = await axiosInstance.get(
        `/brand?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
      );

      // console.log("Data from Brand aasssss ::::: ", businessesResponse);
      // setFilteredBusinesses(response.data);
      setBusinesses(response?.data?.result);
      setTotalItems(response?.data?.total);
    } catch (error) {
      console.error("Error fetching influencers:", error);
      setError("Failed to load influencers.");
    } finally {
      setIsLoadingBrands(false);
    }
  }, [currentPage, itemsPerPage, searchTerm]);

  const fetchInfluencerById = useCallback(async () => {
    if (!user?.id) return;

    setIsLoadingInfluencerById(true);

    try {
      const influencerByIdResponse = await axiosInstance.get(
        `/influencer/by_user_id/${user.id}`
      );

      const potentialBrands = influencerByIdResponse?.data?.potentialBrands
        ? influencerByIdResponse?.data?.potentialBrands
        : [];

      setPotentialBrands(potentialBrands);
    } catch (error) {
      console.error(error?.message);
    } finally {
      setIsLoadingInfluencerById(false);
    }
  }, [user?.id]);

  const updateQuestionData = async (response) => {
    return response.data
      .filter((record) => [16, 17, 21].includes(record.id))
      .map((record) => {
        if (record.id === 16) {
          return {
            ...record,
            title: "Followers", // Add title for id 16
          };
        } else if (record.id === 17) {
          return {
            ...record,
            title: "Region", // Add title for id 17
          };
        } else if (record.id === 21) {
          return {
            ...record,
            title: "Category", // Add title for id 21
            is_multi_selected: true, // Set is_multi_selected to true for id 21
          };
        }
        return record;
      });
  };

  const fetchQuestionnaireData = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/questionnaire/brand");

      const data = await updateQuestionData(response);
      setQuestionnaireData(data);
    } catch (error) {
      console.error("Error fetching questionnaire data:", error);
      setError("Failed to load form data.");
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  useEffect(() => {
    fetchInfluencerById();
  }, [fetchInfluencerById]);

  useEffect(() => {
    fetchQuestionnaireData();
  }, [fetchQuestionnaireData]);

  // if (error) {
  //   return <div className="error">{error}</div>;
  // }

  const handleSearch = async (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePaginationChange = (pageNumber, pageSize) => {
    setCurrentPage(pageNumber);
    setItemsPerPage(pageSize);
  };

  const showFilter = () => {
    setVisibleModal(true);
  };

  const handleCancelModal = () => {
    setVisibleModal(false);
  };

  const onSubmit = async (values) => {
    setIsLoadingBrands(true);
    try {
      const newFormData = {};

      if (values) {
        Object.keys(values).forEach((key) => {
          newFormData[key] = values[key];
        });
      }

      const response = await axiosInstance.post(
        `/brand/filtered_data`,
        newFormData
      );
      setBusinesses(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setVisibleModal(false);
      setIsLoadingBrands(false);
      setCurrentPage(1);
    }
    // console.log("Form data submitted:", newFormData);
  };

  return (
    <div className="business-influencer-page tw-space-y-6">
      <UBUBreadCrumb
        items={[{ title: "Dashboard" }, { title: "Businesses" }]}
      />

      <div className="segment-buttons">
        <CustomButton onClick={showFilter} variant={"black"}>
          <i className="fas fa-filter"></i> Filters
        </CustomButton>
      </div>

      <div className="business-controls">
        <UBUSearch
          prefix={<SearchOutlined width={"16px"} height={"16px"} />}
          placeholder="Search..."
          onSearch={handleSearch}
          className="search-bar"
          enterButton
        />
        <UBUPagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          handlePaginationChange={handlePaginationChange}
        />
      </div>

      {loading ? (
        <div className="business-list">
          <BusinessCardSkeleton />
          <BusinessCardSkeleton />
          <BusinessCardSkeleton />
        </div>
      ) : (
        <div className="business-list">
          {businesses && businesses?.length > 0 ? (
            businesses.map((business) => (
              <BusinessCard
                key={business?.id}
                potentialBrands={potentialBrands}
                business={business}
                backgroundColor={getRandomColor()}
              />
            ))
          ) : (
            <div className="no-records">No Brand Found.</div>
          )}
        </div>
      )}

      <CustomModal
        title={
          <Heading level={2} className="tw-font-manrope">
            Filters
          </Heading>
        }
        isOpen={visibleModal}
        onCancel={handleCancelModal}
        className="filter-modal"
        width="75%"
        style={{ top: 20 }}
        footer={[]}
      >
        <Form onFinish={handleSubmit(onSubmit)}>
          <Flex vertical align="start" className="inf-form-pdiv" gap="large">
            {questionnaireData?.map((questions) => (
              <Flex
                vertical
                className="inf-demographics"
                gap="middle"
                key={questions?.id}
              >
                {/* Render question title or question */}
                <Flex
                  vertical
                  className="inf-demographics-child"
                  gap="middle"
                  key={questions?.id}
                >
                  <Text
                    className={
                      questions?.title
                        ? "inf-demographics-text2"
                        : "inf-demographics-text2-ques"
                    }
                  >
                    {questions?.title || questions?.question}
                  </Text>
                  <Text className="inf-demographics-text2-desc">
                    {questions?.description}
                  </Text>

                  {/* Check if the question is multi-selected (checkboxes) or single-selected (radio buttons) */}
                  {questions?.is_multi_selected ? (
                    // Render Checkbox Group for multi-select questions
                    <Controller
                      name={String(questions?.id)}
                      control={control}
                      render={({ field }) => (
                        <Checkbox.Group
                          value={field.value}
                          onChange={field.onChange}
                          className="inf-demographics-checkbox-group"
                        >
                          <Flex
                            className="inf-demographics-options flex-item-parent"
                            gap="large"
                          >
                            {questions.options.map((option) => (
                              <Flex
                                key={option}
                                className="inf-demographic-item flex-item"
                              >
                                <Checkbox
                                  value={option}
                                  className="brand-cbs-row-cb"
                                >
                                  {option}
                                </Checkbox>
                              </Flex>
                            ))}
                          </Flex>
                        </Checkbox.Group>
                      )}
                    />
                  ) : (
                    // Render Radio Group for single-select questions
                    <Controller
                      name={String(questions?.id)}
                      control={control}
                      render={({ field }) => (
                        <Radio.Group
                          value={field.value}
                          onChange={field.onChange}
                          className="inf-demographics-radio-group"
                        >
                          <Flex
                            className="inf-demographics-options flex-item-parent"
                            gap="large"
                          >
                            {questions.options.map((option) => (
                              <Flex
                                key={option}
                                className="inf-demographic-item flex-item"
                              >
                                <Radio
                                  value={option}
                                  className="brand-radio-row-cb"
                                >
                                  {option}
                                </Radio>
                              </Flex>
                            ))}
                          </Flex>
                        </Radio.Group>
                      )}
                    />
                  )}
                </Flex>
              </Flex>
            ))}
          </Flex>

          <div className="footerDiv">
            <Button
              type="primary"
              variant="outlined"
              key="cancel"
              onClick={handleCancelModal}
              className="segment-filter-cancel"
            >
              Cancel
            </Button>
            <Button htmlType="submit" className="segment-filter-submit">
              Submit
            </Button>
          </div>
        </Form>
      </CustomModal>
    </div>
  );
};

export default BusinessIndex;
