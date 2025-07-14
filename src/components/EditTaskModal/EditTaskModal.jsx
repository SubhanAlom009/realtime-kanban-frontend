import { useState, useEffect } from "react";
import "./EditTaskModal.css";
import axios from "axios";

export default function EditTaskModal({ isOpen, onClose, task, onUpdate }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("low");

  const API = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDesc(task.description || "");
      setPriority(task.priority || "low");
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🛠️ Editing task:", task);

    try {
      const response = await axios.put(
        `${API}/api/tasks/${task._id}`,
        {
          title,
          description: desc,
          priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onUpdate(response.data.updatedTask); // pass updated task
        onClose(); // close modal
      }
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
    }
  };

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
          <div className="modal__actions">
            <button type="button" className="modal__cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal__confirm">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
