import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import {
  useGetMarkedCandidatesAndSavedFilterQuery,
  useLazyGetAllAiInfluencersQuery,
  useLazyGetAllInfluencersQuery,
} from "@src/store/api/segmentsApi";

const initialFilters = {
  currentPage: 1,
  itemsPerPage: 10,
  searchTerm: "",
};

const FilteredInfluencersContext = createContext();

const FilteredInfluencersProvider = ({ children }) => {
  const { id } = useParams(); // Gets the segment ID from the URL
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState(initialFilters);
  const [totalItems, setTotalItems] = useState(0);

  const [influencersList, setInfluencersList] = useState([]);
  const [aiData, setAiData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);

  const [segmentFilter, setSegmentFilter] = useState({});

  const [getAllInfluencers] = useLazyGetAllInfluencersQuery();
  const [getAllAiInfluencers] = useLazyGetAllAiInfluencersQuery();

  const {
    markedCandidates,
    savedFilter,
    isLoadingMarkedCandidatesAndSavedFilters,
  } = useGetMarkedCandidatesAndSavedFilterQuery(id, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      markedCandidates: data?.markedCandidates,
      savedFilter: data?.savedFilter,
      isLoadingSegmentSummary: isLoading || isFetching,
    }),
    refetchOnMountOrArgChange: true,
  });

  const updatedFormData = useMemo(() => {
    return savedFilter
      ? Object.fromEntries(
          Object.entries(savedFilter).map(([key, value]) => [
            String(key),
            value,
          ])
        )
      : {};
  }, [savedFilter]);

  const fetchInfluencers = useCallback(async () => {
    setIsLoading(true);

    let influencersData = [];
    let total = 0;
    let aiData = [];

    if (isAiMode) {
      const response = await getAllAiInfluencers({ ...filters, id }).unwrap();
      influencersData = response?.influencers;
      total = response?.total;
      aiData = response?.AiData;
    } else {
      const response = await getAllInfluencers({ ...filters, id }).unwrap();
      influencersData = response?.influencers;
      total = response?.total;
    }

    setTotalItems(total);
    setAiData(aiData);
    setIsLoading(false);

    startTransition(() => {
      setInfluencersList(influencersData);
    });
  }, [getAllAiInfluencers, getAllInfluencers, isAiMode, filters, id]);

  useEffect(() => {
    fetchInfluencers();
  }, [fetchInfluencers]);

  useEffect(() => {
    if (savedFilter) setSegmentFilter(savedFilter);
  }, [savedFilter]);

  const handlePageChange = useCallback((pageNumber, pageSize) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: pageNumber,
      itemsPerPage: pageSize,
    }));
  }, []);

  const handleToggleAiMode = useCallback((isChecked) => {
    setIsAiMode(isChecked);
    setFilters(initialFilters);
  }, []);

  const handleSearch = useCallback((value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: 1,
      searchTerm: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setIsAiMode(false);
    setFilters({ ...initialFilters });
    setTotalItems(0);
  }, []);

  const handleUpdateSegmentFilter = useCallback((updatedFilter) => {
    setSegmentFilter(updatedFilter);
  }, []);

  const value = useMemo(
    () => ({
      isLoading: isLoading || isPending,
      isLoadingMarkedCandidatesAndSavedFilters,
      markedCandidates,
      savedFilter,
      segmentFilter,
      updatedFormData,
      influencersList,
      totalItems,
      filters,
      aiData,
      isAiMode,
      onSearch: handleSearch,
      onPageChange: handlePageChange,
      onToggleAiMode: handleToggleAiMode,
      onResetFilters: handleResetFilters,
      onUpdateSegmentFilter: handleUpdateSegmentFilter,
      fetchInfluencers,
    }),
    [
      aiData,
      isAiMode,
      isLoading,
      isPending,
      isLoadingMarkedCandidatesAndSavedFilters,
      markedCandidates,
      savedFilter,
      segmentFilter,
      updatedFormData,
      influencersList,
      filters,
      totalItems,
      handleSearch,
      handlePageChange,
      handleToggleAiMode,
      handleResetFilters,
      handleUpdateSegmentFilter,
      fetchInfluencers,
    ]
  );

  return (
    <FilteredInfluencersContext.Provider value={value}>
      {children}
    </FilteredInfluencersContext.Provider>
  );
};

FilteredInfluencersProvider.propTypes = {
  children: PropTypes.node,
};

export const useFilteredInfluencers = () => {
  return useContext(FilteredInfluencersContext) ?? {};
};

export default FilteredInfluencersProvider;
