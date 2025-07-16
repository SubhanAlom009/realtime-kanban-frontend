# 📄 CollabBoard - Realtime Collaborative Kanban App

## 🌐 Project Overview

CollabBoard is a full-stack collaborative Kanban board application built with the MERN stack. It supports real-time task updates via Socket.IO, smart task assignment, and conflict resolution during concurrent edits.

Users can:

- Create, edit, and delete tasks.
- Organize tasks across `Todo`, `In Progress`, and `Done` columns.
- Assign tasks manually or enable **Smart Assign** to auto-distribute workloads.
- Get real-time updates when others modify the board.
- View a detailed **Activity Log** of all task actions.
- Detect and resolve conflicts during simultaneous editing.

---

## 🏃‍♂️ Tech Stack

### ✨ Frontend

- React 19
- Axios
- React Router DOM
- DnD Kit (@dnd-kit/core) for drag & drop
- React Toastify (notifications)
- CSS Modules

### 📁 Backend

- Node.js + Express
- MongoDB + Mongoose
- Socket.IO for real-time communication
- JWT for authentication
- express-validator for validation

---

## 📄 Features & Usage Guide

### ✍️ Authentication

- Register & login with email and password.
- Token-based session handling via localStorage.

### 📋 Task Management

- Add, edit, and delete tasks.
- Drag-and-drop tasks across status columns.

### 🌐 Real-Time Collaboration

- Socket.IO powers live updates.
- Any task update is reflected instantly for all users.

### 📊 Activity Logs

- Action logs (create, delete, edit, move, assign) with user and timestamp.
- Logs are updated live as actions happen.

### 🤖 Smart Assign

- Auto-assigns tasks to the user with the least load (fewest active tasks).
- Option to choose between **Smart** and **Manual** assign while creating/editing tasks.

### ⚡ Conflict Detection & Resolution

- If two users edit the same task at the same time:

  - A conflict modal appears.
  - User can choose to keep the **server version** or **overwrite with their version**.

---

## 🫡 Smart Assign Logic

In the backend, we find the user with the fewest active (non-completed) tasks. This logic is invoked if no user is explicitly selected during task creation.

---

## ⚠️ Conflict Handling Logic

Each task has a `lastModified` field (timestamp).

During edit:

- The client sends the `lastModified` timestamp of their task version.
- The server compares this with the current DB value.
- If timestamps mismatch (i.e., another user has edited it in between), the server returns a `409 Conflict`.

Frontend displays a modal:

- User can pick:

  - **Keep Server Version** (discard own changes)
  - **Overwrite with Mine** (force update)

---

## 📞 Live Demo & Deployment

---

## 🙏 Acknowledgements

- Thanks to the internship team for this awesome opportunity.

---

## 💪 Author

- Name: Subhan Alom
- GitHub: [@SubhanAlom009](https://github.com/SubhanAlom009)
- Portfolio: [View Portfolio](https://subhanalom.live)
