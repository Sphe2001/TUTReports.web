import { useState, useEffect, useCallback } from "react";
import "./adminDashboard.css";
import axios from "axios";

import { format } from "date-fns";

import {
  UserPlus,
  Users,
  LayoutDashboard,
  ActivitySquare,
  ChartColumn,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

const AdminDashboard = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const navigate = useNavigate();

  const handleAddUser = () => {
    navigate("/manage-users/add-user");
  };
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0 });
  const [totalUserRoles, setTotalUserRoles] = useState(0);
  const [lecturerCount, setLecturerCount] = useState(0);
  const [reviewerCount, setReviewerCount] = useState(0);
  const [viewedReports, setViewedReports] = useState(0);
  const [pendingReviewReports, setPendingReviewReports] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const fetchUsersActivities = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/UserGetters/GetAllUserActivities`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response?.data?.status) {
        const sortedActivities = response.data.userActivities.sort((a, b) => {
          const dateA = new Date(a.lastLogin);
          const dateB = new Date(b.lastLogin);

          const isAValid = a.lastLogin !== "0001-01-01T00:00:00";
          const isBValid = b.lastLogin !== "0001-01-01T00:00:00";

          if (!isAValid && !isBValid) return 0;
          if (!isAValid) return 1;
          if (!isBValid) return -1;

          return dateB - dateA;
        });

        setUsersActivities(sortedActivities);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching users activities ", error);
    }
  }, [API_ENDPOINT]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalUsersRes = await axios.get(
          `${API_ENDPOINT}/api/stats/system/GetTotalUsers`
        );
        setStats((prev) => ({ ...prev, totalUsers: totalUsersRes.data.count }));

        const activeUsersRes = await axios.get(
          `${API_ENDPOINT}/api/stats/system/GetTotalActiveUsers`
        );
        setStats((prev) => ({
          ...prev,
          activeUsers: activeUsersRes.data.count,
        }));

        const totalRolesRes = await axios.get(
          `${API_ENDPOINT}/api/stats/system/GetTotalRoles`
        );
        setTotalUserRoles(totalRolesRes.data.count);

        const lecturerRes = await axios.get(
          `${API_ENDPOINT}/api/stats/system/GetLecturerCount`
        );
        setLecturerCount(lecturerRes.data.count);

        const reviewerRes = await axios.get(
          `${API_ENDPOINT}/api/stats/system/GetReviewerCount`
        );
        setReviewerCount(reviewerRes.data.count);

        const viewedReportsRes = await axios.get(
          `${API_ENDPOINT}/api/stats/system/GetTotalReviewedReports`
        );
        setViewedReports(viewedReportsRes.data.count);

        const pendingReviewRes = await axios.get(
          `${API_ENDPOINT}/api/stats/system/GetTotalUnreviewedReports`
        );
        setPendingReviewReports(pendingReviewRes.data.count);

        const totalReportsRes = await axios.get(
          `${API_ENDPOINT}/api/stats/system/GetTotalReports`
        );
        setTotalReports(totalReportsRes.data.count);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // toast.error(error.response?.data?.message || "An error occurred");
      }
    };

    fetchData();
    fetchUsersActivities();
  }, [API_ENDPOINT, fetchUsersActivities]);

  const [usersActivities, setUsersActivities] = useState([]);

  const activePercent =
    stats.totalUsers > 0
      ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
      : 0;

  return (
    <div className="admin-dashboard">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="admin-dashboard-header-container"
      >
        <div className="admin-dashboard-header">
          <h2 className="admin-header-text">Admin Dashboard</h2>
          <p className="admin-date">
            {" "}
            {format(new Date(), "EEEE, MMMM do, yyyy")} | System Overview
          </p>
        </div>
        <div className="header-button">
          <button className="dashboard-add-user-button" onClick={handleAddUser}>
            <UserPlus className="dashboard-button-icon" />
            <span>Add New User</span>
          </button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="admin-dashboard-stats-container"
      >
        <div className="admin-stats-card">
          <div className="card-content-1">
            <div className="card-icon-container-users">
              <Users className="users-icon" />
            </div>
            <div className="card-users-info-container">
              <p className="stat-name">Total users</p>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="card-content-2">
            <div className="span-container">
              <span>Active </span>
              <span>{activePercent}%</span>
            </div>
            <div className="span-container">
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div className="admin-stats-card">
          <div className="card-content-1">
            <div className="card-icon-container-roles">
              <LayoutDashboard className="layout-dashboard-icon" />
            </div>
            <div className="card-users-info-container">
              <p className="stat-name">User Roles</p>
              <p className="stat-value">{totalUserRoles}</p>
            </div>
          </div>
          <div className="card-content-2">
            <div className="span-container">
              <span>Lecturers </span>
              <span>{lecturerCount}</span>
            </div>
            <div className="span-container">
              <span>Reviewers </span>
              <span>{reviewerCount}</span>
            </div>
          </div>
        </div>
        <div className="admin-stats-card">
          <div className="card-content-1">
            <div className="card-icon-container-reports">
              <ActivitySquare className="activity-square-icon" />
            </div>
            <div className="card-users-info-container">
              <p className="stat-name">Total Reports </p>
              <p className="stat-value">{totalReports}</p>
            </div>
          </div>
          <div className="card-content-2">
            <div className="span-container">
              <span>Viewed </span>
              <span>{viewedReports}</span>
            </div>
            <div className="span-container">
              <span>Pending Review </span>
              <span>{pendingReviewReports}</span>
            </div>
          </div>
        </div>
        <div className="admin-stats-card">
          <div className="card-content-1">
            <div className="card-icon-container-system">
              <ChartColumn className="cart-column-icon" />
            </div>
            <div className="card-users-info-container">
              <p className="stat-name">System Health </p>
              <p className="stat-value">Ok</p>
            </div>
          </div>
          <div className="card-content-2">
            <div className="span-container">
              <span> </span>
              <span></span>
            </div>
            <div className="span-container">
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="admin-dashboard-content-container">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="recent-content-container"
        >
          <div className="recent-user-activity-header">
            <span>Recent User Activity</span>
          </div>
          <div className="recent-activity-list-container">
            <div className="users-list-container">
              <div className="users-list-table-container">
                <div className="activity-table-wrapper">
                  <table className="user-account-table">
                    <thead>
                      <tr>
                        <th>NAME</th>
                        <th>ROLE</th>
                        <th>STATUS</th>
                        <th>Last Login</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersActivities.map((user, i) => (
                        <tr key={i}>
                          <td>
                            <div className="user-account-name-info">
                              <div>
                                <div className="user-account-name">
                                  {user.name}
                                </div>
                                <div className="user-account-email">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{user.role}</td>

                          <td>
                            <span
                              className={`user-account-status-badge ${
                                user.isActive ? "active" : "inactive"
                              }`}
                            >
                              {user.isActive ? "online" : "offline"}
                            </span>
                          </td>
                          <td>{user.lastLogin}</td>
                        </tr>
                      ))}
                      {usersActivities.length === 0 && (
                        <tr>
                          <td
                            colSpan="6"
                            style={{ textAlign: "center", padding: "1rem" }}
                          >
                            No activities found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
