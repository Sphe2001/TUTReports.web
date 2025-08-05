import { useState, useEffect, useRef } from "react";
import "./NotificationBell.css";
import { Bell } from "lucide-react";
import axios from "axios";

import { useNavigate, Link } from "react-router-dom";

const NotificationBell = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleBellClick = async () => {
    if (notifications.length > 0) {
      try {
        await axios.post(
          `${API_ENDPOINT}/api/MarkANotifications/MarkAllNotificationsAsViewed`,
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setNotifications([]);
      } catch (error) {
        console.log("Failed to mark all as read.");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}/api/Notifications/GetNotifications`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response?.data?.status && Array.isArray(response.data.list)) {
          setNotifications(response.data.list);
        } else {
          console.log("No notifications found.");
        }
      } catch (error) {
        console.log("Error fetching notifications.");
        console.error(error);
      }
    };

    fetchNotifications();
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="notification-container" ref={dropdownRef}>
      <div className="notification-bell" onClick={handleBellClick}>
        {/* <Bell className="bell-icon" /> */}

        <Bell className="bell-icon" />

        {notifications.length > 0 && (
          <span className="notification-count">{notifications.length}</span>
        )}
      </div>
    </div>
  );
};

export default NotificationBell;
