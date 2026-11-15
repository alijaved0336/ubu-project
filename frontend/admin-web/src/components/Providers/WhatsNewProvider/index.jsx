import PropTypes from "prop-types";
import axiosInstance from "@src/application-wide/axios/axios-instance";

import { message } from "antd";
import { isSuccess } from "@src/utils/responseHelpers";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@src/utils/showNotification";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const WhatsNewContext = createContext();

const WhatsNewProvider = ({ children }) => {
  const navigate = useNavigate();
  const { id: WhatsNewIdFromUrl } = useParams();
  const [isWhatsNewLoading, setIsWhatsNewLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [whatsNewDeleting, setWhatsNewDeleting] = useState([]);
  const [isFetchingSingleWhatsNew, setIsFetchingSingleWhatsNew] =
    useState(false);

  const [totalItems, setTotalItems] = useState(0);
  const [allWhatsNew, setAllWhatsNew] = useState([]);
  const [generalInfo, setGeneralInfo] = useState({ name: "", description: "" });
  const [tags, setTags] = useState([]);

  const [filters, setFilters] = useState({
    currentPage: 1,
    itemsPerPage: 5,
    searchTerm: "",
  });

  const fetchSingleWhatsNewData = useCallback(async () => {
    if (!WhatsNewIdFromUrl) return;
    try {
      setIsFetchingSingleWhatsNew(true);
      const response = await axiosInstance.get(
        `whats_new/${WhatsNewIdFromUrl}`
      );
      const data = response.data;
      setGeneralInfo({ name: data.title, description: data.description });
      setTags(response.data.tags || []);
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: `Something went wrong`,
      });
    } finally {
      setIsFetchingSingleWhatsNew(false);
    }
  }, [WhatsNewIdFromUrl]);

  useEffect(() => {
    fetchSingleWhatsNewData();
  }, [fetchSingleWhatsNewData]);

  const fetchAllWhatsNew = useCallback(async () => {
    try {
      setIsWhatsNewLoading(true);
      const apiUrl = `/whats_new/find_all?page=${filters.currentPage}&limit=${filters.itemsPerPage}&search=${filters.searchTerm}`;
      const res = await axiosInstance.get(apiUrl);
      if (isSuccess(res.status)) {
        setAllWhatsNew(res.data.whatsNew);
        setTotalItems(res.data.total);
      }
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: `Something went wrong`,
      });
    } finally {
      setIsWhatsNewLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (!WhatsNewIdFromUrl) fetchAllWhatsNew();
  }, [fetchAllWhatsNew, WhatsNewIdFromUrl]);

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

  const handleEdit = useCallback(
    (id) => {
      navigate(`/dashboard/whats_new/edit/${id}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(async (id) => {
    try {
      setIsDeleting(true);
      setWhatsNewDeleting([...whatsNewDeleting, id]);
      const response = await axiosInstance.delete(`/whats_new/${id}`);
      if (isSuccess(response.status)) {
        setWhatsNewDeleting(whatsNewDeleting.filter((t) => t != id));
        fetchAllWhatsNew();
        showNotification({
          notificationType: "success",
          message: "Feature Deleted Successfully",
          description: "Feature has been deleted",
        });
      } else {
        showNotification({
          notificationType: "error",
          message: "Something went wrong",
          description: "Feature could not be deleted",
        });
      }
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: "Something went wrong",
        description: "Feature could not be deleted",
      });
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const handleCreateWhatsNew = useCallback(async () => {
    const warnings = [
      { condition: !generalInfo.name, message: "Please enter feature name" },
      {
        condition: !generalInfo.description,
        message: "Please enter feature description",
      },
      { condition: !tags.length, message: "Please enter tag" },
    ];

    for (const { condition, message: warningMessage } of warnings) {
      if (condition) {
        message.warning(warningMessage);
        return;
      }
    }

    const apiData = {
      title: generalInfo.name,
      description: generalInfo.description,
      tags,
    };

    const apiUrl = "/whats_new";

    try {
      setIsCreating(true);
      const response = await axiosInstance.post(apiUrl, apiData);
      if (isSuccess(response.status)) {
        showNotification({
          notificationType: "success",
          message: "Feature Created Successfully",
          description: "Feature has been created",
        });
        navigate("/dashboard/whats_new");
      }
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: "Something went wrong",
        description: "Feature could not be created",
      });
    } finally {
      setIsCreating(false);
    }
  }, [generalInfo.description, generalInfo.name, navigate, tags]);

  const handleEditWhatsNew = useCallback(async () => {
    const warnings = [
      { condition: !generalInfo.name, message: "Please enter feature name" },
      {
        condition: !generalInfo.description,
        message: "Please enter feature description",
      },
      { condition: !tags.length, message: "Please enter tag" },
    ];
    for (const { condition, message: warningMessage } of warnings) {
      if (condition) {
        message.warning(warningMessage);
        return;
      }
    }
    setIsEditing(true);
    const apiData = {
      title: generalInfo.name,
      description: generalInfo.description,
      tags,
    };

    try {
      const response = await axiosInstance.put(
        `whats_new/${WhatsNewIdFromUrl}`,
        apiData
      );
      if (isSuccess(response.status)) {
        showNotification({
          notificationType: "success",
          message: "Feature Updated Successfully",
          description: "Feature has been updated",
        });
        navigate("/dashboard/whats_new");
      }
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: "Something went wrong",
        description: "Feature could not be updated",
      });
    } finally {
      setIsEditing(false);
    }
  }, [WhatsNewIdFromUrl, generalInfo.description, generalInfo.name, navigate, tags]);

  const handlePageChange = useCallback((pageNumber, pageSize) => {
    setFilters((prevPaginationState) => ({
      ...prevPaginationState,
      currentPage: pageNumber,
      itemsPerPage: pageSize,
    }));
  }, []);

  const value = useMemo(
    () => ({
      allWhatsNew,
      isWhatsNewLoading,
      isDeleting,
      filters,
      totalItems,
      handleSearch,
      handleDelete,
      handlePageChange,
      handleView,
      handleEdit,
      navigate,
      generalInfo,
      setGeneralInfo,
      tags,
      setTags,
      isCreating,
      isEditing,
      handleCreateWhatsNew,
      isFetchingSingleWhatsNew,
      handleEditWhatsNew,
      whatsNewDeleting,
    }),
    [
      allWhatsNew,
      isWhatsNewLoading,
      isDeleting,
      filters,
      totalItems,
      handleSearch,
      handleDelete,
      handlePageChange,
      handleView,
      handleEdit,
      navigate,
      generalInfo,
      setGeneralInfo,
      tags,
      setTags,
      isCreating,
      isEditing,
      handleCreateWhatsNew,
      isFetchingSingleWhatsNew,
      handleEditWhatsNew,
      whatsNewDeleting,
    ]
  );

  return (
    <WhatsNewContext.Provider value={value}>
      {children}
    </WhatsNewContext.Provider>
  );
};

WhatsNewProvider.propTypes = {
  children: PropTypes.node,
};

export const useWhatsNew = () => {
  return useContext(WhatsNewContext) ?? {};
};

export default WhatsNewProvider;
