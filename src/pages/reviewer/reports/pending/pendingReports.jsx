import { useState, useEffect } from "react";
import axios from "axios";
import { Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import "./pendingReports.css";
import ReportCard from "../../../../components/reviewer/reportCards/reportCard";
import { motion } from "framer-motion";

const PendingReports = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [reports, setreports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("7d");

  const getPendingReports = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/ReviewerReports/GetPendingReports`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response?.data?.status) {
        setreports(response.data.pendingReports);
        console.log("Latest reports fetched successfully");
        console.log("Message" + response.data.message);
        console.log(response.data.pendingReports);
      } else {
        setreports([]);
        console.log("Failed to fetch Latest reports" + response?.data);
      }
    } catch (error) {
      setreports([]);
      console.log("An error occurred");
    }
  };
  useEffect(() => {
    getPendingReports();
  }, [getPendingReports]);

  const moduleCodes = Array.from(
    new Set(reports.map((r) => r.moduleCode).filter(Boolean))
  );

  // Filter by module code and search term (searches both code and name)

  return (
    <main className="pending-report-main">
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
            <h2 className="admin-header-text">Pending Reports</h2>
          </div>
        </div>
      </motion.div>

      <div className="card search-filter">
        <div className="reviewer-reports-list-container">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="reviewer-search-container"
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
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="">All Modules</option>
              {moduleCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
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

          <div className="reviewer-report-list">
            <div className="report-wrapper">
              {reports.map((report) => {
                return <ReportCard key={report.id} report={report} />;
              })}
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

export default PendingReports;
