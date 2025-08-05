import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import "./hodDashPage.css";
import { format } from "date-fns";
import {
  Clock,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  ThumbsDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HodDashPage = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [userFullName, setUserFullName] = useState("");
  const [totalReportsCount, setTotalReportsCount] = useState(0);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [reviewedReportsCount, setReviewedReportsCount] = useState(0);
  const [missedReportsCount, setMissedReportsCount] = useState(0);
  const [reports, setreports] = useState([]);

  const navigate = useNavigate();

  const getUserDetails = async () => {
    try {
      const userRes = await axios.get(
        `${API_ENDPOINT}/api/UserGetters/GetUserDetails`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      const userData = userRes.data;
      if (userData) {
        const { name, surname } = userRes.data;
        if (name && surname) setUserFullName(`${name} ${surname}`);
        else if (name) setUserFullName(name);
        else setUserFullName("");
      }
    } catch (error) {
      console.error("Error fetching userDetails:", error);
      setUserFullName("");
    }
  };

  const getStats = async () => {
    try {
      const totalReports = await axios.get(
        `${API_ENDPOINT}/api/stats/reviewer/GetTotalReportsCount`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setTotalReportsCount(totalReports?.data?.count);

      const pendingReports = await axios.get(
        `${API_ENDPOINT}/api/stats/reviewer/GetUnreviewedReportsCount`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setPendingReportsCount(pendingReports?.data?.count);

      const reviewedReports = await axios.get(
        `${API_ENDPOINT}/api/stats/reviewer/GetReviewedReportsCount`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setReviewedReportsCount(reviewedReports?.data?.count);

      const missedReports = await axios.get(
        `${API_ENDPOINT}/api/stats/reviewer/GetMissedReportsCount`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setMissedReportsCount(missedReports?.data?.count);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const getRecentReports = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/ReviewerReports/GetRecentReports`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response?.data?.status) {
        setreports(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };
  useEffect(() => {
    getUserDetails();
    getStats();
    getRecentReports();
  }, [getUserDetails, getStats, getRecentReports]);

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

  const statsCards = [
    {
      icon: <FileText size={25} />,
      name: "Total Reports",
      value: totalReportsCount,
      className: "blue",
    },
    {
      icon: <Clock size={25} />,
      name: "Pending Review",
      value: pendingReportsCount,
      className: "yellow",
    },
    {
      icon: <CheckCircle2 size={25} />,
      name: "Reviewed",
      value: reviewedReportsCount,
      className: "green",
    },
    {
      icon: <ThumbsDown size={25} />,
      name: "Missed Reports",
      value: missedReportsCount,
      className: "red",
    },
  ];

  return (
    <div className="hod-dashboard">
      <Toaster />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="welcome-section-wrapper"
      >
        <div className="welcome-section">
          <div className="welcome-text">
            <h1>Welcome back{userFullName ? `, ${userFullName}` : ""}</h1>
            <p>{format(new Date(), "EEEE, MMMM do yyyy")}</p>
          </div>
        </div>
        <button
          className="view-all-btn-absolute"
          onClick={() => navigate("/View-Reports")}
        >
          <FileText size={16} />
          <span>View All Reports</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lecture-dashboard-vertical-items"
      >
        {statsCards.map((card, index) => (
          <div key={index} className="lecturer-stats-card">
            <div className="card-content-1">
              <div className={`stat-icon ${card.className}`}>{card.icon}</div>
              <div className="card-users-info-container">
                <p className="stat-name">{card.name}</p>
                <p className="stat-value">{card.value}</p>
              </div>
            </div>
            <div className="card-content-2">
              <div className="span-container">
                <span></span>
                <span></span>
              </div>
              <div className="span-container">
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="content-grid">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pending-reviews"
        >
          <div className="section-header">
            <h2>Reports</h2>
            <div className="section-actions">
              <Search size={16} />
              <Filter size={16} />
            </div>
          </div>

          <div className="dashboard-report-list">
            {Array.isArray(reports) && reports.length > 0 ? (
              reports.map((report, index) => {
                return (
                  <div className="review-card" key={index}>
                    <div className="review-content">
                      <div className="review-info">
                        <h3>{report.description}</h3>
                        <p className="review-author">
                          By {report.lecturerName || "Unknown"}
                        </p>
                        <p className="review-description">
                          {report.weeklyActivity}
                        </p>
                        <p className="review-meta">
                          Submitted on {report.submissionDate}
                        </p>
                        <Link
                          to={`/view-report/${report.reportId}`}
                          className="review-btn"
                        >
                          Review Report
                        </Link>
                      </div>
                      <span className={getStatusStyle(report.status)}>
                        {getStatusClass(report.status)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-reports">No Reports available.</div>
            )}
          </div>

          <div className="view-all-link">
            <a href="/pending-reports">View all pending reports</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HodDashPage;
