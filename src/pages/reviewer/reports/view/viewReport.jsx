import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Users,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import "./giveFeedbackForLecturer.css";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const ViewReportPage = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const { reportId } = useParams();
  const [report, setReport] = useState({});
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

  const handleExport = (reportId) => {
    axios
      .get(
        `${API_ENDPOINT}/api/ReviewerReports/ExportReportPdf?reportId=${reportId}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `report_${reportId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Report exported successfully");
      })
      .catch(() => {
        toast.error("Failed to export report");
      });
  };
  const handleDownloadRegister = async (reportId) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/ReviewerReports/DownloadAttendanceRegister?reportId=${reportId}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      let filename = "register";
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.indexOf("filename=") !== -1) {
        filename = disposition
          .split("filename=")[1]
          .replace(/['"]/g, "")
          .trim();
      } else if (report.registerFileName) {
        filename = report.registerFileName;
      }

      const mimeType =
        response.data.type || response.headers["content-type"] || "";
      const blob = new Blob([response.data], { type: mimeType });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Register downloaded successfully");
    } catch {
      toast.error("No Register Attached");
    }
  };

  const fetchReport = async (reportId) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/ReviewerReports/ViewReport?reportId=${reportId}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response?.data?.status) {
        setReport(response.data.report);
        console.log(response.data.report);
        console.log("the report " + report);
      }
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (reportId) fetchReport(reportId);
  }, [reportId, fetchReport]);
  const openfeedbackModal = async (message, reportId) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/ReviewerReports/ReviewReport`,
        { reportId: reportId, feedback: message },

        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (response?.data?.status) {
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          customClass: { popup: "my-swal-theme" },
        });
        fetchReport(reportId);
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          customClass: { popup: "my-swal-theme" },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: "An error occurred",
        icon: "error",
        customClass: { popup: "my-swal-theme" },
      });
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!report) return <p>Report not found.</p>;
  return (
    <main className="view-report-main">
      <header className="view-report-report-header ">
        <div className="view-report-header-content">
          <h1>{report.module}</h1>

          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <p
              className="view-report-status-box"
              style={getStatusStyle(report.isViewed, report.feedback)}
            >
              {getStatusLabel(report.isViewed, report.feedback)}
            </p>
            <Download
              size={20}
              style={{ cursor: "pointer", color: "#238070" }}
              title="Export Report"
              onClick={() => handleExport(report.reportId)}
            />
          </div>
        </div>
        <p style={{ marginTop: "-1px", color: "#333", fontWeight: "500" }}>
          Module code: {report.moduleCode}
        </p>
        <p className="view-report-description">{report.description}</p>
      </header>

      <div className="view-report-report-grid">
        <div className="view-report-info-card">
          <div className="view-report-card-header">
            <Calendar size={20} />
            <h2>Date Information</h2>
          </div>
          <div className="view-report-card-content">
            <p>Start Date: {report.startDate}</p>
            <p>End Date: {report.endDate}</p>
            <p>Submitted: {report.submissionDate}</p>
          </div>
        </div>

        <div className="view-report-info-card">
          <div className="view-report-card-header">
            <Users size={20} />
            <h2>Group Information</h2>
          </div>
          <div className="view-report-card-content">
            <p>Groups: {report.groupNames}</p>
          </div>
        </div>

        <div className="view-report-info-card full-width">
          <div className="view-report-card-header">
            <MessageCircle size={20} />
            <h2>Channel Activities</h2>
          </div>
          <div className="view-report-card-content">
            {report.channelActivities.map((activity, index) => (
              <div key={index} className="view-report-activity-item">
                <h3>{activity.channelName}:</h3>
                <p>{activity.activity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="view-report-info-card full-width">
          <div className="view-report-card-header">
            <Calendar size={20} />
            <h2>Sessions</h2>
          </div>
          <div className="view-report-card-content">
            <div className="view-report-sessions-grid">
              {report.sessions?.map((session, index) => (
                <div
                  key={session.sessionId}
                  className="view-report-session-card"
                >
                  <div className="view-report-session-header">
                    <h3>Session {session.sessionNumber}</h3>
                    <p className="view-report-date">{session.sessionDate}</p>
                  </div>
                  <div className="view-report-session-info">
                    <Users size={16} />
                    <span>{session.numberOfStudents} students</span>
                  </div>
                  <div className="view-report-session-info">
                    <strong>Group:</strong> {session.groupName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="view-report-info-card">
          <div className="view-report-card-header">
            <AlertCircle size={20} />
            <h2>Challenges</h2>
          </div>
          <div className="view-report-card-content">
            <p>{report.challenges}</p>
          </div>
        </div>

        <div className="view-report-info-card">
          <div className="view-report-card-header">
            <CheckCircle size={20} />
            <h2>Suggestions</h2>
          </div>
          <div className="view-report-card-content">
            <p>{report.suggestions}</p>
          </div>
        </div>

        <div className="view-report-info-card full-width">
          <div className="view-report-card-header">
            <Calendar size={20} />
            <h2>Weekly Activity</h2>
          </div>
          <div className="view-report-card-content">
            <p>{report.weeklyActivity}</p>
          </div>
        </div>

        <div className="view-report-info-card">
          <div className="view-report-card-header">
            <MessageCircle size={20} />
            <h2>Feedback</h2>
          </div>
          <div className="view-report-card-content">
            <p>{report.feedback || "No feedback provided yet."}</p>
          </div>
        </div>

        <div className="view-report-info-card">
          <div className="view-report-card-header">
            <Users size={20} />
            <h2>Reviewed By</h2>
          </div>
          <div className="view-report-card-content">
            <p>{report.reviewedBy || "Not reviewed yet."}</p>
          </div>
        </div>
        <div className="view-report-feedback-review-card">
          <div className="view-report-card-header">
            <MessageCircle size={20} />
            <h2>Lecturer Feedback</h2>
          </div>
          <div className="view-report-card-content">
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

        <div className="view-report-feedback-button-container">
          <button
            onClick={() => {
              Swal.fire({
                title: "Write FeedBack",
                input: "textarea",
                inputLabel: "Message",
                showCancelButton: true,
                confirmButtonText: `Send`,
                confirmButtonColor: "#16a34a",
                cancelButtonText: "Cancel",
                customClass: { popup: "my-swal-theme" },
              }).then(async (result) => {
                if (result.isConfirmed && result.value?.trim()) {
                  await openfeedbackModal(result.value, report.reportId);
                }
              });
            }}
            className="view-report-feedback-button"
          >
            Write Feedback
          </button>

          <button
            className="download-register-btn"
            onClick={() => handleDownloadRegister(report.reportId)}
          >
            Download Register
          </button>
        </div>
      </div>
    </main>
  );
};

export default ViewReportPage;
