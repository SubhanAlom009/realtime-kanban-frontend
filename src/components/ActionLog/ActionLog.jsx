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

  // Function to check if the device is mobile
  const isMobile = () => {
    return window.innerWidth <= 992;
  };

  // Set initial visibility based on screen size
  useEffect(() => {
    setVisible(!isMobile());

    // Update visibility on resize
    const handleResize = () => {
      setVisible(!isMobile());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to format time in a more readable way
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <button
        className="logs__toggle"
        onClick={() => setVisible(true)}
        title="Show Activity Log"
      >
        <i className="fas fa-history"></i>
      </button>

      <div className={`logs ${visible ? "visible" : ""}`}>
        <div className="logs__content">
          <div className="logs__header">
            <div className="logs__title">
              Activity Logs
              <button
                className="logs__close"
                onClick={() => setVisible(false)}
                title="Close Activity Log"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div className="logs__scrollable">
            <ul className="logs__list">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <li key={log._id} className={`log log--${log.action}`}>
                    <p className="log__message">{log.details}</p>
                    <p className="log__meta">
                      <i className="fas fa-user"></i>
                      <strong>
                        {log.performedBy?.username || "Unknown"}
                      </strong>{" "}
                      • {formatTime(log.createdAt)}
                    </p>
                  </li>
                ))
              ) : (
                <p>No activity logs yet</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
