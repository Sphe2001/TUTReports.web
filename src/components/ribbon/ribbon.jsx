import { useState, useEffect, useRef } from "react";
import "./ribbon.css";
import { Bell } from "lucide-react";
import axios from "axios";
import DarkModeToggle from "../themeToggle/darkModeToggle";
import { Link, useNavigate } from "react-router-dom";
import { showAdminMessageModal } from "../ribbon/adminMessageModal";

export default function Ribbon({ interface: interfaceData = null }) {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}/api/UserGetters/GetUserDetails`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response?.data?.status) {
          setName(response.data.name);
          setSurname(response.data.surname);
          setUserRole(response.data.role);
          setUserRole(response.data.role.toUpperCase());
        }
      } catch {
        setName("Name");
        setSurname("Surname");
      }
    };

    const getProfilePicture = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}/api/UserProfile/ViewProfilePicture`,
          {
            withCredentials: true,
            responseType: "blob",
          }
        );
        const imageUrl = URL.createObjectURL(response.data);
        setProfile(imageUrl);
      } catch {
        setProfile(null);
      }
    };

    const fetchNotificationsPreview = async () => {
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
          list = response.data.list.filter((n) => !n.isViewedStatus);
          setUnreadCount(response.data?.unreadCount || 0);
        } else if (Array.isArray(response.data.notifications)) {
          list = response.data.notifications.filter((n) => !n.isViewedStatus);
          setUnreadCount(response.data?.unreadCount || 0);
        } else if (Array.isArray(response.data)) {
          list = response.data.filter((n) => !n.isViewedStatus);
          setUnreadCount(response.data?.unreadCount || 0);
        }

        // Deduplicate by notificationId
        const unique = [];
        const seen = new Set();
        for (const n of list) {
          if (!seen.has(n.notificationId)) {
            unique.push(n);
            seen.add(n.notificationId);
          }
        }

        setNotifications(unique.slice(0, 5)); // Only show top 5 unique unread notifications
      } catch (err) {
        setNotifications([]);
        console.log("Failed to fetch notifications:", err);
      }
    };
    if (interfaceData) {
      setName(interfaceData);
      setSurname(interfaceData);
      setProfile(interfaceData);
    } else {
      fetchUserDetails();
      getProfilePicture();
      fetchNotificationsPreview();
    }
  }, [interfaceData]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // New: Mark notification as viewed on backend, then remove from state
  const markNotificationAsViewed = async (notificationId) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/MarkANotificationAsViewed/MarkNotificationAsViewed?notificationId=${notificationId}`,
        {},
        { withCredentials: true }
      );

      if (response.data?.success) {
        // Remove from preview list
        setNotifications((prev) =>
          prev.filter((n) => n.notificationId !== notificationId)
        );

        // Decrease unread count
        // (badge will update automatically)
      } else {
        console.warn(
          "Failed to mark notification as viewed:",
          response.data.message
        );
      }
    } catch (err) {
      console.error("Error marking notification viewed:", err);
    }
  };

  const markAllAsRead = async () => {
    // Find all unread notifications
    const unread = notifications.filter((n) => !n.isViewedStatus);

    // Mark each as viewed in the backend
    await Promise.all(
      unread.map((n) => markNotificationAsViewed(n.notificationId))
    );

    // Update frontend state
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isViewedStatus: true }))
    );
    setUnreadCount(0);
    setDropdownOpen(false);
  };

  const handleViewAllClick = () => {
    setDropdownOpen(false);

    // Remove all notifications from the ribbon preview (but do NOT mark as viewed)
    setNotifications([]);

    // Navigate to the correct notifications page
    if (userRole === "ADMIN") {
      navigate("/admin-notification");
    } else if (userRole === "REVIEWER") {
      navigate("/reviewer-notification");
    } else if (userRole === "LECTURER") {
      navigate("/lecturer-notification");
    } else {
      console.warn("Unknown user role:", userRole);
    }
  };

  const handleNotificationClick = async (note) => {
    if (userRole === "ADMIN") {
      await markNotificationAsViewed(note.notificationId);
      setDropdownOpen(false);
      await showAdminMessageModal(note);
    } else if (userRole === "REVIEWER") {
      await markNotificationAsViewed(note.notificationId);
      setDropdownOpen(false);
      navigate(`/view-report/${note.reportID}`);
    } else if (userRole === "LECTURER") {
      await markNotificationAsViewed(note.notificationId);
      setDropdownOpen(false);
      navigate(`/view-lecture-report/${note.reportID}`);
    }
  };

  return (
    <div className="ribbon-container">
      <div className="ribbon-logo-container">
        <Link to="/home" className="ribbon-logo-link">
          <img className="theme-logo" alt="TUT Logo" />
        </Link>
      </div>

      <div className="notification-profile-container" ref={dropdownRef}>
        <div className="bell-icon-container">
          <DarkModeToggle />
          <button
            className="message-icon-button"
            onClick={toggleDropdown}
            aria-label="Notifications"
          >
            <Bell className="message-icon" size={28} />
            {notifications.length > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {dropdownOpen && (
            <div className="notification-dropdown">
              <div className="notification-dropdown-header">Notifications</div>
              {notifications.length > 0 && (
                <button className="mark-all-viewed" onClick={markAllAsRead}>
                  Mark All Viewed
                </button>
              )}
              <ul className="notification-dropdown-list">
                {notifications.length === 0 ? (
                  <li className="notification-item">No notifications</li>
                ) : (
                  notifications.map((note) => (
                    <li
                      key={note.notificationId}
                      className="notification-item"
                      onClick={() => handleNotificationClick(note)}
                      style={{ cursor: "pointer" }}
                    >
                      <strong>{note.module}</strong>: {note.message}
                      <br />
                      <small>
                        {new Date(note.dateCreated).toLocaleDateString()}
                      </small>
                    </li>
                  ))
                )}
              </ul>

              <button className="view-all-button" onClick={handleViewAllClick}>
                View All
              </button>
            </div>
          )}
        </div>

        <div className="user-info">
          <img
            src={
              profile ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                `${name?.charAt(0) || ""}${surname?.charAt(0) || ""}` || "User"
              )}&background=random`
            }
            alt={name}
            className="user-avatar"
          />

          <div className="user-text">
            <p className="user-name">
              {name.charAt(0).toUpperCase() + ". " + surname.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
