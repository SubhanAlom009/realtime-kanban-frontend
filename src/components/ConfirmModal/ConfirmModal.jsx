import "./ConfirmModal.css";

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="modal__title">Confirm Deletion</h3>
        <p className="modal__message">
          {message || "Are you sure you want to delete this task?"}
        </p>
        <div className="modal__actions">
          <button className="modal__cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal__confirm" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
