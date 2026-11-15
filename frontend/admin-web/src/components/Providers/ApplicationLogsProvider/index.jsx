import PropTypes from "prop-types";
import axiosInstance from "@src/application-wide/axios/axios-instance";

import { isSuccess } from "@src/utils/responseHelpers";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@src/utils/showNotification";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import dayjs from "dayjs";

const ApplicationLogs = createContext();

const ApplicationLogsProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [isFolderDeleting, setIsFolderDeleting] = useState(false);
  const [allLogs, setAllLogs] = useState([]);
  const [folderNameToDelete, setFolderNameToDelete] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState({
    dateToFind: dayjs(),
    isUserApiLogs: false,
    currentPage: 1,
    itemsPerPage: 10,
    searchTerm: "",
  });

  const fetchAllLogs = useCallback(async () => {
    try {
      setIsLogsLoading(true);
      const apiUrl = `/s3-logger/get-all-logs?page=${filters.currentPage}&limit=${
        filters.itemsPerPage
      }&search=${filters.searchTerm}&isUserApiLogs=${
        filters.isUserApiLogs
      }&dateToFind=${filters.dateToFind.format("YYYY-MM-DD")}`;
      const res = await axiosInstance.get(apiUrl);
      if (isSuccess(res.status)) {
        setAllLogs(res.data.applicationLogs);
        setTotalItems(res.data.total);
      }
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: `Something went wrong`,
      });
    } finally {
      setIsLogsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAllLogs();
  }, [fetchAllLogs]);

  const openS3FileInNewTab = useCallback(async (fileName) => {
    try {
      const apiUrl = `/s3-logger/download-s3-log-file?completeFileName=${fileName}`;

      const response = await axiosInstance.get(apiUrl, {
        responseType: "blob",
      });

      const fileBlob = new Blob([response.data], { type: "text/plain" }); // or infer from server
      const fileURL = URL.createObjectURL(fileBlob);

      // Open in a new tab
      window.open(fileURL, "_blank");
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: `Something went wrong`,
      });
    }
  }, []);

  const downloadS3File = useCallback(async (fileName) => {
    try {
      const apiUrl = `/s3-logger/download-s3-log-file?completeFileName=${fileName}`;

      const response = await axiosInstance.get(apiUrl, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Use the filename from content-disposition if needed
      const contentDisposition = response.headers["content-disposition"];
      const matchedFileName = contentDisposition?.match(/filename="(.+)"/)?.[1];
      link.download = matchedFileName || fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: `Something went wrong`,
      });
    }
  }, []);

  const handleSearch = useCallback((value) => {
    setFilters((prevPaginationState) => ({
      ...prevPaginationState,
      currentPage: 1,
      searchTerm: value,
    }));
  }, []);

  const handleView = useCallback(
    (id) => {
      navigate(`/dashboard/whats_new/${id}`);
    },
    [navigate]
  );

  const handlePageChange = useCallback((pageNumber, pageSize) => {
    setFilters((prevPaginationState) => ({
      ...prevPaginationState,
      currentPage: pageNumber,
      itemsPerPage: pageSize,
    }));
  }, []);

  const handleFilterChange = useCallback((isUserApiLogs) => {
    setFilters((prevPaginationState) => ({
      ...prevPaginationState,
      isUserApiLogs: isUserApiLogs,
      currentPage: 1,
    }));
  }, []);

  const handleDateChange = useCallback((date) => {
    setFilters((prevPaginationState) => ({
      ...prevPaginationState,
      dateToFind: date,
      currentPage: 1,
    }));
  }, []);

  const handleDeleteFolderInput = useCallback((value) => {
    setFolderNameToDelete(value);
  }, []);

  const handleDeleteFolder = useCallback(async () => {
    if (!folderNameToDelete) {
      showNotification({
        notificationType: "warning",
        message: "Folder Url Unspecified",
        description: "Please enter url of the folder",
      });
      return;
    }
    try {
      setIsFolderDeleting(true);
      const response = await axiosInstance.post(
        `/s3-logger/delete-s3-log-file-folder`, { completeFileName: folderNameToDelete }
      );
      if (isSuccess(response.status)) {
        fetchAllLogs();
        setFolderNameToDelete("");
        showNotification({
          notificationType: "success",
          message: "Logs Deleted Successfully",
          description: "Logs have been deleted",
        });
      } else {
        showNotification({
          notificationType: "error",
          message: "Something went wrong",
          description: "Logs could not be deleted",
        });
      }
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: "Something went wrong",
        description: "Logs could not be deleted",
      });
    } finally {
      setIsFolderDeleting(false);
    }
  }, [folderNameToDelete]);

  const value = useMemo(
    () => ({
      allLogs,
      isLogsLoading,
      fetchAllLogs,
      filters,
      totalItems,
      handlePageChange,
      handleFilterChange,
      handleSearch,
      handleView,
      navigate,
      downloadS3File,
      openS3FileInNewTab,
      handleDateChange,
      handleDeleteFolder,
      handleDeleteFolderInput,
      folderNameToDelete,
      isFolderDeleting,
    }),
    [
      allLogs,
      isLogsLoading,
      fetchAllLogs,
      filters,
      totalItems,
      handlePageChange,
      handleFilterChange,
      handleView,
      navigate,
      downloadS3File,
      openS3FileInNewTab,
      handleDateChange,
      handleDeleteFolder,
      handleDeleteFolderInput,
      folderNameToDelete,
      isFolderDeleting,
    ]
  );

  return (
    <ApplicationLogs.Provider value={value}>
      {children}
    </ApplicationLogs.Provider>
  );
};

ApplicationLogsProvider.propTypes = {
  children: PropTypes.node,
};

export const useApplicationLogs = () => {
  return useContext(ApplicationLogs) ?? {};
};

export default ApplicationLogsProvider;
