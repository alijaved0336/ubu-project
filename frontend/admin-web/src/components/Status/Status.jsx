import PropTypes from "prop-types";
import "./Status.less";

import { Skeleton } from "antd";

const Status = ({ status, setStatus, parent, isLoading }) => {
  const handleStatusChange = (e) => setStatus(e.target.value);

  return (
    <div className="status-component">
      <h2>Status</h2>
      <div className="input-group">
        <label>{parent} Status</label>
        {isLoading ? (
          <Skeleton.Button block active size="large" />
        ) : (
          <select value={status} onChange={handleStatusChange}>
            <option>Published</option>
            <option>Draft</option>
            {/* Add other status options here */}
          </select>
        )}
      </div>
    </div>
  );
};

Status.propTypes = {
  status: PropTypes.string,
  setStatus: PropTypes.func,
  parent: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default Status;
