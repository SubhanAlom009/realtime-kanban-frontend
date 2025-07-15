import "./TaskCard.css";
import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({
  _id,
  title,
  description,
  priority,
  assignedTo,
  status,
  onDelete,
  onEdit,
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: _id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: transform ? "transform 200ms ease" : undefined,
  };

  return (
    <div ref={setNodeRef} className="taskcard" style={style}>
      <div className="taskcard__top">
        <div className="taskcard__actions">
          <button
            className="taskcard__edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.({
                _id,
                title,
                description,
                priority,
                assignedTo,
                status,
              });
            }}
          >
            ✏️
          </button>
          <button
            className="taskcard__delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(_id);
            }}
          >
            🗑️
          </button>

          {/* ✅ Drag icon moved here */}
          <span
            className="taskcard__drag"
            {...attributes}
            {...listeners}
            title="Drag Task"
          >
            ⠿
          </span>
        </div>
      </div>

      <h4 className="taskcard__title">{title}</h4>
      <p className="taskcard__desc">{description}</p>

      <div className="taskcard__meta">
        <span className={`taskcard__priority ${priority}`}>
          {priority.toUpperCase()}
        </span>
        {assignedTo && (
          <span className="taskcard__user">
            👤 {assignedTo.username || assignedTo.email}
          </span>
        )}
      </div>
    </div>
  );
}
