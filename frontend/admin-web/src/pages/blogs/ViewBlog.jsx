import BlogContent from "./BlogContent";
import CoverSection from "./CoverSection";
import BlogActionButtons from "./BlogActionButtons";
import LandingPageLayout from "../layouts/LandingPageLayout";
import axiosInstance from "@src/application-wide/axios/axios-instance";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isSuccess } from "@src/utils/responseHelpers";
import { showNotification } from "@src/utils/showNotification";
import { ADMIN_EMAILS } from "@src/utils/constant";
import UpdateBlogCoverModal from "./UpdateBlogCoverModal";

const ViewBlog = () => {
  const { id: blogId } = useParams();
  const { user } = useSelector((state) => state.auth || {});
  const [blog, setBlog] = useState(null);
  const [postLoading, setIsPostLoading] = useState(true);
  const [isCoverModalVisible, setIsCoverModalVisible] = useState(false);
  const [isCoverPhotoUpdating, setIsCoverPhotoUpdating] = useState(false);
  const [manuallyAddedMedia, setManuallyAddedMedia] = useState([]);
  const [mediaDuplicate, setMediaDuplicate] = useState([]);

  useEffect(() => {
    if (!blogId) return;

    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`blog/${blogId}`);
        setBlog(response.data);
        setManuallyAddedMedia(response.data.media ?? []);
        setMediaDuplicate(response.data.media ?? []);
      } catch (error) {
        console.error("Error fetching post data:", error);
      } finally {
        setIsPostLoading(false);
      }
    };

    fetchPost();
  }, [blogId]);

  const onEditCoverClick = () => {
    setManuallyAddedMedia(mediaDuplicate);
    setIsCoverModalVisible(true);
  };

  const handleUpdateCoverSubmit = async () => {
    try {
      setIsCoverPhotoUpdating(true);

      const formData = new FormData();
      manuallyAddedMedia.forEach((fileData) =>
        formData.append("files", fileData.file)
      );

      const res = await axiosInstance.put(
        `/blog/update_cover_photo/${blogId}`,
        formData
      );

      if (isSuccess(res.status)) {
        setBlog((prevBlog) => ({
          ...prevBlog,
          media: res.data.media,
        }));
        setManuallyAddedMedia(res.data.media ?? []);
        setMediaDuplicate(res.data.media ?? []);
        setIsCoverModalVisible(false);
        showNotification({
          notificationType: "success",
          message: "Cover Photo Updated",
          description: "Blog cover photo has been updated",
        });
      } else {
        showNotification({
          notificationType: "error",
          message: "Something went wrong",
          description: "Blog cover could not be updated",
        });
      }
    } catch (error) {
      console.error(error);
      showNotification({
        notificationType: "error",
        message: "Something went wrong",
      });
    } finally {
      setIsCoverPhotoUpdating(false);
    }
  };

  const blogContent = (
    <>
      {ADMIN_EMAILS.includes(user?.email) && (
        <BlogActionButtons blog={blog} isLoading={postLoading} allowActions={ADMIN_EMAILS.includes(user?.email)} />
      )}
      <CoverSection
        blog={blog}
        postLoading={postLoading}
        onEditCoverClick={onEditCoverClick}
        allowActions={ADMIN_EMAILS.includes(user?.email)}
      />
      <BlogContent blog={blog} postLoading={postLoading} />
      <UpdateBlogCoverModal
        title={'Update Cover'}
        isVisible={isCoverModalVisible}
        onClose={() => setIsCoverModalVisible(false)}
        onSubmit={handleUpdateCoverSubmit}
        media={manuallyAddedMedia}
        setMedia={setManuallyAddedMedia}
        isLoading={isCoverPhotoUpdating}
      />
    </>
  );

  return window.location.href.includes("dashboard") ? (
    blogContent
  ) : (
    <LandingPageLayout>{blogContent}</LandingPageLayout>
  );
};

export default ViewBlog;
