import { useState, useEffect } from "react";
import "./EditTaskModal.css";
import axios from "axios";
import ConflictPrompt from "./../ConflictPrompt/ConflictPrompt";

export default function EditTaskModal({ isOpen, onClose, task, onUpdate }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("low");
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [autoAssign, setAutoAssign] = useState(true);
  const [conflict, setConflict] = useState(null);
  const [lastModified, setLastModified] = useState(null);

  const API = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDesc(task.description || "");
      setPriority(task.priority || "low");
      setAssignedTo(
        task.assignedTo && typeof task.assignedTo === "object"
          ? task.assignedTo._id
          : task.assignedTo || ""
      );
      setLastModified(task.lastModified || new Date().toISOString());
    }
  }, [task]);

  useEffect(() => {
    if (!isOpen || !task) return;

    // Lock the task when modal opens
    axios
      .put(`${API}/api/tasks/${task._id}/lock`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((err) => {
        console.error("Error locking task:", err);
      });

    // Unlock when modal closes (on cleanup)
    return () => {
      if (task && task._id) {
        axios
          .put(`${API}/api/tasks/${task._id}/unlock`, null, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch((err) => {
            console.error("Error unlocking task:", err);
          });
      }
    };
  }, [isOpen, task, API, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${API}/api/tasks/${task._id}`,
        {
          title,
          description: desc,
          priority,
          assignedTo: autoAssign ? null : assignedTo,
          lastModified, // ✅ Pass this for conflict detection
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onUpdate(response.data.updatedTask);
        onClose();
      }
    } catch (err) {
      if (err.response?.status === 409) {
        // 🧠 Conflict detected
        setConflict({
          server: err.response.data.currentTask,
          client: err.response.data.yourAttempt,
        });
      } else {
        console.error("Update failed:", err.response?.data || err.message);
      }
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/api/auth/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [API, token]);

  if (!isOpen) return null;

  return (
    <div className="modal__overlay">
      <div className="modal">
        <h3>Edit Task</h3>
        <form className="edit__form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="addtask__assign">
            <label>
              <input
                type="radio"
                name="assignMode"
                value="auto"
                checked={autoAssign}
                onChange={() => setAutoAssign(true)}
              />
              Smart Assign
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                name="assignMode"
                value="manual"
                checked={!autoAssign}
                onChange={() => setAutoAssign(false)}
              />
              Manual Assign
            </label>
          </div>

          {!autoAssign && (
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
          )}

          <div className="modal__actions">
            <button type="button" className="modal__cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal__confirm">
              Save Changes
            </button>
          </div>
        </form>
        {conflict && (
          <ConflictPrompt
            conflict={conflict}
            onResolve={async (choice) => {
              const chosen =
                choice === "server" ? conflict.server : conflict.client;

              try {
                const response = await axios.put(
                  `${API}/api/tasks/${task._id}`,
                  {
                    ...chosen,
                    lastModified: conflict.server.lastModified, // Always use server's timestamp
                  },
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                if (response.status === 200) {
                  onUpdate(response.data.updatedTask);
                  setConflict(null);
                  onClose();
                }
              } catch (err) {
                console.error("Conflict resolution failed:", err);
              }
            }}
            onCancel={() => setConflict(null)}
          />
        )}
      </div>
    </div>
  );
}
