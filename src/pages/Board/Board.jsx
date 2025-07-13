import React, { useMemo } from "react";
import "./Board.css";
import TaskCard from "../../components/TaskCard/TaskCard";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Board() {
  const API = import.meta.env.VITE_API_BASE_URL;

  const token = localStorage.getItem("token");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setTasks(response.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [API, token]);

  const grouped = useMemo(() => {
    const grouped = { todo: [], "in-progress": [], done: [] };
    tasks.forEach((task) => {
      grouped[task.status]?.push(task);
    });
    return grouped;
  }, [tasks]);

  return (
    <div className="board">
      {Object.entries(grouped).map(([status, tasks]) => (
        <div key={status} className="board__column">
          <h3>{status.toUpperCase()}</h3>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              assignedTo={task.assignedTo}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
