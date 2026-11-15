import ProposalTable from "../../pages/proposals";
import CampaignIndex from "../../pages/campaigns/CampaignIndex";
import BusinessIndex from "../../pages/influencer-business/BusinessIndex";

import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UBUBreadCrumb from "../UBUBreadCrumb/UBUBreadCrumb";

const TabsLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const initialActiveKey = query.get("tab") || "2";
  const [activeKey, setActiveKey] = useState(initialActiveKey);

  useEffect(() => {
    if (query.get("tab") !== activeKey) {
      setActiveKey(query.get("tab") || "2");
    }
  }, [location.search]);

  const items = [
    {
      key: "1",
      label: "Businesses",
      children: <BusinessIndex key={activeKey} showBreadCrumb={false} />,
    },
    {
      key: "2",
      label: "Proposals",
      children: <ProposalTable key={activeKey} showBreadCrumb={false} />,
    },
    {
      key: "3",
      label: "Campaigns",
      children: <CampaignIndex key={activeKey} showBreadCrumb={false} />,
    },
  ];

  const onTabChange = (key) => {
    setActiveKey(key);
    navigate(`${location.pathname}?tab=${key}`, { replace: true });
  };
  useEffect(() => {}, []);

  return (
    <>
      <UBUBreadCrumb
        items={[{ title: "Dashboard" }, { title: "Proposals" }]}
        override
      />
      <Tabs activeKey={activeKey} onChange={onTabChange} items={items} />
    </>
  );
};

export default TabsLayout;
