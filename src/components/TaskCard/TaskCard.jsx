/* eslint-disable no-unused-vars */
import "./TaskCard.css";
import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({
  _id,
  title,
  description,
  priority,
  assignedTo,
  onDelete,
  onEdit,
  status,
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: _id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: transform ? "transform 200ms ease" : undefined,
    zIndex: transform ? 999 : "auto",
    boxShadow: transform
      ? "0 4px 12px rgba(0,0,0,0.15)"
      : "0 1px 2px rgba(0,0,0,0.05)",
  };
  return (
    <div
      className="taskcard"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className="taskcard__top">
        <h4 className="taskcard__title">{title}</h4>
        <div className="taskcard__actions">
          <button
            className="taskcard__edit"
            onClick={() =>
              onEdit({ _id, title, description, priority, assignedTo })
            }
          >
            ✏️
          </button>
          <button className="taskcard__delete" onClick={() => onDelete(_id)}>
            ❌
          </button>
        </div>
      </div>
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
