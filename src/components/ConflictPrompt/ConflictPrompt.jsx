import "./ConflictPrompt.css";

export default function ConflictPrompt({ conflict, onResolve, onCancel }) {
  if (!conflict) return null;

  const { server, client } = conflict;

  return (
    <div className="modal__overlay">
      <div className="modal conflict__modal">
        <h3>⚠️ Conflict Detected</h3>
        <p>Another user updated this task while you were editing it.</p>

        <div className="conflict__versions">
          <div>
            <h4>💾 Latest Version</h4>
            <p>
              <strong>Title:</strong> {server.title}
            </p>
            <p>
              <strong>Description:</strong> {server.description}
            </p>
            <p>
              <strong>Priority:</strong> {server.priority}
            </p>
          </div>

          <div>
            <h4>📝 Your Changes</h4>
            <p>
              <strong>Title:</strong> {client.title}
            </p>
            <p>
              <strong>Description:</strong> {client.description}
            </p>
            <p>
              <strong>Priority:</strong> {client.priority}
            </p>
          </div>
        </div>

        <div className="modal__actions">
          <button className="modal__cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="modal__confirm"
            onClick={() => onResolve("server")}
          >
            Keep Server Version
          </button>
          <button
            className="modal__confirm"
            onClick={() => onResolve("client")}
          >
            Overwrite with Mine
          </button>
        </div>
      </div>
    </div>
  );
}
