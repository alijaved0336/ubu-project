import axiosInstance from "../../application-wide/axios/axios-instance";
import NoData from "@src/components/NoData";
import SegmentHeader from "../../components/SegmentHeader/SegmentHeader";
import SegmentCard from "./SegmentCard";
import "./SegmentIndex.less";

import { isSuccess } from "@src/utils/responseHelpers";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Flex } from "antd";

import { UBUSearch, UBUPagination } from "@src/components";
import { showNotification } from "@src/utils/showNotification";
import { useGetUserQuery } from "@src/store/api/userApi";
import { Heading } from "@src/components/Common/Typography";
import SegmentHeaderSkeleton from "@src/components/SegmentHeader/SegmentHeaderSkeleton";
import SegmentCardSkeleton from "./SegmentCardSkeleton";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import { Button } from "@src/components/Common/Widgets";

const SegmentIndex = () => {
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });
  const [segments, setSegments] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [isMainLoading, setIsMainLoading] = useState(true);
  const [isSummaryDataLoading, setIsSummaryDataLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [totalItems, setTotalItems] = useState(0);
  const [brandLogo, setBrandLogo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [isSegmentDeleting, setIsSegmentDeleting] = useState({
    segmentId: null,
    status: false,
  });

  const navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchData();
      fetchSummaryData();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchData();
    }
    return () => {
      isMounted = false;
    };
  }, [currentPage, itemsPerPage, searchTerm]);

  const fetchData = async () => {
    setIsMainLoading(true);
    const apiUrl = `/segments?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`;
    try {
      const response = await axiosInstance.get(apiUrl);
      setSegments(response.data.segments);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error in fetching segments. Please try again.");
    } finally {
      setIsMainLoading(false);
    }
  };

  const fetchBrandLogo = useCallback(() => {
    const logo = user.avatar;
    if (!logo) return;
    setBrandLogo(logo);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchBrandLogo();
  }, [user, fetchBrandLogo]);

  const fetchSummaryData = async () => {
    try {
      const response = await axiosInstance.get("/segments/summary");
      const backendData = response.data;
      const data = [
        {
          title: "Planned",
          count: backendData.Planned.count,
          influencers: backendData.Planned.influencers.map((influencer) => ({
            id: influencer.id,
            name: influencer.name,
            profilePicture: influencer.profilePicture,
            segmentName: influencer.segmentName,
          })),
        },
        {
          title: "Completed",
          count: backendData.Completed.count,
          influencers: backendData.Completed.influencers.map((influencer) => ({
            id: influencer.id,
            name: influencer.name,
            profilePicture: influencer.profilePicture,
            segmentName: influencer.segmentName,
          })),
        },
        {
          title: "Current",
          count: backendData.Current.count,
          influencers: backendData.Current.influencers.map((influencer) => ({
            id: influencer.id,
            name: influencer.name,
            profilePicture: influencer.profilePicture,
            segmentName: influencer.segmentName,
          })),
        },
        {
          title: "Considering",
          count: backendData.Considering.count,
          influencers: backendData.Considering.influencers.map(
            (influencer) => ({
              id: influencer.id,
              name: influencer.name,
              profilePicture: influencer.profilePicture,
              segmentName: influencer.segmentName,
            })
          ),
        },
      ];
      setSummaryData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error in fetching segments. Please try again.");
    } finally {
      setIsSummaryDataLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsSegmentDeleting({ segmentId: id, status: true });
    try {
      const res = await axiosInstance.delete(`/segments/${id}`);
      if (isSuccess(res.status)) {
        showNotification({
          notificationType: "success",
          message: "Successfully Deleted",
          description: "Segment deleted successfully",
        });
        fetchData();
      } else {
        showSegmentDeletionError();
      }
      setIsSegmentDeleting({ segmentId: null, status: false });
    } catch (error) {
      setIsSegmentDeleting({ segmentId: null, status: false });
      let errorMessage =
        error.response?.data?.message || "Something went wrong";
      if (errorMessage == "Internal server error") {
        errorMessage = "Something went wrong";
      }
      showSegmentDeletionError(errorMessage);
      console.error("Error deleting segment:", error);
    }
  };

  const showSegmentDeletionError = (errorMessage) => {
    showNotification({
      notificationType: "error",
      message: errorMessage,
      description: "Segment deletion failed",
    });
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePaginationChange = async (pageNumber, pageSize) => {
    await setSearchTerm("");
    setCurrentPage(pageNumber);
    setItemsPerPage(pageSize);
  };

  return (
    <Flex vertical className="segment-index">
      <UBUBreadCrumb items={[{ title: "Dashboard" }, { title: "Segments" }]} />
      {isSummaryDataLoading ? (
        <SegmentHeaderSkeleton />
      ) : (
        <SegmentHeader
          brandLogo={brandLogo}
          summaryData={summaryData}
          isSummaryDataLoading={isSummaryDataLoading}
        />
      )}

      {segments.length || searchTerm || isMainLoading ? (
        <>
          <div className="segment-controls">
            <div className="search-bar-container">
              <UBUSearch
                placeholder="Search segment..."
                prefix={<SearchOutlined />}
                onSearch={handleSearch}
                enterButton
              />
            </div>
            <UBUPagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              handlePaginationChange={handlePaginationChange}
            />
          </div>
          <div className="segment_heading">
            <Heading level={3} className="tw-font-semibold">
              Segments
            </Heading>
            <Button
              type="primary"
              variant="outlined"
              icon={<PlusOutlined />}
              onClick={() => navigate("/dashboard/segments/add")}
              className=" fs-14 fw-500"
            >
              Add Segment
            </Button>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="segment-index-container">
        {/* {isMainLoading ? (
          <Loader />
        ) : (
          segments && segments.map((segment) => (
            <SegmentCard key={segment.id} segment={segment} handleDelete={handleDelete} isSegmentDeleting={isSegmentDeleting} />
          ))
          
        )} */}

        {isMainLoading ? (
          <>
            <SegmentCardSkeleton />
            <SegmentCardSkeleton />
            <SegmentCardSkeleton />
          </>
        ) : segments.length ? (
          segments.map((segment) => (
            <SegmentCard
              key={segment.id}
              segment={segment}
              handleDelete={handleDelete}
              setSegments={setSegments}
              isSegmentDeleting={isSegmentDeleting}
            />
          ))
        ) : (
          <>
            {searchTerm ? (
              <NoData
                isMessage
                message={`No segment found against this search "${searchTerm}"`}
              />
            ) : (
              <NoData
                componentName="segment"
                onClick={() => navigate("/dashboard/segments/add")}
                isMessage={false}
              />
            )}
          </>
        )}
      </div>
      {error && <div className="error">{error}</div>}
    </Flex>
  );
};

export default SegmentIndex;
