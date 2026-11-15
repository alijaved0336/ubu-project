import { CloseOutlined } from "@ant-design/icons";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Tooltip } from "antd";

const MediaItem = ({ id, media, onDelete, isMain }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

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
      className={`media-item ${isMain ? "main-item" : ""}`}
    >
      <img src={media} alt="media" className="media-image" />
      <CloseOutlined className="delete-icon" onPointerDown={onDelete} />
    </div>
  );
};

export default MediaItem;
