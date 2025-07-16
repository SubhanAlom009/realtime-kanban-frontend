import { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./ActionLog.css";
import { SocketContext } from "../../context/SocketContext";

export default function ActionLog() {
  const [logs, setLogs] = useState([]);
  const [visible, setVisible] = useState(false);
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_BASE_URL;

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${API}/api/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(response.data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };

    fetchLogs();
  }, [API, token]);

  useEffect(() => {
    if (!socket) return;

    socket.on("log_created", (newLog) => {
      setLogs((prev) => [newLog, ...prev]);
    });

    return () => socket.off("log_created");
  }, [socket]);

  return (
    <div className={`logs ${visible ? "" : "logs--hidden"}`}>
      <button className="logs__toggle" onClick={() => setVisible(!visible)}>
        {visible ? "Hide »" : "« Show"}
      </button>

      {visible && (
        <>
          <h3 className="logs__title">Activity Logs</h3>
          <ul className="logs__list">
            {logs.map((log) => (
              <li key={log._id} className={`log log--${log.action}`}>
                <p className="log__message">{log.details}</p>
                <p className="log__meta">
                  By <strong>{log.performedBy?.username || "Unknown"}</strong> —{" "}
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
