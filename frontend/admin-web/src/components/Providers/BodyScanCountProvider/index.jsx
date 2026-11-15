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

const BodyScanCountContext = createContext();

const BodyScanCountProvider = ({ children }) => {
  const [editBodyScanValue, setEditBodyScanValue] = useState([]);

  const [bodyScanCount, setBodyScanCount] = useState([]);
  const [isBodyScanCountLoading, setIsBodyScanCountLoading] = useState(true);
  const [isBodyScanEditModalOpen, setIsBodyScanEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchBodyScanCount = useCallback(async () => {
    try {
      setIsBodyScanCountLoading(true);
      const apiUrl = `/body_scan_log_count`;
      const res = await axiosInstance.get(apiUrl);
      if (isSuccess(res.status)) {
        setBodyScanCount(res.data);
        setEditBodyScanValue(res.data);
      }
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: `Something went wrong`,
      });
    } finally {
      setIsBodyScanCountLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBodyScanCount();
  }, [fetchBodyScanCount]);

  const handleInitiateCount = useCallback(async () => {
    const apiUrl = `/body_scan_log_count`;

    try {
      setIsBodyScanCountLoading(true);
      const response = await axiosInstance.post(apiUrl, { count: 0 });
      if (isSuccess(response.status)) {
        setBodyScanCount([response.data]);
        setEditBodyScanValue([response.data]);
        showNotification({
          notificationType: "success",
          message: "Body scan count inititated",
          description: "Body scan count has been initiated",
        });
      }
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: "Something went wrong",
        description: "Body scan count could not be initiated",
      });
    } finally {
      setIsBodyScanCountLoading(false);
    }
  }, []);

  const handleEditCount = useCallback(async () => {
    setIsEditing(true);

    try {
      const response = await axiosInstance.put(
        `body_scan_log_count/${editBodyScanValue[0].id}`,
        { count:  editBodyScanValue[0].count}
      );
      if (isSuccess(response.status)) {
        showNotification({
          notificationType: "success",
          message: "Body Scan Count Updated Successfully",
          description: "Body scan count has been updated",
        });
        setIsBodyScanEditModalOpen(!isBodyScanEditModalOpen)
        await fetchBodyScanCount();
      }
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: "Something went wrong",
        description: "Body scan could not be updated",
      });
    } finally {
      setIsEditing(false);
    }
  }, [editBodyScanValue, fetchBodyScanCount, isBodyScanEditModalOpen]);

const onInputNumberChange = useCallback(async (value) => {
    setEditBodyScanValue((prevState) => [
      { ...prevState[0], count: value ?? 0 },
    ]);
}, []);

  const value = useMemo(
    () => ({
      isBodyScanCountLoading,
      bodyScanCount,
      handleInitiateCount,
      isBodyScanEditModalOpen,
      setIsBodyScanEditModalOpen,
      isEditing,
      editBodyScanValue,
      onInputNumberChange,
      handleEditCount,
    }),
    [
      isBodyScanCountLoading,
      bodyScanCount,
      handleInitiateCount,
      isBodyScanEditModalOpen,
      setIsBodyScanEditModalOpen,
      isEditing,
      editBodyScanValue,
      onInputNumberChange,
      handleEditCount,
    ]
  );

  return (
    <BodyScanCountContext.Provider value={value}>
      {children}
    </BodyScanCountContext.Provider>
  );
};

BodyScanCountProvider.propTypes = {
  children: PropTypes.node,
};

export const useBodyScanCount = () => {
  return useContext(BodyScanCountContext) ?? {};
};

export default BodyScanCountProvider;
