import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import ReportCard from "../../../../components/reviewer/reportCards/reportCard";
import { motion } from "framer-motion";

import "./reviewedReports.css";

const ReviewedReports = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("7d");
  const [moduleFilter, setModuleFilter] = useState("");

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/api/ReviewerReports/GetReviewedReports`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response?.data?.status) {
          setReports(response.data.data);
          console.log(
            "Reviewed reports fetched successfully" + response.data.data
          );
        } else {
          setReports([]);
          console.log("Failed to fetch Reviewed reports");
        }
      })
      .catch((error) => {
        console.error("Error fetching reports:" || error);
        setReports([]);
        console.log("error fetching reports");
      });
  }, [API_ENDPOINT]);

  // Get unique module codes for dropdown
  const moduleCodes = Array.from(
    new Set(reports.map((r) => r.moduleCode).filter(Boolean))
  );

  return (
    <main className="reviewedreport-main">
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
            <h2 className="admin-header-text">Reviewed Reports</h2>
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
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
            >
              <option value="all">All Reports</option>

              <option value="reviewer">Reviewed With Feedback</option>
            </select>
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

export default ReviewedReports;
