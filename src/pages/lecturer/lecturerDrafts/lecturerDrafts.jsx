import { useEffect, useState } from "react";
import axios from "axios";
import "./lecturerDrafts.css";

import { ArrowLeft, Search } from "lucide-react";
import ReportDraftCard from "../../../components/lecturer/reportCards/reportDraftCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LecturerDraftsPage = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [drafts, setDrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("all");

  const fetchDraftsAndDetails = async () => {
    try {
      const draftsResponse = await axios.get(
        `${API_ENDPOINT}/api/LecturerReports/GetMyDraftsList`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
          validateStatus: () => true,
        }
      );

      if (draftsResponse?.data?.status) {
        setDrafts(draftsResponse.data.drafts);
      } else {
        console.log(draftsResponse.data.message);
        setDrafts([]);
      }
    } catch (error) {
      console.log("An error occurred " + error);
      setDrafts([]);
    }
  };

  useEffect(() => {
    fetchDraftsAndDetails();
  }, [fetchDraftsAndDetails]);
  return (
    <div className="lecturer-drafts-page">
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
            <h2 className="admin-header-text">Report Drafts</h2>
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
              {drafts.map((draft) => (
                <ReportDraftCard
                  key={draft.draftId}
                  draft={draft}
                  refreshDrafts={fetchDraftsAndDetails}
                />
              ))}
            </div>
          </div>
        </div>

        {drafts.length === 0 && (
          <div className="card no-data">
            <p>No Drafts found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerDraftsPage;
