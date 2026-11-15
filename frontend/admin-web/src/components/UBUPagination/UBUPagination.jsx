import { Pagination } from "antd";
import propTypes from "prop-types";

import "./UBUPagination.less";
import cn from "@src/cn";

function UBUPagination({
  currentPage,
  itemsPerPage,
  totalItems,
  className,
  handlePaginationChange,
}) {
  return (
    <Pagination
      current={currentPage}
      pageSize={itemsPerPage}
      total={totalItems}
      onChange={handlePaginationChange}
      showSizeChanger={true}
      className={cn("UBUPagination", className)}
      responsive
    />
  );
}

UBUPagination.propTypes = {
  currentPage: propTypes.number,
  itemsPerPage: propTypes.number,
  totalItems: propTypes.number,
  className: propTypes.string,
  handlePaginationChange: propTypes.func,
};

export default UBUPagination;
