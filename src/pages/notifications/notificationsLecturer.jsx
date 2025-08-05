import { useState, useEffect } from "react";
import "./notificationsLecturer.css";

const NotificationsLecturer = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDateTime = currentDateTime.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="notifications-page-container">
      <div className="notifications-container">
        <div className="notifications-dashboard">
          <div className="notifications-header">
            <h1 className="notifications-title">Report Deadlines</h1>
            <p className="notifications-subtitle">
              Track your upcoming submission dates
            </p>
            <p className="notifications-datetime">{formattedDateTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsLecturer;
