import { useState, useEffect, useCallback } from "react";
import "./viewReviewers.css";
import { UserPlus, Search, UserRoundPen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const ViewReviewersPage = ({ interface: interfaceData = null }) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [reviewers, setReviewers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const navigate = useNavigate();

  const fetchReviewers = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/UserGetters/GetAllReviewers`
      );

      if (response?.data?.status) {
        setReviewers(response?.data?.reviewers || []);
      } else {
        console.log(response?.data?.message || "Failed to fetch reviewers");
        setReviewers([]);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setReviewers([]);
    }
  }, [API_ENDPOINT]);
  useEffect(() => {
    if (interfaceData) {
      setReviewers(interfaceData);
    } else {
      fetchReviewers();
    }
  }, [interfaceData, fetchReviewers]);

  const handleAssign = (userId) => {
    navigate(`/assign/reviewer/${userId}`);
  };

  const handleAddUser = () => {
    navigate("/manage-users/add-user");
  };

  // Get unique departments for the dropdown filter
  const uniqueDepartments = [
    ...new Set(
      reviewers
        .map((r) => r.reviewerDepartment?.trim())
        .filter((d) => d && d.length > 0)
    ),
  ];

  // Filter reviewers based on search, status, and department
  const filteredReviewers = reviewers.filter((reviewer) => {
    const term = searchTerm.toLowerCase();
    const staffNumber = String(reviewer?.staffNumber || "").toLowerCase();
    const fullName = `${reviewer?.reviewerName || ""} ${
      reviewer?.reviewerSurname || ""
    }`.toLowerCase();
    const dept = reviewer?.reviewerDepartment?.trim() || "";

    // Search matches staff number or full name
    const matchesSearch = staffNumber.includes(term) || fullName.includes(term);

    // Status filter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && reviewer.isActive) ||
      (statusFilter === "inactive" && !reviewer.isActive);

    // Department filter
    const matchesDepartment =
      departmentFilter === "all" || dept === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div className="view-reviewers-page">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="view-reviewers-header-container"
      >
        <div className="view-reviewers-header">
          <h2 className="admin-header-text">View Reviewers</h2>
        </div>
        <div className="header-button">
          <button className="dashboard-add-user-button" onClick={handleAddUser}>
            <UserPlus className="dashboard-button-icon" />
            <span>Add New Reviewer</span>
          </button>
        </div>
      </motion.div>

      <div className="manage-reviewers-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="manage-reviewers-list-container"
        >
          <div
            className="reviewers-list-search-container"
            style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
          >
            <div className="admin-search-box" style={{ flexGrow: 1 }}>
              <div className="admin-search-icon">
                <Search className="icon" />
              </div>
              <input
                type="search"
                placeholder="Search reviewers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="admin-dropdown"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              className="admin-dropdown"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {uniqueDepartments.map((dept, idx) => (
                <option key={idx} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="users-list-container">
            <div className="users-list-table-container">
              <div className="reviewerlist-table-wrapper">
                <table className="user-account-table">
                  <thead>
                    <tr>
                      <th>STAFF NO.</th>
                      <th>FULL NAME</th>
                      <th>DEPARTMENT</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReviewers.length > 0 ? (
                      filteredReviewers.map((reviewer, i) => (
                        <tr key={i}>
                          <td>{reviewer?.staffNumber}</td>
                          <td>
                            {reviewer?.reviewerName || ""}{" "}
                            {reviewer?.reviewerSurname || ""}
                          </td>
                          <td>
                            {reviewer?.reviewerDepartment || "NOT ASSIGNED"}
                          </td>
                          <td>
                            <button
                              className="assign-button"
                              onClick={() => handleAssign(reviewer.userId)}
                            >
                              <UserRoundPen className="assign-button-icon" />
                              <span>Assign</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          style={{ textAlign: "center", padding: "1rem" }}
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewReviewersPage;
