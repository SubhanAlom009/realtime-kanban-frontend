import axios from "axios";
import React, { useEffect, useState } from "react";
import "./AddTaskForm.css";
import { toast } from "react-toastify";

export default function AddTaskForm({ column }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("low");
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");

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
          assignedTo: assignedTo || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Task created successfully!");
      if (response.status === 201 || response.status === 200) {
        setTitle("");
        setDesc("");
        setPriority("low");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating task:", error);
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

  return open ? (
    <form className="addtask" onSubmit={handleSubmit}>
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
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      >
        <option value="">Unassigned</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.username} ({user.email})
          </option>
        ))}
      </select>

      <div className="addtask__btns">
        <button type="submit">Add</button>
        <button type="button" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  ) : (
    <button className="addtask__toggle" onClick={() => setOpen(true)}>
      + Add Task
    </button>
  );
}
