import React, { useMemo } from "react";
import "./Board.css";
import TaskCard from "../../components/TaskCard/TaskCard";
import { useEffect, useState } from "react";
import axios from "axios";
import AddTaskForm from "../../components/AddTaskForm/AddTaskForm";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import EditTaskModal from "../../components/EditTaskModal/EditTaskModal";
import { DndContext } from "@dnd-kit/core";
import DroppableColumn from "../../components/DroppableColumn/DroppableColumn";

export default function Board() {
  const API = import.meta.env.VITE_API_BASE_URL;

  const token = localStorage.getItem("token");
  const [tasks, setTasks] = useState([]);

  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleAskDelete = (taskId) => {
    setDeleteTaskId(taskId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/api/tasks/${deleteTaskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prev) => prev.filter((task) => task._id !== deleteTaskId));
      setIsModalOpen(false);
      setDeleteTaskId(null);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

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

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const draggedId = active.id;
    const newStatus = over.id;

    try {
      const response = await axios.put(
        `${API}/api/tasks/${draggedId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedTask = response.data.updatedTask;
        setTasks((prev) =>
          prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
        );
      }
    } catch (err) {
      console.error("DnD update failed:", err);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="board">
        {Object.entries(grouped).map(([status, tasks]) => (
          <DroppableColumn id={status} key={status}>
            <h3>{status.toUpperCase()}</h3>
            <AddTaskForm
              column={status}
              onTaskCreated={(newTask) =>
                setTasks((prev) => [...prev, newTask])
              }
            />
            {tasks.map((task) => (
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
          </DroppableColumn>
        ))}
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
  );
}
