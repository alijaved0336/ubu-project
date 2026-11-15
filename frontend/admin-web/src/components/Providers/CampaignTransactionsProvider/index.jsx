import SuccessModal from "@src/components/Common/Modals/SuccessModal";
import ProcessRefundModal from "@src/pages/Transactions/ProcessRefundModal";
import { useGetCampaignTransactionsQuery } from "@src/store/api/campaignPaymentApi";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { createContext, useContext, useMemo, useState } from "react";

const CampaignTransactionsContext = createContext();

const CampaignTransactionsProvider = ({ children }) => {
  const [isOpenProcessRefundModal, setIsOpenProcessRefundModal] =
    useState(false);

  const [campaignId, setCampaignId] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);

  const [filters, setFilters] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    searchTerm: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const { campaignTransactions, isLoading, totalCount } =
    useGetCampaignTransactionsQuery(filters, {
      selectFromResult: ({
        isError,
        isFetching,
        isLoading,
        data,
        status,
        error,
      }) => {
        const sortedCampaignTransactions =
          (data?.data?.result?.transaction_logs || []).map((transaction) => {
            const exhibitDocuments = transaction?.campaign?.exhibitDocuments;

            const sortedExhibitDocuments = Array.isArray(exhibitDocuments)
              ? exhibitDocuments.slice().sort((a, b) => {
                  const dateA = new Date(a.createdAt).getTime();
                  const dateB = new Date(b.createdAt).getTime();
                  return dateB - dateA; // Descending order (b - a)
                })
              : [];

            return {
              ...transaction,
              campaign: {
                ...transaction.campaign,
                exhibitDocuments: sortedExhibitDocuments,
              },
            };
          }) ?? [];

        return {
          isLoading: isLoading || isFetching,
          isError,
          error,
          campaignTransactions: sortedCampaignTransactions,
          totalCount: data?.data?.result?.totalCount,
          status,
        };
      },
      refetchOnMountOrArgChange: true,
    });

  const handleOpenSuccessModal = (message = "") => {
    setSuccessMessage(message);
    setIsOpenSuccessModal(true);
    setIsOpenProcessRefundModal(false);
  };

  const handleCloseSuccessModal = () => {
    setSuccessMessage("");
    setIsOpenSuccessModal(false);
  };

  const handleOpenProcessRefundModal = useCallback((campaignId) => {
    setCampaignId(campaignId);
    setIsOpenProcessRefundModal(true);
  }, []);

  const handleCloseProcessRefundModal = () => {
    setIsOpenProcessRefundModal(false);
  };

  const handlePageChange = useCallback((pageNumber, pageSize) => {
    setFilters((prevPaginationState) => ({
      ...prevPaginationState,
      currentPage: pageNumber,
      itemsPerPage: pageSize,
    }));
  }, []);

  const handleSearch = useCallback((value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: 1,
      searchTerm: value,
    }));
  }, []);

  const handleChangeStatus = useCallback((status) => {
    const updatedStatus = status || "";

    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: 1,
      status: updatedStatus,
    }));
  }, []);

  const handleDateChange = useCallback((_, [startDate, endDate]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: 1,
      startDate,
      endDate,
    }));
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      campaignTransactions,
      filters,
      totalCount,
      onSearch: handleSearch,
      onOpenProcessRefundModal: handleOpenProcessRefundModal,
      onPageChange: handlePageChange,
      onChangeStatus: handleChangeStatus,
      onDateChange: handleDateChange,
    }),
    [
      isLoading,
      campaignTransactions,
      filters,
      totalCount,
      handleSearch,
      handleOpenProcessRefundModal,
      handlePageChange,
      handleChangeStatus,
      handleDateChange,
    ]
  );

  return (
    <CampaignTransactionsContext.Provider value={value}>
      {children}
      {isOpenProcessRefundModal && (
        <ProcessRefundModal
          isOpen={isOpenProcessRefundModal}
          campaignId={campaignId}
          onConfirm={handleOpenSuccessModal}
          onCancel={handleCloseProcessRefundModal}
        />
      )}
      {isOpenSuccessModal && (
        <SuccessModal
          message={successMessage}
          isOpen={isOpenSuccessModal}
          onCancel={handleCloseSuccessModal}
        />
      )}
    </CampaignTransactionsContext.Provider>
  );
};

CampaignTransactionsProvider.propTypes = {
  children: PropTypes.node,
};

export const useCampaignTransactions = () => {
  return useContext(CampaignTransactionsContext) ?? {};
};

export default CampaignTransactionsProvider;
