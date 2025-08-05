import { useState, useEffect, useCallback } from "react";
import "./manageUserPage.css";
import { UserPlus, Search, Edit, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToggleSlider } from "react-toggle-slider";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const ManageUserPage = ({ interface: interfaceData = null }) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [userAccounts, setUserAccounts] = useState([]);
  const [toggleStates, setToggleStates] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const initializeToggleStates = (accounts) => {
    const newStates = {};
    accounts.forEach((user) => {
      newStates[user.userId] = !user.isDisabled;
    });
    setToggleStates(newStates);
  };

  const fetchUserAccounts = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/UserGetters/GetAllUserAccounts`
      );

      if (response?.data?.status) {
        setUserAccounts(response.data.userAccounts);
        initializeToggleStates(response.data.userAccounts);
      } else {
        console.log(response?.data?.message || "Failed to fetch users");
        setUserAccounts([]);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setUserAccounts([]);
    }
  }, [API_ENDPOINT]);

  useEffect(() => {
    if (interfaceData) {
      setUserAccounts(interfaceData);
      initializeToggleStates(interfaceData);
    } else {
      fetchUserAccounts();
    }
  }, [interfaceData, fetchUserAccounts]);
  const handleEnable = async (userId) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/Auth/Reactivate`,
        { userId },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
        {
          validateStatus: () => true,
        }
      );

      if (response?.data?.status) {
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          customClass: { popup: "my-swal-theme" },
        });
        fetchUserAccounts();
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          customClass: { popup: "my-swal-theme" },
        });
        fetchUserAccounts();
      }
    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: "An error occurred",
        icon: "error",
        customClass: { popup: "my-swal-theme" },
      });
      console.error(error);
      fetchUserAccounts();
    }
  };

  const handleDisable = async (userId) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/Auth/Deactivate`,
        { userId },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
        {
          validateStatus: () => true,
        }
      );

      if (response?.data?.status) {
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          customClass: { popup: "my-swal-theme" },
        });
        fetchUserAccounts();
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          customClass: { popup: "my-swal-theme" },
        });
        fetchUserAccounts();
      }
    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: "An error occurred",
        icon: "error",
        customClass: { popup: "my-swal-theme" },
      });
      console.error(error);
      fetchUserAccounts();
    }
  };

  const navigate = useNavigate();
  const handleAddUser = () => {
    navigate("/manage-users/add-user");
  };

  const filteredUsers = userAccounts.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      user.userName.toLowerCase().includes(searchLower) ||
      user.userSurname.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower);

    const roleLower = user.roleName.toLowerCase();
    const roleFilterMatches =
      filterRole === "all" ||
      (filterRole === "admin" && roleLower === "admin") ||
      (filterRole === "lecturer" && roleLower === "lecturer") ||
      (filterRole === "reviewer" && roleLower === "reviewer");

    const statusFilterMatches =
      filterStatus === "all" ||
      (filterStatus === "active" && !user.isDisabled) ||
      (filterStatus === "inactive" && user.isDisabled);

    return matchesSearch && roleFilterMatches && statusFilterMatches;
  });

  return (
    <div className="manage-users-page">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="manage-users-header-container"
      >
        <div className="page-header-left">
          <Link
            onClick={() => window.history.back()}
            className="back-icon-button"
          >
            <ArrowLeft />
          </Link>
          <div className="admin-dashboard-header">
            <h2 className="admin-header-text">Manage Users</h2>
          </div>
        </div>
        <div className="header-button">
          <button className="dashboard-add-user-button" onClick={handleAddUser}>
            <UserPlus className="dashboard-button-icon" />
            <span>Add New User</span>
          </button>
        </div>
      </motion.div>
      <div className="manage-users-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="manage-users-list-container"
        >
          <div className="users-list-search-container">
            <div className="admin-search-box">
              <div className="admin-search-icon">
                <Search className="icon" />
              </div>
              <input
                type="search"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="admin-dropdown"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="lecturer">Lecturers</option>
              <option value="reviewer">Reviewers</option>
            </select>

            <select
              className="admin-dropdown"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="users-list-container">
            <div className="user-table-wrapper">
              <table className="user-account-table">
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>ROLE</th>
                    <th>STATUS</th>
                    <th>CREATED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, i) => (
                    <tr key={i}>
                      <td>
                        <div className="user-account-name-info">
                          <div>
                            <div className="user-account-name">
                              {user.userName} {user.userSurname}
                            </div>
                            <div className="user-account-email">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{user.roleName}</td>

                      <td>
                        <span
                          className={`user-account-status-badge ${
                            user.isDisabled ? "inactive" : "active"
                          }`}
                        >
                          {user.isDisabled ? "Disabled" : "Active"}
                        </span>
                      </td>
                      <td>{user.registered}</td>
                      <td>
                        <div className="user-account-action-buttons">
                          <Link
                            to={
                              user.roleName === "LECTURER"
                                ? `/manage-users/edit-lecturer/${user.userId}`
                                : user.roleName === "REVIEWER"
                                ? `/manage-users/edit-reviewer/${user.userId}`
                                : `/manage-users/edit-admin/${user.userId}`
                            }
                          >
                            <Edit
                              className="user-account-edit-icon"
                              size={28}
                              title="Edit User Profile"
                            />
                          </Link>

                          <div>
                            <ToggleSlider
                              key={`${user.userId}-${
                                toggleStates[user.userId]
                              }`}
                              active={toggleStates[user.userId]}
                              onToggle={(newState) => {
                                const previousState = toggleStates[user.userId];

                                setToggleStates((prev) => ({
                                  ...prev,
                                  [user.userId]: newState,
                                }));

                                const revertState = () => {
                                  setToggleStates((prev) => ({
                                    ...prev,
                                    [user.userId]: previousState,
                                  }));
                                };

                                const action = newState
                                  ? "activate"
                                  : "disable";
                                const handler = newState
                                  ? handleEnable
                                  : handleDisable;

                                Swal.fire({
                                  title: `Are you sure?`,
                                  text: `You are about to ${action} this user account.`,
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: `Yes, ${action}`,
                                  cancelButtonText: "Cancel",
                                  confirmButtonColor: newState
                                    ? "#16a34a"
                                    : "#dc2626",
                                  customClass: { popup: "my-swal-theme" },
                                }).then(async (result) => {
                                  if (result.isConfirmed) {
                                    await handler(user.userId);
                                  } else if (result.isDismissed) {
                                    revertState();
                                  }
                                });
                              }}
                              barBackgroundColorActive="#16a34a"
                              barBackgroundColor="#dc2626"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
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
        </motion.div>
      </div>
    </div>
  );
};

export default ManageUserPage;
