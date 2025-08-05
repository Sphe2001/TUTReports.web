import { useEffect, useState } from "react";
import axios from "axios";
import { Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import "./viewReport.css";
import ReportCard from "../../../../components/reviewer/reportCards/reportCard";
import { motion } from "framer-motion";

const ViewReport = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/api/ReviewerReports/GetAllDepartmentReports`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response?.data?.status) {
          setReports(response.data.reports);
        } else {
          setReports([]);
          console.log("Failed to fetch reports");
        }
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        setReports([]);
      });
  }, [API_ENDPOINT]);

  const moduleCodes = Array.from(
    new Set(reports.map((r) => r.moduleCode).filter(Boolean))
  );

  const filteredReports = reports
    .filter((report) =>
      moduleFilter !== "all" ? report.moduleCode === moduleFilter : true
    )
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
      return true; // "all"
    });

  return (
    <main className="viewreport-main">
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
            <h2 className="admin-header-text">All Department Reports</h2>
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
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
            >
              <option value="all">All Modules</option>
              {moduleCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </motion.div>

          <div className="reviewer-report-list">
            <div className="report-wrapper">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <ReportCard key={report.reportId} report={report} />
                ))
              ) : (
                <div className="card no-data">
                  <p>No Reports found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ViewReport;
