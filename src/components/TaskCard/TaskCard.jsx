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
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: _id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: transform
      ? "none"
      : "transform 0.3s ease, box-shadow 0.3s ease",
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      className={`taskcard ${isDragging ? "is-dragging" : ""}`}
      style={style}
      data-priority={priority}
    >
      <div className="taskcard__content">
        <div className="taskcard__header">
          <h3 className="taskcard__title">{title}</h3>

          <div className="taskcard__header-actions">
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
              title="Edit Task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button
              className="taskcard__delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(_id);
              }}
              title="Delete Task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <span
              className="taskcard__drag"
              {...attributes}
              {...listeners}
              title="Drag Task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="currentColor"
              >
                <circle cx="6" cy="6" r="2"></circle>
                <circle cx="18" cy="6" r="2"></circle>
                <circle cx="6" cy="18" r="2"></circle>
                <circle cx="18" cy="18" r="2"></circle>
                <circle cx="6" cy="12" r="2"></circle>
                <circle cx="18" cy="12" r="2"></circle>
              </svg>
            </span>
          </div>
        </div>

        {description && <p className="taskcard__desc">{description}</p>}

        <div className="taskcard__details">
          <span className={`taskcard__priority ${priority}`}>
            {priority === "high"
              ? "High"
              : priority === "medium"
              ? "Medium"
              : "Low"}
          </span>

          {assignedTo && (
            <div className="taskcard__user">
              <span className="taskcard__user-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <span className="taskcard__username">
                {assignedTo.username || assignedTo.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
