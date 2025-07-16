import React, { useContext, useMemo, useEffect, useState } from "react";
import "./Board.css";
import axios from "axios";

import { DndContext } from "@dnd-kit/core";
import { SocketContext } from "../../context/SocketContext";

import TaskCard from "../../components/TaskCard/TaskCard";
import AddTaskForm from "../../components/AddTaskForm/AddTaskForm";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import EditTaskModal from "../../components/EditTaskModal/EditTaskModal";
import DroppableColumn from "../../components/DroppableColumn/DroppableColumn";
import ActionLog from "../../components/ActionLog/ActionLog";

export default function Board() {
  const API = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const { socket } = useContext(SocketContext);

  const handleAskDelete = (taskId) => {
    setDeleteTaskId(taskId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/api/tasks/${deleteTaskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((task) => task._id !== deleteTaskId));
      setIsModalOpen(false);
      setDeleteTaskId(null);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    try {
      const currentTask = tasks.find((t) => t._id === active.id);
      if (!currentTask) {
        console.error("Task not found:", active.id);
        return;
      }
      console.log("Moving task with timestamp:", currentTask.lastModified);

      const res = await axios.put(
        `${API}/api/tasks/${active.id}`,
        {
          status: over.id,
          lastModified: currentTask.lastModified,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        const updatedTask = res.data.updatedTask;
        setTasks((prev) =>
          prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
        );
      }
    } catch (err) {
      if (err.response?.status === 409) {
        console.log("Conflict detected during drag and drop!");
        // Handle conflict (maybe show toast notification)
        // toast.error("Task was updated by someone else. Please refresh.");
      } else {
        console.error("DnD update failed:", err);
      }
    }
  };

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) setTasks(response.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [API, token]);

  // Group tasks
  const grouped = useMemo(() => {
    const grouped = { todo: [], "in-progress": [], done: [] };
    tasks.forEach((task) => {
      grouped[task.status]?.push(task);
    });
    return grouped;
  }, [tasks]);

  // Status titles mapping
  const statusTitles = {
    todo: "TO DO",
    "in-progress": "IN PROGRESS",
    done: "DONE",
  };

  // Listen to socket events
  useEffect(() => {
    if (!socket) return;

    socket.on("task_created", (task) => {
      setTasks((prev) => [...prev, task]);
    });

    socket.on("task_updated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    });

    socket.on("task_deleted", (taskId) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    return () => {
      socket.off("task_created");
      socket.off("task_updated");
      socket.off("task_deleted");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    return () => {
      socket.off("task_locked");
      socket.off("task_unlocked");
    };
  }, [socket]);

  return (
    <div className="board__layout">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="board__main">
          <div className="board">
            {Object.entries(grouped).map(([status, statusTasks]) => (
              <div className="board__column-wrapper" key={status}>
                <div className="column__header">
                  <div className="column__title">
                    {statusTitles[status]}
                    <span className="column__count">{statusTasks.length}</span>
                  </div>
                </div>

                <DroppableColumn id={status}>
                  <div>
                    <AddTaskForm
                      column={status}
                      onTaskCreated={(newTask) =>
                        setTasks((prev) => [...prev, newTask])
                      }
                    />
                  </div>

                  <div className="column__tasks">
                    {statusTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        _id={task._id}
                        title={task.title}
                        description={task.description}
                        priority={task.priority}
                        assignedTo={task.assignedTo}
                        status={task.status}
                        onDelete={() => handleAskDelete(task._id)}
                        onEdit={(taskObj) => {
                          setTaskToEdit(taskObj);
                          setIsEditModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </DroppableColumn>
              </div>
            ))}
          </div>

          <ConfirmModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={confirmDelete}
            message="Do you really want to delete this task?"
          />

          <EditTaskModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            task={taskToEdit}
            onUpdate={(updatedTask) => {
              setTasks((prev) =>
                prev.map((task) =>
                  task._id === updatedTask._id ? updatedTask : task
                )
              );
            }}
          />
        </div>
      </DndContext>
      <ActionLog />
    </div>
  );
}
