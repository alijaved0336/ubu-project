import PropTypes from "prop-types";
import axiosInstance from "@src/application-wide/axios/axios-instance";

import { isSuccess } from "@src/utils/responseHelpers";
import { showNotification } from "@src/utils/showNotification";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const UserErrorContext = createContext();

const UserErrorProvider = ({ children }) => {
  const [isUserErrorLoading, setIsUserErrorLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [allUserErrors, setAllUserErrors] = useState([]);
  const [allUserErrorDeleting, setAllUserErrorDeleting] = useState([]);
 

  const [filters, setFilters] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    searchTerm: "",
  });

  const fetchAllUserErrors = useCallback(async () => {
    try {
      setIsUserErrorLoading(true);
      const apiUrl = `/user_errors/find_all?page=${filters.currentPage}&limit=${filters.itemsPerPage}&search=${filters.searchTerm}`;
      const res = await axiosInstance.get(apiUrl);
      if (isSuccess(res.status)) {
        setAllUserErrors(res.data.userErrors);
        setTotalItems(res.data.total);
      }
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: `Something went wrong`,
      });
    } finally {
      setIsUserErrorLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAllUserErrors();
  }, [fetchAllUserErrors]);

  const handleSearch = useCallback((value) => {
    setFilters((prevPaginationState) => ({
      ...prevPaginationState,
      currentPage: 1,
      searchTerm: value,
    }));
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      setIsDeleting(true);
      setAllUserErrorDeleting([...allUserErrorDeleting, id])
      const response = await axiosInstance.delete(`/user_errors/${id}`);
      if (isSuccess(response.status)) {
        setAllUserErrorDeleting(allUserErrorDeleting.filter((t) => t != id));
        fetchAllUserErrors();
        showNotification({
          notificationType: "success",
          message: "User Error Deleted Successfully",
          description: "User error has been deleted",
        });
      } else {
        showNotification({
          notificationType: "error",
          message: "Something went wrong",
          description: "User error could not be deleted",
        });
      }
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: "Something went wrong",
        description: "User error could not be deleted",
      });
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const handlePageChange = useCallback((pageNumber, pageSize) => {
    setFilters((prevPaginationState) => ({
      ...prevPaginationState,
      currentPage: pageNumber,
      itemsPerPage: pageSize,
    }));
  }, []);

  const value = useMemo(
    () => ({
      isUserErrorLoading,
      setIsUserErrorLoading,
      isDeleting,
      setIsDeleting,
      totalItems,
      setTotalItems,
      allUserErrors,
      setAllUserErrors,
      filters,
      setFilters,
      allUserErrorDeleting,
      setAllUserErrorDeleting,
      handleDelete,
      handleSearch,
      handlePageChange,
    }),
    [
      isUserErrorLoading,
      setIsUserErrorLoading,
      isDeleting,
      setIsDeleting,
      totalItems,
      setTotalItems,
      allUserErrors,
      setAllUserErrors,
      filters,
      setFilters,
      allUserErrorDeleting,
      setAllUserErrorDeleting,
      handleDelete,
      handleSearch,
      handlePageChange,
    ]
  );

  return (
    <UserErrorContext.Provider value={value}>
      {children}
    </UserErrorContext.Provider>
  );
};

UserErrorProvider.propTypes = {
  children: PropTypes.node,
};

export const useUserError = () => {
  return useContext(UserErrorContext) ?? {};
};

export default UserErrorProvider;
