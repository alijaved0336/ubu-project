import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import { useGetAllPostsQuery } from "@src/store/api/postsApi";
import { useNavigate } from "react-router-dom";
// import { validateAmazonLink, validateShortAmazonLink } from "@src/utils/regex";
// import { AmazonOutlined, CloudUploadOutlined } from "@ant-design/icons";
// import CustomModal from "@src/components/Modals/CustomModal";
// import { Button } from "@src/components/Common/Widgets";
// import cn from "@src/cn";
import DeletePostModal from "@src/pages/post/DeletePostModal";

const PostsContext = createContext();

const PostsProvider = ({ children }) => {
  const navigate = useNavigate();

  // const [link, setLink] = useState("");
  // const [linkError, setLinkError] = useState("");

  const [selectedOption, setSelectedOption] = useState("manual");
  // const [modalVisible, setModalVisible] = useState(false);

  const [isOpenDeletePostModal, setIsOpenDeletePostModal] = useState(false);

  const [postId, setPostId] = useState("");

  const [filters, setFilters] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    searchTerm: "",
    status: "Published", // Added status filter
  });

  const { isLoading, posts, totalItems } = useGetAllPostsQuery(filters, {
    selectFromResult: ({ isError, isFetching, isLoading, data }) => ({
      isLoading: isLoading || isFetching,
      error: isError,
      posts: data?.posts,
      totalItems: data?.total,
      status: status,
    }),
    refetchOnMountOrArgChange: true,
  });

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  // const handleSubmit = () => {
  //   if (selectedOption == "manual") {
  //     navigate("/dashboard/posts/create");
  //   } else {
  //     const inputLink = link.trim();
  //     if (validateAmazonLink(inputLink)) {
  //       setLinkError("");
  //       navigate(
  //         `/dashboard/posts/create?amazonLink=${encodeURIComponent(inputLink)}`
  //       );
  //     } else {
  //       setLinkError("Please enter a valid Amazon product link.");
  //     }
  //   }
  // };

  const handleSearch = useCallback((value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: 1,
      searchTerm: value,
    }));
  }, []);

  const handlePageChange = useCallback((pageNumber, pageSize) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: pageNumber,
      itemsPerPage: pageSize,
    }));
  }, []);

  const handleStatusChange = useCallback((status) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      currentPage: 1, // Reset to the first page on filter change
      status,
    }));
  }, []);

  const handleView = useCallback(
    (id) => {
      navigate(`/dashboard/posts/${id}`);
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (id) => {
      navigate(`/dashboard/posts/${id}/edit`);
    },
    [navigate]
  );

  const handleDelete = useCallback((id) => {
    console.log({ id });
    setPostId(id);
    setIsOpenDeletePostModal(true);
  }, []);

  const handleCloseDeletePostModal = () => {
    setIsOpenDeletePostModal(false);
    setPostId("");
  };

  const handleCreate = useCallback(() => {
    navigate(`/dashboard/posts/create`);
  }, [navigate]);

  const value = useMemo(
    () => ({
      isLoading,
      posts,
      totalItems,
      filters,
      onSearch: handleSearch,
      onPageChange: handlePageChange,
      // onSetModalVisibility: setModalVisible,
      onView: handleView,
      onEdit: handleEdit,
      onCreate: handleCreate,
      onDelete: handleDelete,
      onStatusChange: handleStatusChange, // Expose status change handler
    }),
    [
      isLoading,
      posts,
      filters,
      totalItems,
      handleSearch,
      handlePageChange,
      handleView,
      handleEdit,
      handleCreate,
      handleDelete,
      handleStatusChange,
    ]
  );

  return (
    <PostsContext.Provider value={value}>
      {children}
      {isOpenDeletePostModal && (
        <DeletePostModal
          isOpen={isOpenDeletePostModal}
          postId={postId}
          onConfirm={handleCloseDeletePostModal}
          onCancel={handleCloseDeletePostModal}
        />
      )}
      {/* <CustomModal
        title={null}
        width="672px"
        isOpen={modalVisible}
        className="!tw-h-auto"
        onCancel={() => setModalVisible(false)}
        centered
        bodyWrapperClassName="tw-p-4"
        footer={
          <div className="tw-flex tw-justify-center">
            <Button onClick={handleSubmit}>Add</Button>
          </div>
        }
      >
        <div className="add-link-modal-content">
          <div className="add-link-modal-body">
            <div className="upload-options tw-flex tw-gap-4">
              <div
                className={cn(
                  "option-card tw-flex-1 tw-p-5 tw-flex tw-flex-col tw-items-center tw-border tw-rounded-lg tw-cursor-pointer tw-transition tw-duration-200 tw-border-gray-300 hover:tw-border-black-60",
                  {
                    "bg-[#f0f8ff] tw-border-black-60":
                      selectedOption === "manual",
                  }
                )}
                onClick={() => handleOptionChange("manual")}
              >
                <input
                  type="radio"
                  name="uploadOption"
                  id="manual"
                  checked={selectedOption === "manual"}
                  readOnly
                  className="tw-hidden"
                />
                <CloudUploadOutlined
                  style={{ fontSize: "48px", color: "#1890FF" }}
                />
                <label htmlFor="manual">Add Manually</label>
              </div>

              <div
                className={cn(
                  "option-card tw-flex-1 tw-p-5 tw-flex tw-flex-col tw-items-center tw-border tw-rounded-lg tw-cursor-pointer tw-transition tw-duration-200 tw-border-gray-300 hover:tw-border-black-60",
                  {
                    "bg-[#f0f8ff] tw-border-black-60":
                      selectedOption === "amazon",
                  }
                )}
                onClick={() => handleOptionChange("amazon")}
              >
                <input
                  type="radio"
                  name="uploadOption"
                  id="amazon"
                  checked={selectedOption === "amazon"}
                  readOnly
                  className="tw-hidden"
                />
                <AmazonOutlined
                  style={{ fontSize: "48px", color: "#FF9900" }}
                />
                <label htmlFor="amazon">Add Amazon Link</label>
              </div>
            </div>

            {selectedOption === "amazon" && (
              <div className="add-link-input tw-mt-4">
                <textarea
                  className="tw-w-full tw-p-2.5 tw-border tw-border-gray-200 tw-rounded tw-text-sm tw-resize-none tw-mb-5"
                  placeholder="https://www.example.com"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  rows={5}
                />
                {linkError && <p className="tw-text-red-500">{linkError}</p>}
              </div>
            )}
          </div>
        </div>
      </CustomModal> */}
    </PostsContext.Provider>
  );
};

PostsProvider.propTypes = {
  children: PropTypes.node,
};

export const usePosts = () => {
  return useContext(PostsContext) ?? {};
};

export default PostsProvider;
