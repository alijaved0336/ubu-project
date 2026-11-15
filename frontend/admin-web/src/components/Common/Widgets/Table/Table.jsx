import PropTypes from "prop-types";
import React from "react";
import { Skeleton } from "antd";

const Table = ({ header, data, isTableLoading }) => {
  return (
    <div className="">
      <div className="tw-w-full">
        {isTableLoading ? (
          <Skeleton.Node
            active
            style={{
              width: 1200,
              height: 120,
            }}
          />
        ) : (
          <table className="!tw-w-full">
            <thead className="">
              <tr>
                {header.map((col, index) => (
                  <th
                    key={index}
                    className="tw-border-b tw-border-[#E2E8F0] tw-text-[#6B7280] tw-p-[15px] tw-bg-[#F9FAFB] tw-text-[0.75rem]"
                    style={{
                      textAlign: "left",
                    }}
                  >
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="">
              {data?.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <tr className="tw-cursor-pointer hover:tw-bg-primary">
                    {header.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className="tw-border-b tw-border-[#E2E8F0] tw-text-[#111827] tw-p-[15px] tw-font-semibold tw-text-[0.75rem]"
                        style={{
                          textAlign: "left",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row[col.selector]}
                      </td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

Table.propTypes = {
  header: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      selector: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isTableLoading: PropTypes.bool,
};

export default Table;
