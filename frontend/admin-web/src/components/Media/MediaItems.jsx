import PropTypes from "prop-types";
import MediaItem from "./MediaItem";
import "./Media.less";

import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";

const MediaItems = ({ media, handleRemoveFile }) => {
  return (
    <SortableContext strategy={rectSortingStrategy} items={media}>
      <div className="media-preview">
        {media?.map((file, index) => (
          <MediaItem
            id={file.id}
            key={index}
            index={index}
            handleRemoveFile={handleRemoveFile}
            file={file}
          />
        ))}
      </div>
    </SortableContext>
  );
};

MediaItems.propTypes = {
  media: PropTypes.array,
  handleRemoveFile: PropTypes.func,
};

export default MediaItems;
