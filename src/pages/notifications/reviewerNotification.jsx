import { useState, useEffect, useCallback } from "react";
import { Filter } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./notifications.css";

const NotificationPage = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);

  const fetchUserRole = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/UserGetters/GetUserDetails`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const role = response.data?.role || response.data?.userRole;
      if (role) {
        setUserRole(role.toUpperCase());
        console.log("Fetched userRole:", role);
      } else {
        console.warn("User role not found in API response.");
      }
    } catch (error) {
      console.error("Failed to fetch user role:", error);
    }
  }, [API_ENDPOINT]);

  const fetchNotificationsFromAPI = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/Notifications/GetNotifications`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      let list = [];
      if (response.data?.status && Array.isArray(response.data.list)) {
        list = response.data.list;
      } else if (Array.isArray(response.data.notifications)) {
        list = response.data.notifications;
      } else if (Array.isArray(response.data)) {
        list = response.data;
      }

      const parsedList = list.map((n) => ({
        ...n,
        id: n.contactUsId || n.notificationId || n.id,
        type: n.type || "info",
        title: n.title || n.module || "Notification",
        message: n.message || "No message",
        // email: n.email || n.Email || '',
        timestamp: n.dateCreated ? new Date(n.dateCreated) : null,
        read: n.read || n.isViewedStatus || n.IsViewedStatus || false,
      }));

      setNotifications(parsedList);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setNotifications([]);
    }
  }, [API_ENDPOINT]);
  useEffect(() => {
    setSearchTerm("");
    fetchUserRole();
    fetchNotificationsFromAPI();
  }, [fetchUserRole, fetchNotificationsFromAPI]);

  const markNotificationAsViewed = async (notificationId) => {
    try {
      await axios.post(
        `${API_ENDPOINT}/api/MarkANotificationAsViewed/MarkNotificationAsViewed?notificationId=${notificationId}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    // Update backend for all unread notifications
    const unread = notifications.filter((n) => !n.isViewedStatus);
    await Promise.all(unread.map((n) => markNotificationAsViewed(n.id)));
    // Update frontend state
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true, isViewedStatus: true }))
    );
  };

  const handleNotificationClick = async (note) => {
    if (!note.read) {
      try {
        await markNotificationAsViewed(note.id); // call your backend to mark as read
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === note.id ? { ...notif, read: true } : notif
        )
      );
    }

    // Navigate based on role
    if (userRole === "ADMIN") {
      navigate("/notification-detail", {
        state: { notification: note, contactUsId: note.contactUsId },
      });
    } else if (userRole === "REVIEWER") {
      navigate(`/view-report/${note.reportID}`);
    } else if (userRole === "LECTURER") {
      navigate(`/view-lecture-report/${note.reportID}`);
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "unread"
        ? !notif.read
        : notif.type === filter;

    const search = searchTerm.toLowerCase();
    const matchesSearch =
      notif.title?.toLowerCase().includes(search) ||
      notif.message?.toLowerCase().includes(search) ||
      notif.email?.toLowerCase().includes(search) ||
      (notif.timestamp &&
        new Date(notif.timestamp).toLocaleDateString().includes(search));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="notification-page">
      <div className="container">
        <div className="header">
          <div className="header-left">
            <div className="header-text">
              <h1>Notifications</h1>
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="header-actions">
              <button onClick={markAllAsRead} className="btn btn-primary">
                Mark all read
              </button>
            </div>
          )}
        </div>

        <div className="filters">
          <div className="filter-container">
            <Filter className="filter-icon" />
            <span className="filter-label">Filter:</span>
            {[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`filter-btn ${filter === key ? "active" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              {/* <h3>No notifications</h3> */}
              <p>No notifications found.</p>
            </div>
          ) : (
            <ul className="notification-list">
              {filteredNotifications.map((note, index) => (
                <li
                  key={`note-${note.id || note.notificationId || index}`}
                  className={`notification-item ${
                    note.isViewedStatus ? "read" : "unread"
                  }`}
                  onClick={() => handleNotificationClick(note)}
                  style={{ position: "relative", cursor: "pointer" }}
                >
                  {/* Main notification content */}
                  <div className="notification-card">
                    {!note.isViewedStatus && <span className="unread-dot" />}
                    <span>{note.title}</span>: {note.message}
                  </div>

                  {/* Meta info */}
                  <div className="notification-meta">
                    {/* From: {note.email || "No email"} <br /> */}
                    On:{" "}
                    {note.timestamp
                      ? note.timestamp.toLocaleString()
                      : "Unknown time"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
