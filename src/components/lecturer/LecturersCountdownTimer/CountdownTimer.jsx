import { useEffect, useState } from "react";
import { format } from "date-fns";
import { AlarmClock } from "lucide-react";
import "./CountdownTimer.css";

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 23, 59, 59);
}

function getColorAndMessage(deadline, isSubmitted) {
  const now = new Date();
  const due = parseDate(deadline);
  const currentDay = now.getDay();
  const timeLeft = due - now;

  if (isSubmitted) {
    return { color: "green", message: "Report submitted." };
  }

  if (timeLeft <= 0) {
    return { color: "black", message: "You missed the deadline." };
  }

  if (currentDay >= 0 && currentDay <= 3) {
    return { color: "blue", message: "You have enough time to submit." };
  } else if (currentDay === 4) {
    return { color: "orange", message: "Deadline approaching soon." };
  } else if (currentDay === 5) {
    return { color: "red", message: "Submit before the day ends." };
  } else {
    return { color: "black", message: "You missed the deadline." };
  }
}

export default function CountdownTimer({
  deadline,
  isSubmitted,
  moduleName,
  moduleCode,
}) {
  const [info, setInfo] = useState(() =>
    getColorAndMessage(deadline, isSubmitted)
  );

  useEffect(() => {
    const newInfo = getColorAndMessage(deadline, isSubmitted);
    setInfo(newInfo);
  }, [deadline, isSubmitted]);

  return (
    <div className={`timer-box ${info.color}`}>
      <div className={`lecturer-dashboard-alarm-icon ${info.color}`}>
        <AlarmClock />
      </div>
      <div>
        <div className="lecture-countdown-module">
          <strong>{moduleName}</strong>
        </div>
        <p className={`lecturer-countdown-date ${info.color}`}>
          Due in {format(parseDate(deadline), "dd MMMM yyyy")}
        </p>
        <div className={`deadline-message ${info.color}`}>
          {info.color === "green" && <span>{info.message}</span>}
          {info.color === "black" && <span>{info.message}</span>}
        </div>
      </div>
    </div>
  );
}
