import { useState, useEffect } from "react";
import "./viewLecturers.css";
import { UserPlus, Search, UserRoundPen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const ViewLecturersPage = ({ interface: interfaceData = null }) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [lecturers, setLecturers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchLecturers = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/UserGetters/GetAllLecturers`
      );
      if (response?.data?.status) {
        setLecturers(response.data.lecturers);
      } else {
        setLecturers([]);
      }
    } catch (error) {
      console.error(error.response?.data?.message || "An error occurred");
      setLecturers([]);
    }
  };
  useEffect(() => {
    if (interfaceData) {
      setLecturers(interfaceData);
    } else {
      fetchLecturers();
    }
  }, [interfaceData, fetchLecturers]);
  const handleAssign = (userId) => {
    navigate(`/assign/lecturer/${userId}`);
  };

  const handleAddUser = () => {
    navigate("/manage-users/add-user");
  };

  // Filter lecturers by search term
  const filteredLecturers = lecturers.filter((lecturer) => {
    const term = searchTerm.toLowerCase();
    const staffNumber = String(lecturer.staffNumber).toLowerCase();
    const fullName =
      `${lecturer.lecturerName} ${lecturer.lecturerSurname}`.toLowerCase();

    return fullName.includes(term) || staffNumber.includes(term);
  });

  return (
    <div className="view-lecturers-page">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="view-lecturers-header-container"
      >
        <div className="view-lecturers-header">
          <h2 className="admin-header-text">View Lecturers</h2>
        </div>
        <div className="header-button">
          <button className="dashboard-add-user-button" onClick={handleAddUser}>
            <UserPlus className="dashboard-button-icon" />
            <span>Add New Lecturer</span>
          </button>
        </div>
      </motion.div>
      <div className="manage-lecturers-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="manage-lecturers-list-container"
        >
          <div className="lecturers-list-search-container">
            <div className="admin-search-box">
              <div className="admin-search-icon">
                <Search className="icon" />
              </div>
              <input
                type="search"
                placeholder="Search lecturers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
          </div>
          <div className="users-list-container">
            <div className="users-list-table-container">
              <div className="lecturerlist-table-wrapper">
                <table className="user-account-table">
                  <thead>
                    <tr>
                      <th>STAFF NO.</th>
                      <th>FULL NAME</th>
                      <th>DEPARTMENTS</th>
                      <th>MODULES</th>
                      <th>GROUPS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLecturers.length > 0 ? (
                      filteredLecturers.map((user, i) => (
                        <tr key={i}>
                          <td>{user.staffNumber}</td>
                          <td>
                            {user.lecturerName} {user.lecturerSurname}
                          </td>
                          <td>
                            {(user.lecturerDepartments || []).join(", ") ||
                              "NOT ASSIGNED"}{" "}
                          </td>
                          <td>
                            {(user.lecturerModules || []).join(", ") ||
                              "NOT ASSIGNED"}
                          </td>
                          <td>
                            {(user.lecturerGroups || []).join(", ") ||
                              "NOT ASSIGNED"}
                          </td>
                          <td>
                            <button
                              className="assign-button"
                              onClick={() => handleAssign(user.userId)}
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
                          colSpan="6"
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

export default ViewLecturersPage;
