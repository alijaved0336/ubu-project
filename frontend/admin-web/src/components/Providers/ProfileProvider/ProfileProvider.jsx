import PropTypes from "prop-types";
import axiosInstance from "@src/application-wide/axios/axios-instance";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { logout } from "@src/store/features/authSlice";
import { isSuccess } from "@src/utils/responseHelpers";
import { FALLBACK_ERROR_MESSAGE } from "@src/utils/constant";
import { showNotification } from "@src/utils/showNotification";

import {
  useDeleteUserMutation,
  useGetInfluencerProfileQuery,
  useGetUserQuery,
  useUpdateUserProfilePhotoMutation,
} from "@src/store/api/userApi";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  convertCMToMM,
  convertFeetInchesToMM,
  convertHeightToFeetInches,
  convertLbsToGrams,
  convertMMToCM,
  convertWeightToLbs,
} from "@src/utils/helpers";

const baseSchema = {
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
};

const influencerSchema = z.object({
  ...baseSchema,
  address: z.string().optional(),
  phone_number: z.string().optional(),
  gender: z.string().optional(),
  weight: z.number().min(1, "Weight (lbs) cannot be less than or equal to 0"),
  height_ft: z
    .number()
    .min(2, "Height (ft) must be at least 2")
    .max(8, "Height (ft) can't be more than 8"),
  height_in: z
    .number()
    .min(0, "Height (in) must be at least 0")
    .max(11, "Height (in) can't be more than 11"),
  waist_girth: z
    .number()
    .min(1, "Weight (cm) cannot be less than or equal to 0"),
  age: z.number().min(1, "Age cannot be less than or equal to 0"),
});

const brandSchema = z.object({
  ...baseSchema,
  brand_name: z.string().min(1, "Brand Name is required"),
});

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [progress, setProgress] = useState(0);
  const [showAvatar, setShowAvatar] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [manuallyAddedMedia, setManuallyAddedMedia] = useState([]);
  const [isCoverModalVisible, setIsCoverModalVisible] = useState(false);
  const [isCoverPhotoUpdating, setIsCoverPhotoUpdating] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [activeSchema, setActiveSchema] = useState(influencerSchema);
  const [deleteConfirmMessage, setDeleteConfirmMessage] = useState(
    "Are you sure, you want to delete your account?"
  );

  const [updateUserProfilePhoto] = useUpdateUserProfilePhotoMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(activeSchema),
  });

  const { user, loading, refetch } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching, refetch }) => ({
      user: data ?? {},
      loading: isLoading || isFetching,
      refetch,
    }),
  });

  useEffect(() => {
    if (!loading && user) {
      const selectedSchema = user.is_brand ? brandSchema : influencerSchema;
      setActiveSchema(selectedSchema);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setValue("first_name", user.first_name || "");
      setValue("last_name", user.last_name || "");
      if (user.is_brand) {
        setValue("brand_name", user.brand?.brand_name || "");
      }
      if (user.is_influencer && user.is_consumer) {
        setDeleteConfirmMessage(
          "You have two accounts with us. Deleting your account will remove both your influencer and consumer accounts permanently. Are you sure you want to proceed?"
        );
      }
    }
  }, [user, setValue]);

  const {
    data: influencerProfile,
    isFetching: isInfluencerProfileLoading,
    refetch: refetchInluencerProfile,
  } = useGetInfluencerProfileQuery(undefined, {
    skip: !user?.is_influencer,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (user?.is_influencer) {
      refetchInluencerProfile();
    }
  }, [user?.is_influencer]);

  useEffect(() => {
    if (user.is_influencer) {
      const { feet, inches } = convertHeightToFeetInches(
        influencerProfile?.height
      );
      setValue(
        "waist_girth",
        convertMMToCM(influencerProfile?.waistGirth || 0)
      );
      setValue("weight", convertWeightToLbs(influencerProfile?.weight || 0));
      setValue("height_ft", feet || 0);
      setValue("height_in", inches || 0);
      setValue("age", influencerProfile?.age || 0);
      setValue("address", influencerProfile?.address || "");
      setValue("phone_number", influencerProfile?.phone_number || "");
      setValue("address", influencerProfile?.address || "");
      setValue("gender", influencerProfile?.gender || "");
    }
  }, [influencerProfile]);

  const [
    deleteUser,
    { isLoading: isDeletingUser, data, isSuccess: isUserDeleted },
  ] = useDeleteUserMutation();

  useEffect(() => {
    if (isUserDeleted) {
      setConfirmationModalOpen(false);
      setIsModalVisible(true);
    }
  }, [isUserDeleted, data]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    handleLogout();
  };

  const onEditCoverClick = () => {
    setShowAvatar(true);
    setIsCoverModalVisible(true);
  };

  const handleUpdateProfileSubmit = useCallback(async () => {
    const formData = new FormData();
    manuallyAddedMedia.forEach((fileData) =>
      formData.append("files", fileData.file)
    );

    setIsCoverPhotoUpdating(true);

    try {
      await updateUserProfilePhoto({
        formData,
        callback: (currentProgress) => {
          setProgress(() => currentProgress);
        },
      }).unwrap();

      showNotification({
        notificationType: "success",
        message: "Profile Photo Updated",
        description: "Profile photo has been updated",
      });
      setIsCoverModalVisible(false);
    } catch (error) {
      console.log(error?.message || FALLBACK_ERROR_MESSAGE);
      showNotification({
        notificationType: "error",
        message: error?.message || FALLBACK_ERROR_MESSAGE,
        description: "Profile photo could not be updated",
      });
    } finally {
      setProgress(0);
      setIsCoverPhotoUpdating(false);
    }
  }, [
    manuallyAddedMedia,
    setIsCoverPhotoUpdating,
    setProgress,
    showNotification,
    setIsCoverModalVisible,
    useUpdateUserProfilePhotoMutation,
  ]);

  const handleConfirm = () => {
    deleteUser();
  };

  const onSubmit = async (data) => {
    try {
      const influencerPayload = {
        user_details: {
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          address: data.address,
        },
        user_body: {
          height: convertFeetInchesToMM(data.height_ft, data.height_in),
          weight: convertLbsToGrams(data.weight),
          age: data.age,
          measurment: { waistGirth: convertCMToMM(data.waist_girth) }
        },
      };
      const endpoint = user.is_influencer
        ? "/influencer/update_influencer_profile"
        : "/user/update_profile";
      const payload = user.is_influencer ? influencerPayload : data;
      const res = await axiosInstance.put(endpoint, payload);
      if (isSuccess(res.status)) {
        showNotification({
          notificationType: "success",
          message: "User Profile Updated",
          description: "Profile has been updated",
        });
        const mediaInputHtml = document.getElementById("media-input");
        if (mediaInputHtml) mediaInputHtml.value = "";
        await refetch();
      } else {
        showNotification({
          notificationType: "error",
          message: "Something went wrong",
          description: "Profile could not be updated",
        });
      }
    } catch (error) {
      console.log(error, "error");
      showNotification({
        notificationType: "error",
        message: "Something went wrong",
      });
    }
  };

  const value = useMemo(
    () => ({
      isModalVisible,
      setIsModalVisible,
      isConfirmationModalOpen,
      setConfirmationModalOpen,
      isCoverModalVisible,
      setIsCoverModalVisible,
      isCoverPhotoUpdating,
      setIsCoverPhotoUpdating,
      manuallyAddedMedia,
      setManuallyAddedMedia,
      progress,
      setProgress,
      showAvatar,
      setShowAvatar,
      handleUpdateProfileSubmit,
      isDeletingUser,
      handleConfirm,
      deleteConfirmMessage,
      handleCloseModal,
      user,
      loading,
      onSubmit,
      handleSubmit,
      isSubmitting,
      errors,
      register,
      setValue,
      watch,
      onEditCoverClick,
      isInfluencerProfileLoading,
      influencerProfile,
    }),
    [
      isModalVisible,
      setIsModalVisible,
      isConfirmationModalOpen,
      setConfirmationModalOpen,
      isCoverModalVisible,
      setIsCoverModalVisible,
      isCoverPhotoUpdating,
      setIsCoverPhotoUpdating,
      manuallyAddedMedia,
      setManuallyAddedMedia,
      progress,
      setProgress,
      showAvatar,
      setShowAvatar,
      handleUpdateProfileSubmit,
      isDeletingUser,
      handleConfirm,
      deleteConfirmMessage,
      handleCloseModal,
      user,
      loading,
      onSubmit,
      handleSubmit,
      isSubmitting,
      errors,
      register,
      setValue,
      watch,
      onEditCoverClick,
      isInfluencerProfileLoading,
      influencerProfile,
    ]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

ProfileProvider.propTypes = {
  children: PropTypes.node,
};

export const useProfile = () => {
  return useContext(ProfileContext) ?? {};
};

export default ProfileProvider;
