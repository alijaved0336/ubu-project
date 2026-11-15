import React from "react";
import UpdateProfileCoverModal from "./UpdateProfileCoverModal";
import SuccessModal from "@src/components/SuccessModal/SuccessModal";
import ConfirmationModal from "@src/components/ConfirmationModal/ConfirmationModal";

import { useProfile } from "@src/components/Providers/ProfileProvider/ProfileProvider";

const ProfileModals = () => {
  const {
    isModalVisible,
    handleCloseModal,
    isDeletingUser,
    deleteConfirmMessage,
    progress,
    isCoverModalVisible,
    setIsCoverModalVisible,
    manuallyAddedMedia,
    setManuallyAddedMedia,
    handleUpdateProfileSubmit,
    isCoverPhotoUpdating,
    showAvatar,
    setShowAvatar,
    setConfirmationModalOpen,
    isConfirmationModalOpen,
    handleConfirm,
  } = useProfile();

  return (
    <>
      <UpdateProfileCoverModal
        progress={progress}
        isVisible={isCoverModalVisible}
        title={"Update Profile Photo"}
        onClose={() => {
          setIsCoverModalVisible(false);
          setManuallyAddedMedia([]),
            (document.getElementById("media-input").value = "");
        }}
        onSubmit={handleUpdateProfileSubmit}
        media={manuallyAddedMedia}
        setMedia={setManuallyAddedMedia}
        isLoading={isCoverPhotoUpdating}
        showAvatar={showAvatar}
        setShowAvatar={setShowAvatar}
      />

      {isConfirmationModalOpen && (
        <ConfirmationModal
          onClose={() => setConfirmationModalOpen(false)}
          message={deleteConfirmMessage}
          onConfirm={handleConfirm}
          isConfirmLoading={isDeletingUser}
        />
      )}
      {isModalVisible && (
        <SuccessModal
          onClose={handleCloseModal}
          message={
            "User has been succesfully deleted. We are sorry to say GoodBye!"
          }
        />
      )}
    </>
  );
};

export default ProfileModals;
