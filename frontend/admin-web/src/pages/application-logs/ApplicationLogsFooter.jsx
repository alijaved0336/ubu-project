import { UBUInput, UBUSearch } from "@src/components";
import { Button } from "@src/components/Common/Widgets";
import { Heading } from "@src/components/Common/Typography";
import { useApplicationLogs } from "@src/components/Providers/ApplicationLogsProvider";

const ApplicationLogsFooter = () => {
  const {
    handleDeleteFolderInput,
    folderNameToDelete,
    handleDeleteFolder,
    isFolderDeleting,
    allLogs,
  } = useApplicationLogs();

  return (
    <div className="tw-mt-4">
      {allLogs.length > 0 && (
        <>
          <div className="tw-flex tw-justify-between tw-items-center">
            <Heading level={2} className="tw-font-manrope tw-font-semibold">
              Delete Logs By Folder
            </Heading>
            <Button
              loading={isFolderDeleting}
              disabled={isFolderDeleting}
              type="primary"
              onClick={() => handleDeleteFolder()}
            >
              Delete
            </Button>
          </div>
          <div className="tw-flex tw-flex-col tw-my-6 tw-justify-items-start xl:tw-flex-row tw-justify-between tw-gap-4">
            <UBUInput
              type="text"
              value={folderNameToDelete}
              placeholder="Enter folder url"
              onChange={(e) => handleDeleteFolderInput(e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicationLogsFooter;
