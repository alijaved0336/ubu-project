import CampaignIndexSkeleton from "@src/components/Skeletons/CampaignIndexSkeleton";
import axiosInstance from "../../application-wide/axios/axios-instance";
import CampaignTable from "./CampaignTable";
import "./CampaignIndex.less";

import { SearchOutlined } from "@ant-design/icons";
import { Menu, Flex } from "antd";
import { useState, useEffect } from "react";
import { UBUSearch, UBUPagination, Text as UBUText } from "@src/components";
import { useGetUserQuery } from "@src/store/api/userApi";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import PropTypes from "prop-types";
import NoData from "@src/components/NoData";
import { useNavigate } from "react-router-dom";

const CampaignIndex = () => {
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });

  const [campaigns, setCampaigns] = useState([]);
  const [isMainLoading, setIsMainLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  const navigate = useNavigate();

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
    const apiUrl = `/campaign?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`;
    try {
      const response = await axiosInstance.get(apiUrl);
      setCampaigns(response.data.campaigns);
      setTotalItems(response.data.total);
      setIsMainLoading(false);
    } catch (error) {
      setIsMainLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (value) => {
    setTotalItems(0);
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePaginationChange = (pageNumber, pageSize) => {
    setCurrentPage(pageNumber);
    setItemsPerPage(pageSize);
  };

  const handleMenuClick = (action, campaignId) => {
    if (action === "accept") {
      console.log(`Accepted campaign with ID: ${campaignId}`);
    } else if (action === "reject") {
      console.log(`Rejected campaign with ID: ${campaignId}`);
    }
  };

  const renderDropdownMenu = (campaign) => {
    const menuItems = [];

    if (campaign.status === "pending") {
      menuItems.push(
        <Menu.Item
          key="accept"
          onClick={() => handleMenuClick("accept", campaign.id)}
        >
          Accept
        </Menu.Item>
      );
      menuItems.push(
        <Menu.Item
          key="reject"
          onClick={() => handleMenuClick("reject", campaign.id)}
        >
          Reject
        </Menu.Item>
      );
    } else if (campaign.status === "accepted") {
      menuItems.push(
        <Menu.Item
          key="sign_contract"
          onClick={() => handleMenuClick("sign_contract", campaign.id)}
        >
          Sign Contract
        </Menu.Item>
      );
    }

    return <Menu>{menuItems}</Menu>;
  };

  return (
    <div className="campaign-index">
      <UBUBreadCrumb items={[{ title: "Dashboard" }, { title: "Campaigns" }]} />

      <Flex vertical gap={"1rem"}>
        {user?.is_brand && (
          <UBUText className={"fs-16 fw-600"}>Campaigns</UBUText>
        )}

        <div className="tw-flex tw-flex-col tw-my-6 tw-justify-items-start xl:tw-flex-row tw-justify-between tw-gap-4">
          <UBUSearch
            prefix={<SearchOutlined width={"16px"} height={"16px"} />}
            placeholder="Search..."
            className="tw-w-full xl:tw-basis-1/2"
            onSearch={handleSearch}
            enterButton
          />

          <UBUPagination
            className="tw-w-auto tw-ml-auto"
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            handlePaginationChange={handlePaginationChange}
          />
        </div>

        <div className="campaign-index-container">
          <CampaignTable
            fetchCampaigns={fetchData}
            campaigns={campaigns}
            setCampaigns={setCampaigns}
            loading={isMainLoading}
          />
        </div>
        {/* {isMainLoading ? (
          <CampaignIndexSkeleton />
        ) : campaigns?.length === 0 ? (
          user?.is_brand ? (
            <NoData
              componentName="campaign"
              onClick={() => navigate("/dashboard/segments/add")}
              isMessage={false}
            />
          ) : (
            <UBUText className="fs-18 tw-text-black-60 no-results">
              No Campaigns Found.
            </UBUText>
          )
        ) : (

        )} */}
      </Flex>
    </div>
  );
};

CampaignIndex.propTypes = {
  name: PropTypes.string,
  showBreadCrumb: PropTypes.bool,
};

export default CampaignIndex;
