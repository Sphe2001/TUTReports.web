import React from "react";
import "./reportPreview.css";

import {
  ChevronLeft,
  FileText,
  Calendar,
  Users,
  MessageSquare,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const WeeklyReportPreview = ({ report, onClose, onSubmit }) => {
  return (
    <div className="modal-overlay">
      <div className="preview-modal">
        <div className="preview-header">
          <FileText className="preview-icon" />
          <h1>Weekly Report Preview</h1>
        </div>

        <div className="preview-section">
          <h2>
            <BookOpen size={20} /> Module
          </h2>
          <p>{report.moduleCode}</p>
        </div>

        <div className="preview-section">
          <h2>
            <Calendar size={20} /> Dates
          </h2>
          <p>
            From: {report.startDate} — To: {report.endDate}
          </p>
        </div>

        <div className="preview-section">
          <h2>
            <CheckCircle size={20} /> Summary of the Week
          </h2>
          <p>{report.weeklyActivity}</p>
        </div>

        <div className="preview-section">
          <h2>
            <AlertCircle size={20} /> Challenges
          </h2>
          <p>{report.challenges}</p>
        </div>

        <div className="preview-section">
          <h2>
            <MessageSquare size={20} /> Suggestions
          </h2>
          <p>{report.suggestions}</p>
        </div>

        <div className="preview-section">
          <h2>
            <MessageSquare size={20} /> Communication Channels
          </h2>
          <ul>
            {Object.entries(report.channelActivities || {}).map(
              ([channelName, activity], index) => (
                <li key={index}>
                  <strong>{channelName}:</strong> {activity}
                </li>
              )
            )}
          </ul>
        </div>
        <div className="preview-section">
          <h2>
            <Users size={20} /> Session Details
          </h2>
          <ul>
            {report.sessions.map((s, i) => (
              <li key={i}>
                Session {s.sessionNumber} | {s.moduleCode}: Group -{" "}
                {s.groupName} | Students: {s.numberOfStudents} | Date:{" "}
                {s.sessionDate}
              </li>
            ))}
          </ul>
        </div>

        <div className="modal-buttons">
          <button onClick={onClose} className="btn-secondary">
            <ChevronLeft size={16} /> Back
          </button>
          <button onClick={onSubmit} className="btn-primary">
            <CheckCircle size={16} /> Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};
export default WeeklyReportPreview;
