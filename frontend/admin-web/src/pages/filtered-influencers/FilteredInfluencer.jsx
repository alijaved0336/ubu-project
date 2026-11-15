import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Flex } from "antd";

import { useGetUserQuery } from "@src/store/api/userApi";

import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";

import FilteredInfluencersProvider from "./Providers/FilteredInfluencersProvider";
import InfleuncerHeader from "./InfleuncerHeader";
import InfluencerList from "./InfluencerList";
import InfluencerQuestionnaireProvider from "./Providers/InfluencerQuestionnaireProvider";
import InfluencerQuestionnaireFilterModal from "./InfluencerQuestionnaireFilterModal";
import "./FilteredInfluencer.less";

const FilteredInfluencer = () => {
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
    }),
  });

  const [visibleModal, setVisibleModal] = useState(false);

  const showFilter = () => {
    setVisibleModal(true);
  };

  const handleCancelModal = () => {
    setVisibleModal(false);
  };

  return (
    <FilteredInfluencersProvider>
      <Flex vertical gap={"1rem"} className="filtered-influencer-page">
        <UBUBreadCrumb
          items={[
            { title: "Dashboard" },
            { title: <NavLink to={"/dashboard/segments"}>Segments</NavLink> },
            { title: "Influencers" },
          ]}
        />

        <InfleuncerHeader brandLogo={user?.avatar} onShowFilters={showFilter} />
        <InfluencerList />

        <InfluencerQuestionnaireProvider>
          {visibleModal && (
            <InfluencerQuestionnaireFilterModal
              isOpen={visibleModal}
              onClose={handleCancelModal}
            />
          )}
        </InfluencerQuestionnaireProvider>
      </Flex>
    </FilteredInfluencersProvider>
  );
};

export default FilteredInfluencer;
