import Media from "../Media/Media";
import PropTypes from "prop-types";
import MediaItem from "./MediaItem";
import "./MediaPreview.less";
import { Skeleton } from "antd";
import { arrayMove } from "@dnd-kit/sortable";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";

import {
  closestCorners,
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";



const MediaPreview = ({
  isLoading,
  media,
  setMedia,
  onMediaDelete,
  manuallyAddedMedia,
  setManuallyAddedMedia,
  optionalTitle,
}) => {
  const maxVisibleItems = 9;
  const visibleMedia = media.slice(0, maxVisibleItems);

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
    <div className="tw-gap-5 tw-flex tw-flex-col tw-w-full">
      <div className="media-preview-container">
        <div className="preview-text">
          {optionalTitle ? <h2>{optionalTitle}</h2> : <h2>Media Preview</h2>}{" "}
        </div>
        {isLoading ? (
          <Skeleton.Button block active size="large" style={{ height: 180 }} />
        ) : media.length === 0 ? (
          <Skeleton.Image
            block
            size="large"
            className="media-preview-skeleton"
            // style={{ height: 180 }}
          />
        ) : (
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <SortableContext strategy={rectSortingStrategy} items={media}>
              <div className="media-preview">
                <div className="main-media">
                  {visibleMedia.length > 0 && (
                    <MediaItem
                      id={visibleMedia[0].id}
                      key={0}
                      index={0}
                      media={visibleMedia[0].url}
                      onDelete={() => onMediaDelete(0)}
                      isMain={true}
                    />
                  )}
                </div>
                <div className="other-media">
                  <div className="other-first-row">
                    {visibleMedia.slice(1, 5).map((item, index) => (
                      <MediaItem
                        id={item.id}
                        key={index + 1}
                        index={index}
                        media={item.url}
                        onDelete={() => onMediaDelete(index + 1)}
                      />
                    ))}
                  </div>

                  <div className="other-second-row">
                    {visibleMedia.slice(5, 9).map((item, index) => (
                      <MediaItem
                        id={item.id}
                        key={index + 5}
                        index={index}
                        media={item.url}
                        onDelete={() => onMediaDelete(index + 5)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {manuallyAddedMedia && setManuallyAddedMedia && (
        <Media
          isLoading={isLoading}
          media={manuallyAddedMedia}
          setMedia={setManuallyAddedMedia}
        />
      )}
    </div>
  );
};

MediaPreview.propTypes = {
  isLoading: PropTypes.bool,
  media: PropTypes.array,
  setMedia: PropTypes.func,
  onMediaDelete: PropTypes.func,
  manuallyAddedMedia: PropTypes.array,
  setManuallyAddedMedia: PropTypes.func,
  optionalTitle: PropTypes.string,
};

export default MediaPreview;
