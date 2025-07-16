import "./ConflictPrompt.css";

export default function ConflictPrompt({ conflict, onResolve, onCancel }) {
  if (!conflict) return null;

  const { server, client } = conflict;

  return (
    <div className="conflict-overlay">
      <div className="conflict-modal">
        <div className="conflict-header">
          <div className="conflict-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 9V14M12 17.5V17.51M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3>Version Conflict</h3>
        </div>

        <p className="conflict-message">
          This task was updated by another user while you were making changes.
        </p>

        <div className="conflict-versions">
          <div className="conflict-version server">
            <div className="version-label">Server Version</div>
            <div className="version-content">
              <div className="version-field">
                <span>Title</span>
                <p>{server.title}</p>
              </div>
              <div className="version-field">
                <span>Description</span>
                <p>{server.description || "No description"}</p>
              </div>
              <div className="version-field">
                <span>Priority</span>
                <p className={`priority-badge ${server.priority}`}>
                  {server.priority}
                </p>
              </div>
            </div>
            <button
              className="version-select-btn server-btn"
              onClick={() => onResolve("server")}
            >
              Use Server Version
            </button>
          </div>

          <div className="conflict-divider">
            <div className="conflict-divider-line"></div>
            <div className="conflict-divider-text">or</div>
            <div className="conflict-divider-line"></div>
          </div>

          <div className="conflict-version client">
            <div className="version-label">Your Version</div>
            <div className="version-content">
              <div className="version-field">
                <span>Title</span>
                <p>{client.title}</p>
              </div>
              <div className="version-field">
                <span>Description</span>
                <p>{client.description || "No description"}</p>
              </div>
              <div className="version-field">
                <span>Priority</span>
                <p className={`priority-badge ${client.priority}`}>
                  {client.priority}
                </p>
              </div>
            </div>
            <button
              className="version-select-btn client-btn"
              onClick={() => onResolve("client")}
            >
              Use Your Version
            </button>
          </div>
        </div>

        <button className="conflict-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
