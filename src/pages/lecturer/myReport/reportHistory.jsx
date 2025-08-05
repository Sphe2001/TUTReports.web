import { useEffect, useState } from "react";
import { Search, ArrowLeft } from "lucide-react";
import "./reportHistory.css";
import axios from "axios";
import ReportHistoryCard from "../../../components/lecturer/reportCards/reportHistoryCard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ReportHistory = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [reports, setReports] = useState([]);
  const [timeRange, setTimeRange] = useState("7d");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/LecturerReports/GetMyReportHistory`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response?.data?.status) {
        setReports(response.data.reports);
        console.log("Reports successfully found");
      } else {
        setReports([]);
        console.log("Reports not found");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);
  const filteredReports = reports

    .filter((report) => {
      const search = searchTerm.toLowerCase();
      return (
        (report?.moduleCode || "").toLowerCase().includes(search) ||
        (report?.module || "").toLowerCase().includes(search)
      );
    })
    .filter((report) => {
      if (statusFilter === "pending") {
        return report.status === false || report.status === "false";
      }
      if (statusFilter === "reviewed") {
        return (
          report.status === true &&
          (!report.feedback || report.feedback.trim() === "")
        );
      }
      if (statusFilter === "reviewedWithFeedback") {
        return report.status === true && report.feedback?.trim() !== "";
      }
      return true;
    });

  return (
    <main className="report-history-main">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="page-header-left">
          <Link
            onClick={() => window.history.back()}
            className="back-icon-button"
          >
            <ArrowLeft />
          </Link>
          <div className="admin-dashboard-header">
            <h2 className="admin-header-text">Reports History</h2>
          </div>
        </div>
      </motion.div>

      <div className="card search-filter">
        <div className="lecturer-history-reports-list-container">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lecturers-search-container"
          >
            <div className="admin-search-box">
              <div className="admin-search-icon">
                <Search className="icon" />
              </div>
              <input
                type="search"
                placeholder="Search Report..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="admin-dropdown"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Reports</option>
              <option value="pending">Pending Review</option>
              <option value="reviewed">Reviewed</option>
              <option value="reviewedWithFeedback">
                Reviewed With Feedback
              </option>
            </select>
            <select
              className="admin-dropdown"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7d">All Time</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            <button className="admin-filter-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 4h18M6 8h12M10 12h4M12 16h0" />
              </svg>
              Filter
            </button>
          </motion.div>

          <div className="report-history-list">
            <div className="report-history-wrapper">
              {filteredReports.map((report) => (
                <ReportHistoryCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        </div>

        {reports.length === 0 && (
          <div className="card no-data">
            <p>No Reports found.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ReportHistory;
