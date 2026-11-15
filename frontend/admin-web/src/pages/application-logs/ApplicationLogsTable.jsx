import NoData from "@src/components/NoData";
import WhatsNewTableSkeleton from "@src/components/Skeletons/WhatsNewTableSkeleton";

import { Flex, Tooltip } from "antd";
import { useApplicationLogs } from "@src/components/Providers/ApplicationLogsProvider";
import NoBlogIcon from "@src/assets/icons/NoBlogsIcon";

const ApplicationLogsTable = () => {
  const {
    allLogs,
    isLogsLoading,
    filters: { searchTerm },
    downloadS3File,
    openS3FileInNewTab,
  } = useApplicationLogs();

  return (
    <>
      {isLogsLoading ? (
        <WhatsNewTableSkeleton />
      ) : allLogs.length > 0 ? (
        <div className="campaign-index-table">
          <table>
            <thead>
              <tr>
                <th>Logs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allLogs.map((whatsNew) => (
                <tr key={whatsNew?.id}>
                  <td>{whatsNew}</td>
                  <td>
                    <Flex className="tw-gap-2">
                      <Tooltip title="Preview">
                        <i
                          style={{ cursor: "pointer" }}
                          className="fas fa-eye"
                          onClick={(event) => {
                            event.stopPropagation();
                            openS3FileInNewTab(whatsNew);
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Download">
                        <i
                          style={{ cursor: "pointer" }}
                          className="fas fa-download"
                          onClick={(event) => {
                            event.stopPropagation();
                            downloadS3File(whatsNew);
                          }}
                        />
                      </Tooltip>

                    </Flex>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {searchTerm ? (
            <NoData
              isMessage
              message={`Nothing found against this search "${searchTerm}"`}
            />
          ) : (
            <NoData
            isMessage
            message={`No logs to show`}
            noDataImageComponent={<NoBlogIcon />}
          />
          )}
        </>
      )}
    </>
  );
};

export default ApplicationLogsTable;
