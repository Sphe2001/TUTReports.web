import { useEffect, useState, useCallback } from "react";

import axios from "axios";

import { format } from "date-fns";

import "react-clock/dist/Clock.css";

import "./dashboard.css";

import { BadgeCheck, NotebookText, Clock1 } from "lucide-react";
import CountdownTimer from "../../../components/lecturer/LecturersCountdownTimer/CountdownTimer";
import RecentReports from "../../../components/lecturer/dashboardCard/dashboardCard";
import DeadlineCountdown from "../../../components/lecturer/countDown/deadlineCounter";

const LecturerDashboardPage = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [name, setName] = useState("");
  const [reports, setreports] = useState([]);
  const [totalReports, setTotalReports] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [reviewRepors, setReviewRepors] = useState(0);
  const [deadlines, setDeadlines] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState([]);

  const getDeadlines = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/Deadlines/GetDeadlines`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response?.data?.status) {
        setDeadlines(response.data.deadlines);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch deadlines:", error);
    }
  }, [API_ENDPOINT]);
  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/api/UserGetters/GetUserDetails`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setName(response.data.name);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });

    axios
      .get(`${API_ENDPOINT}/api/LecturerReports/GetMyLatestReports`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status) {
          setreports(response.data.recentReports);
          console.log("Latest reports fetched successfully");
        } else {
          setreports([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching reports:" || error);
      });
    axios
      .get(`${API_ENDPOINT}/api/stats/lecturer/GetReportCount`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.data.status) {
          setTotalReports(response.data.count);
          console.log("Success" + response.data.message);
        } else {
          console.log("error occured" + response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching total number of report");
      });
    axios
      .get(
        `${API_ENDPOINT}/api/stats/lecturer/GetLecturerUnreviewedReportCount`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        if (response.data.status) {
          setPendingReports(response.data.count);
          console.log("Success" + response.data.message);
        } else {
          console.log("error occured" + response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching total number of report");
      });
    axios
      .get(
        `${API_ENDPOINT}/api/stats/lecturer/GetLecturerReviewedReportCount`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        if (response.data.status) {
          setReviewRepors(response.data.count);
          console.log("Success" + response.data.message);
        } else {
          console.log("error occured" + response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching total number of report");
      });

    axios
      .get(`${API_ENDPOINT}/api/Deadlines/GetDeadlines`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        if (res.data.status) {
          setDeadlines(res.data.deadlines);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch deadlines:", err);
      });
    axios
      .get(
        `${API_ENDPOINT}/api/LecturerReports/GetSubmissionStatus/GetSubmissionStatus`,
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.status) {
          setSubmissionStatus(res.data.submissions);
        }
      })
      .catch((err) => {
        console.error("API call failed:", err);
      });

    getDeadlines();
  }, [getDeadlines, API_ENDPOINT]);
  const mergedDeadlines = deadlines.map((dl) => {
    const submission = submissionStatus.find(
      (s) => s.moduleCode === dl.moduleCode
    );
    return {
      ...dl,
      isSubmitted: submission ? submission.isSubmitted : false,
    };
  });

  return (
    <div className="lecture-dashboard-main-contents">
      <div className="lecture-dashboard-main-header">
        <h2 className="lecture-dashboard-welcome">Welcome back, {name}</h2>
        <p className="lecturer-date">
          {" "}
          {format(new Date(), "EEEE, MMMM do, yyyy")} | System Overview
        </p>
      </div>
      <DeadlineCountdown deadlines={deadlines} />

      <div className="lecture-dashboard-main-body">
        <div className="lecture-dashboard-vertical-items">
          <div className="lecturer-stats-card">
            <div className="card-content-1">
              <div className="card-icon-container-notebooktext">
                <NotebookText className="notebooktext-icon" />
              </div>
              <div className="card-users-info-container">
                <p className="stat-name">Total Reports</p>
                <p className="stat-value">{totalReports}</p>
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

          <div className="lecturer-stats-card">
            <div className="card-content-1">
              <div className="card-icon-container-clock">
                <Clock1 className="clock-icon" />
              </div>
              <div className="card-users-info-container">
                <p className="stat-name">Pending Review</p>
                <p className="stat-value">{pendingReports}</p>
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

          <div className="lecturer-stats-card">
            <div className="card-content-1">
              <div className="card-icon-container-badge-check">
                <BadgeCheck className="badge-check-icon" />
              </div>
              <div className="card-users-info-container">
                <p className="stat-name">Reviewed</p>
                <p className="stat-value">{reviewRepors}</p>
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
        </div>

        <div className="lecture-dashboard-report-main-section">
          <div className="lecture-dashboard-report-section">
            <div className="lecture-dashboard-report-section-headings-recent-report">
              <p>Recent Reports</p>
            </div>
            <div className="lecturer-dashboard-report-list">
              <RecentReports recentReports={reports} />
            </div>
          </div>
          <div className="lecture-dashboard-report-Activities">
            <div className="lecture-dashboard-report-Deadline">
              <div className="lecture-dashboard-report-section-headings-recent-report">
                <p>Upcoming Deadlines</p>
              </div>

              <div className="lecture-dashboard-report-countdown-container">
                {mergedDeadlines.map((dl, index) => {
                  return (
                    <div
                      className="lecture-dashboard-report-countdown"
                      key={index}
                    >
                      <CountdownTimer
                        deadline={dl.deadline}
                        isSubmitted={dl.isSubmitted}
                        moduleCode={dl.moduleCode}
                        moduleName={dl.moduleName}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboardPage;
