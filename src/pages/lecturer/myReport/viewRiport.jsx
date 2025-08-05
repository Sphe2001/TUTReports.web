import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Edit3,
  Download,
  Calendar,
  Users,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import "./viewReport.css";

const ViewReport = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStatusStyle = (status, feedback) => {
    if (status === false || status === "false") {
      return {
        color: "#684e09",
        backgroundColor: " #ebca8e",
        fontWeight: "bold",
      };
    }

    const hasFeedback = feedback && feedback.trim() !== "";
    return {
      color: hasFeedback ? "#238070" : "#238070",
      backgroundColor: " #b7e7db",
      fontWeight: "bold",
    };
  };
  const getStatusLabel = (status, feedback) => {
    if (status === false || status === "false") return "Pending";

    const hasFeedback = feedback && feedback.trim() !== "";
    return hasFeedback ? "Reviewed with Feedback" : "Reviewed";
  };

  useEffect(() => {
    const fetchReportAndGroups = async () => {
      try {
        const res = await axios.get(
          `${API_ENDPOINT}/api/LecturerReports/ViewReport?reportId=${reportId}`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (res.data.status) {
          const fetchedReport = res.data;
          setReport(fetchedReport);
        }
      } catch (err) {
        console.error("Failed to load report/groups", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportAndGroups();
  }, [reportId, API_ENDPOINT]);

  if (loading) return <p>Loading...</p>;
  if (!report) return <p>Report not found.</p>;

  return (
    <main className="view-report-main">
      <header className="view-report-report-header">
        <div className="view-report-header-content">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              title="Go back"
            >
              <ArrowLeft size={25} />
            </button>
            <h1>{report.module}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <p
              className="view-report-status-box"
              style={getStatusStyle(report.isViewed, report.feedback)}
            >
              {getStatusLabel(report.isViewed, report.feedback)}
            </p>

            {getStatusLabel(report.isViewed, report.feedback) === "Pending" && (
              <>
                <button
                  title="Download Report"
                  onClick={async () => {
                    try {
                      const res = await axios.get(
                        `${API_ENDPOINT}/api/LecturerReports/ExportReportPdf?reportId=${report.reportId}`,
                        {
                          responseType: "blob",
                          withCredentials: true,
                        }
                      );
                      const blob = new Blob([res.data], {
                        type: "application/pdf",
                      });
                      const link = document.createElement("a");
                      link.href = window.URL.createObjectURL(blob);
                      link.download = `Report_${report.reportId}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                      toast.success("PDF exported successfully!");
                    } catch (err) {
                      console.error("Export failed:", err);
                      toast.error("Failed to export report.");
                    }
                  }}
                  style={{
                    background: "#f0f0f0",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Download size={20} color="#000" />
                </button>
                <Link
                  to={`/edit-report/${reportId}`}
                  style={{ color: "#0000FF" }}
                  title="Edit this report"
                >
                  <Edit3 size={18} />
                </Link>
              </>
            )}
          </div>
        </div>
        <p style={{ marginTop: "8px", color: "gray", fontWeight: "500" }}>
          Module code: {report.moduleCode}
        </p>
        <p className="view-lecturer-report-description">{report.description}</p>
      </header>

      <div className="view-report-report-grid">
        <div className="view-lecturer-report-info-card">
          <div className="view-lecturer-report-card-header">
            <Calendar size={20} />
            <h2>Date Information</h2>
          </div>
          <div className="view-lecturer-report-card-content">
            <p>Start Date: {report.startDate}</p>
            <p>End Date: {report.endDate}</p>
            <p>Submitted: {report.submissionDate}</p>
          </div>
        </div>

        <div className="view-lecturer-report-info-card">
          <div className="view-lecturer-report-card-header">
            <Users size={20} />
            <h2>Group Information</h2>
          </div>
          <div className="view-lecturer-report-card-content">
            <p>Groups: {report.groupNames}</p>
          </div>
        </div>

        <div className="view-lecturer-report-info-card full-width">
          <div className="view-lecturer-report-card-header">
            <MessageCircle size={20} />
            <h2>Channel Activities</h2>
          </div>
          <div className="view-lecturer-report-card-content">
            {report.channelActivities.map((activity, index) => (
              <div key={index} className="view-report-activity-item">
                <h3>{activity.channelName}:</h3>
                <p>{activity.activity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="view-lecturer-report-info-card full-width">
          <div className="view-lecturer-report-card-header">
            <Calendar size={20} />
            <h2>Sessions</h2>
          </div>
          <div className="view-lecturer-report-sessions-grid">
            {report.sessions.map((session) => {
              return (
                <div
                  key={session.sessionId}
                  className="view-lecturer-report-session-card"
                >
                  <div className="view-lecturer-report-session-header">
                    <h4>Session {session.sessionNumber}</h4>
                    <p className="view-lecturer-report-date">
                      {session.sessionDate}
                    </p>
                  </div>
                  <div className="view-lecturer-report-session-info">
                    <Users size={16} />
                    <span>{session.numberOfStudents} students</span>
                  </div>
                  <div className="view-lecturer-report-session-info">
                    <strong>Group:</strong>{" "}
                    {session.groupName || `Group ${session.groupId}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="view-lecturer-report-info-card">
          <div className="view-lecturer-report-card-header">
            <AlertCircle size={20} />
            <h2>Challenges</h2>
          </div>
          <div className="view-lecturer-report-card-content">
            <p>{report.challenges}</p>
          </div>
        </div>

        <div className="view-lecturer-report-info-card">
          <div className="view-lecturer-report-card-header">
            <CheckCircle size={20} />
            <h2>Suggestions</h2>
          </div>
          <div className="view-lecturer-report-card-content">
            <p>{report.suggestions}</p>
          </div>
        </div>

        <div className="view-lecturer-report-info-card full-width">
          <div className="view-lecturer-report-card-header">
            <Calendar size={20} />
            <h2>Weekly Activity</h2>
          </div>
          <div className="view-lecturer-report-card-content">
            <p>{report.weeklyActivity}</p>
          </div>
        </div>

        <div className="view-lecturer-report-info-card">
          <div className="view-lecturer-report-card-header">
            <MessageCircle size={20} />
            <h2>Feedback</h2>
          </div>
          <div className="view-lecturer-report-card-content">
            <p>{report.feedback || "No feedback provided yet."}</p>
          </div>
        </div>

        <div className="view-lecturer-report-info-card">
          <div className="view-lecturer-report-card-header">
            <Users size={20} />
            <h2>Reviewed By</h2>
          </div>
          <div className="view-lecturer-report-card-content">
            <p>{report.reviewedBy || "Not reviewed yet."}</p>
          </div>
        </div>
        <div className="view-lecturer-report-feedback-review-card">
          <div className="view-lecturer-report-card-header">
            <MessageCircle size={20} />
            <h2>Lecturer Feedback</h2>
          </div>
          <div className="view-lecturer-report-card-content">
            <p>
              <strong>Reviewed By:</strong>{" "}
              {report.reviewedBy || "Not yet reviewed"}
            </p>
            <p>
              <strong>Feedback:</strong>{" "}
              {report.feedback || "No feedback provided."}
            </p>
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  );
};

export default ViewReport;
