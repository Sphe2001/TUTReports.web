import { Link } from "react-router-dom";
import { Calendar, Edit, Download, Eye } from "lucide-react";
import { format } from "date-fns";
import "./reportHistoryCard.css";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";

const ReportHistoryCard = ({ report }) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const handleDownload = async (reportId) => {
    try {
      const res = await axios.get(
        `${API_ENDPOINT}/api/LecturerReports/ExportReportPdf?reportId=${reportId}`,
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
  };
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
        return "status-span-reviewed";
      default:
        return "status-span-pending";
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      key={report.reportId}
      className="report-history-card"
    >
      <div className="report-header">
        <div>
          <div className="report-title-row">
            <h3 className="report-title">
              {report.moduleName} - {report.moduleCode}
            </h3>
            <span className={getStatusStyle(report.status)}>
              {getStatusClass(report.status)}
            </span>
          </div>
          <div className="report-date">
            <Calendar className="icon-small" />
            <span>
              {report.startDate} to {report.endDate}
            </span>
          </div>
          <p className="report-summary">{report.weeklyActivity}</p>
        </div>

        <div className="report-actions">
          <Link
            to={`/view-lecture-report/${report.reportId}`}
            className="report-btn-icon"
            title="View Report"
          >
            <Eye className="icon-medium" />
          </Link>
          {!report.status && (
            <Link
              to={`/edit-report/${report.reportId}`}
              className="report-btn-icon"
              title="Edit Report"
            >
              <Edit className="icon-medium" />
            </Link>
          )}

          <button
            className="report-btn-icon"
            title="Download Report"
            onClick={() => {
              handleDownload(report.reportId);
            }}
          >
            <Download className="icon-medium" />
          </button>
        </div>
      </div>

      {report.hasFeedback && (
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

      <div className="report-footer">
        <div className="footer-info">
          <span className="separator">•</span>
          <span>
            Created on {format(new Date(report.submissionDate), "MMM d, yyyy")}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportHistoryCard;
