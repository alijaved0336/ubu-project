import PropTypes from "prop-types";
import "./Media.less";

import { Tooltip } from "antd";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

const MediaItem = ({ id, index, handleRemoveFile, file }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const getMediaUrl = (file) => {
    if (file.file) {
      return URL.createObjectURL(file.file);
    }
    return file.url;
  };

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, touchAction: "none" }}
      {...attributes}
      {...listeners}
      className="media-item"
    >
      {file.type.startsWith("image") ? (
        <img src={getMediaUrl(file)} alt={`media-${index}`} />
      ) : (
        <video src={getMediaUrl(file)} controls />
      )}
      <span
        className="remove-media-button"
        onPointerDown={(event) => {
          event.stopPropagation();
          handleRemoveFile(event, index);
        }}
      >
        X
      </span>
    </div>
  );
};

MediaItem.propTypes = {
  id: PropTypes.number,
  index: PropTypes.number,
  handleRemoveFile: PropTypes.func,
  file: PropTypes.object,
};

export default MediaItem;
