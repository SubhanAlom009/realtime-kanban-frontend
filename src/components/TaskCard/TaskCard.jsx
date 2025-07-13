import "./TaskCard.css";

export default function TaskCard({ title, description, priority, assignedTo }) {
  return (
    <div className="taskcard">
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
