import React from "react";
import { Link } from "react-router-dom";
import { Eye, Calendar, NotepadText } from "lucide-react";
import "./dashboardCard.css";
import { format } from "date-fns";

const RecentReports = ({ recentReports }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case true:
        return "Reviewed";
      default:
        return "Pending";
    }
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case true:
        return "dashboard-status-span-reviewed";
      default:
        return "dashboard-status-span-pending";
    }
  };
  return (
    <div className="recent-reports-container">
      {recentReports.length > 0 ? (
        recentReports.map((report) => (
          <div key={report.reportID} className="dashboard-report-card">
            <div className="dashboard-report-header">
              <div>
                <div className="report-title-row">
                  <h3 className="report-title">
                    {report.moduleName} - {report.moduleCode}
                  </h3>
                  <span className={getStatusStyle(report.isViewed)}>
                    {getStatusClass(report.isViewed)}
                  </span>
                </div>
                <div className="report-date">
                  <Calendar className="icon-small" />
                  <span>
                    {report.start_Date} to {report.end_Date}
                  </span>
                </div>
              </div>
              <div className="dashboard-report-actions">
                <Link
                  to={`/view-lecture-report/${report.reportID}`}
                  className="report-btn-icon"
                  title="View Report"
                >
                  <Eye className="edit-icon" />
                </Link>
              </div>
            </div>
            <div className="report-summary">{report.weeklyActivity}</div>
            {report.hasFeeback && (
              <div className="report-feedback">
                <p className="feedback-title">Feedback:</p>
                <p className="feedback-comment">{report.feedback}</p>
                <div className="feedback-rating-row">
                  <span className="feedback-meta">
                    By {report.reviewedBy} •{" "}
                    {format(new Date(report.reviewDate), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="card no-data">
          <NotepadText />
          <p>No Reports found.</p>
        </div>
      )}
    </div>
  );
};

export default RecentReports;
