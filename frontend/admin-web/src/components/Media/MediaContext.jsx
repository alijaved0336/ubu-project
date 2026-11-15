import PropTypes from "prop-types";
import MediaItems from "./MediaItems";
import { arrayMove } from "@dnd-kit/sortable";

import {
  closestCorners,
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const MediaContext = ({ media, setMedia, handleRemoveFile }) => {
  const getTaskPos = (id) => media.findIndex((task) => task.id == id);
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) return;
    if (active?.id === over?.id) return;
    setMedia((media) => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over.id);
      return arrayMove(media, originalPos, newPos);
    });
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <MediaItems media={media} handleRemoveFile={handleRemoveFile} />
    </DndContext>
  );
};

MediaContext.propTypes = {
  media: PropTypes.array,
  setMedia: PropTypes.func,
  handleRemoveFile: PropTypes.func,
};

export default MediaContext;
