import axios from "axios";
import React, { useEffect, useState } from "react";
import "./AddTaskForm.css";
import { toast } from "react-toastify";

export default function AddTaskForm({ column, onTaskCreated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("low");
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [autoAssign, setAutoAssign] = useState(true);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API}/api/tasks`,
        {
          title,
          description: desc,
          priority,
          status: column,
          assignedTo: autoAssign ? null : assignedTo || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Task created successfully!");
      if (response.status === 201 || response.status === 200) {
        // Pass the new task to the parent component
        onTaskCreated(response.data);
        // Reset form
        setTitle("");
        setDesc("");
        setPriority("low");
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
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

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("addtask-overlay")) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {/* Add Task Button */}
      <button className="addtask__toggle" onClick={() => setIsModalOpen(true)}>
        Add Task
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="addtask-overlay" onClick={handleOverlayClick}>
          <div className="addtask-modal">
            <form className="addtask" onSubmit={handleSubmit}>
              <div className="addtask__header">
                <h3>Add Task to {column.toUpperCase()}</h3>
                <button
                  type="button"
                  className="addtask__close"
                  onClick={() => setIsModalOpen(false)}
                >
                  ×
                </button>
              </div>

              <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Task Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
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
                  <span>Smart Assign</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="assignMode"
                    value="manual"
                    checked={!autoAssign}
                    onChange={() => setAutoAssign(false)}
                  />
                  <span>Manual Assign</span>
                </label>
              </div>

              {!autoAssign && (
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">Select team member to assign</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              )}

              <div className="addtask__btns">
                <button type="submit">Create Task</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
