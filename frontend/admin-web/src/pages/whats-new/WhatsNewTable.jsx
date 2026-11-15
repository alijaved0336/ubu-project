import NoData from "@src/components/NoData";
import WhatsNewTableSkeleton from "@src/components/Skeletons/WhatsNewTableSkeleton";

import { Flex, Spin, Tooltip } from "antd";
import { useWhatsNew } from "@src/components/Providers/WhatsNewProvider";

const WhatsNewTable = () => {
  const {
    allWhatsNew,
    isWhatsNewLoading,
    filters: { searchTerm },
    handleDelete,
    handleEdit,
    navigate,
    isDeleting,
    whatsNewDeleting,
  } = useWhatsNew();

  return (
    <>
      {isWhatsNewLoading ? (
        <WhatsNewTableSkeleton />
      ) : allWhatsNew.length > 0 ? (
        <div className="campaign-index-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Tag</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allWhatsNew.map((whatsNew) => (
                <tr key={whatsNew?.id}>
                  <td>{whatsNew.title}</td>
                  <td>{whatsNew.description}</td>
                  <td>
                    {whatsNew.tags &&
                      whatsNew.tags.map((tag, index) => (
                        <span
                          className="tw-rounded-xl tw-px-2 tw-py-1"
                          style={{ backgroundColor: tag.tagColor }}
                          key={index}
                        >
                          {tag.tagName}
                          {index < whatsNew.tags.length - 1 ? ", " : ""}
                        </span>
                      ))}
                  </td>{" "}
                  <td>
                    <Flex className="tw-gap-2">
                      <Tooltip title="Edit">
                        <i
                          style={{ cursor: "pointer" }}
                          className="fas fa-edit"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleEdit(whatsNew.id);
                          }}
                        />
                      </Tooltip>
                      {isDeleting && whatsNewDeleting.includes(whatsNew.id) ? (
                        <Spin size="small" className="segment-black-spinner" />
                      ) : (
                        <Tooltip title="Delete">
                          <i
                            style={{ cursor: "pointer" }}
                            className="fas fa-trash"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDelete(whatsNew.id);
                            }}
                          />
                        </Tooltip>
                      )}
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
              componentName="whatsNew"
              onClick={() => navigate("/dashboard/whats_new/create")}
              isMessage={false}
            />
          )}
        </>
      )}
    </>
  );
};

export default WhatsNewTable;
