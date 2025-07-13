import axios from "axios";
import React, { useState } from "react";
import "./AddTaskForm.css";

export default function AddTaskForm({ column, onTaskCreated }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("low");

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
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Newly created task:", response.data);

      if (response.status === 201 || response.status === 200) {
        onTaskCreated(response.data.savedTask);
        setTitle("");
        setDesc("");
        setPriority("low");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

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
