import React, { useState, useEffect } from "react";
import { Clock, Calendar, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import "./deadlineCounter.css";

function DeadlineCountdown({ deadlines }) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [nextFriday, setNextFriday] = useState(null);
  const [thisWeekDeadlines, setThisWeekDeadlines] = useState([]);

  const getNextFriday = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const daysUntilFriday = (5 - currentDay + 7) % 7;
    const nextFriday = new Date(now);
    nextFriday.setDate(now.getDate() + daysUntilFriday);
    nextFriday.setHours(23, 59, 59, 999);
    return nextFriday;
  };

  const calculateTimeRemaining = (deadline) => {
    const now = new Date().getTime();
    const deadlineTime = deadline.getTime();
    const difference = deadlineTime - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const friday = getNextFriday();
    setNextFriday(friday);

    const filtered = deadlines.filter((d) => {
      const [day, month, year] = d.deadline.split("-");
      const deadlineDate = new Date(`${year}-${month}-${day}T23:59:59`);
      return !d.isSubmitted && deadlineDate <= friday;
    });

    setThisWeekDeadlines(filtered);

    if (filtered.length > 0) {
      // Simulate CRITICAL (< 24 hours left)
      // setTimeRemaining({ days: 0, hours: 5, minutes: 30, seconds: 0 });

      // Simulate WARNING (24–48 hours left)
      // setTimeRemaining({ days: 1, hours: 10, minutes: 0, seconds: 0 });

      // Simulate NORMAL (> 48 hours left)
      // setTimeRemaining({ days: 3, hours: 0, minutes: 0, seconds: 0 });
      const timer = setInterval(() => {
        const remaining = calculateTimeRemaining(friday);
        setTimeRemaining(remaining);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [deadlines]);

  if (thisWeekDeadlines.length === 0) return null;

  const getUrgencyLevel = () => {
    const totalHours = timeRemaining.days * 24 + timeRemaining.hours;
    if (totalHours <= 24) return "critical";
    if (totalHours <= 48) return "warning";
    return "normal";
  };

  const urgencyLevel = getUrgencyLevel();

  const urgencyStyles = {
    critical: {
      box: "critical-box",
      icon: "critical-icon",
      text: "critical-text",
      pulse: "pulse",
    },
    warning: {
      box: "warning-box",
      icon: "warning-icon",
      text: "warning-text",
      pulse: "",
    },
    normal: {
      box: "normal-box",
      icon: "normal-icon",
      text: "normal-text",
      pulse: "",
    },
  };

  const styles = urgencyStyles[urgencyLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`deadline-container ${styles.box} ${styles.pulse}`}
    >
      <div className="deadline-header">
        <div className="deadline-title">
          {urgencyLevel === "critical" ? (
            <AlertTriangle className={`icon ${styles.icon}`} />
          ) : (
            <Clock className={`icon ${styles.icon}`} />
          )}
          <h3 className={`deadline-heading ${styles.text}`}>
            Weekly Report Deadline
          </h3>
        </div>
        <Calendar className={`icon-small ${styles.icon}`} />
      </div>

      {nextFriday && (
        <div className="deadline-due">
          <p className={`deadline-date ${styles.text}`}>
            Due:{" "}
            {nextFriday.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            at 11:59 PM
          </p>
        </div>
      )}

      <div className="countdown-grid">
        {["days", "hours", "minutes", "seconds"].map((unit) => (
          <div key={unit} className="countdown-item">
            <div className={`countdown-value ${styles.text}`}>
              {timeRemaining[unit].toString().padStart(2, "0")}
            </div>
            <div className={`countdown-label ${styles.text}`}>
              {unit.charAt(0).toUpperCase() + unit.slice(1)}
            </div>
          </div>
        ))}
      </div>

      <div className="deadline-modules">
        <p className={`module-label ${styles.text}`}>
          ⏳ Pending modules due this week:
        </p>
        <ul className={`module-list ${styles.text}`}>
          {thisWeekDeadlines.map((mod) => (
            <li key={mod.moduleCode} className="module-item">
              • {mod.moduleName}: {mod.moduleCode}
            </li>
          ))}
        </ul>
      </div>

      {urgencyLevel === "critical" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="message critical-message"
        >
          <p>⚠️ Urgent: Less than 24 hours remaining!</p>
        </motion.div>
      )}
      {urgencyLevel === "warning" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="message warning-message"
        >
          <p>⏰ Reminder: Less than 48 hours remaining</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default DeadlineCountdown;
