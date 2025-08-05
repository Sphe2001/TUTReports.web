import { useState, useEffect } from "react";
import "./assignProperties.css";
import { motion } from "framer-motion";
import {
  Search,
  User,
  Building2,
  BookOpen,
  Users,
  UserCog,
} from "lucide-react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AssignAcademicProperties = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [modules, setModules] = useState([]);
  const [studentGroups, setStudentGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}/api/UserGetters/GetAllLecturersAndReviewers`
        );
        if (response?.data?.status) {
          setUsers(response.data.users);
          setLoading(false);
        } else {
          console.log(response.data.message);
          setUsers(null);
        }
      } catch (error) {
        console.log("An error occurred. " + error);
        setUsers(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  let filteredUsers;
  if (users) {
    filteredUsers = users.filter((user) => {
      const matchSearch =
        user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === "all" || user.userRole === roleFilter;
      return matchSearch && matchRole;
    });
  }

  const fetchDepartments = async (id) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/AdminGetUserProfile/GetLecturerAvailableDepartments`,
        {
          params: { userId: id },
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response?.data?.status) {
        setDepartments(response?.data?.departments || []);
      } else {
        console.log(response?.data?.message || "Failed to fetch departments");
        setDepartments([]);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setDepartments([]);
    }
  };
  const fetchModules = async (id) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/AdminGetUserProfile/GetLecturerAvailablebleModules`,
        {
          params: { userId: id },
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response?.data?.status) {
        setModules(response?.data?.modules || []);
      } else {
        console.log(response?.data?.message || "Failed to fetch modules");
        setModules([]);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setModules([]);
    }
  };
  const fetchGroups = async (id) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/AdminGetUserProfile/GetLecturerAvailablebleGroups`,
        {
          params: { userId: id },
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);

      if (response?.data?.status) {
        setStudentGroups(response?.data?.groups || []);
      } else {
        console.log(response?.data?.message || "Failed to fetch groups");
        setStudentGroups([]);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setStudentGroups([]);
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    fetchDepartments(user.userId);

    if (user.userRole === "LECTURER") {
      fetchModules(user.userId);
      fetchGroups(user.userId);
    }
  };

  const handleAssignDept = async (userId, departmentId) => {
    try {
      const reviewerUserId = userId;
      const reviewerDepartmentId = departmentId;
      const response = await axios.post(
        `${API_ENDPOINT}/api/Assigning/AssignDepartmentToUser`,
        { userId: reviewerUserId, departmentId: reviewerDepartmentId },
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
        if (userId) {
          fetchDepartments(userId);
          fetchModules(userId);
          fetchGroups(userId);
        }
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          customClass: { popup: "my-swal-theme" },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: "An error occurred",
        icon: "error",
        customClass: { popup: "my-swal-theme" },
      });
    }
  };

  const handleRemoveDept = async (userId, departmentId) => {
    try {
      const reviewerUserId = userId;
      const reviewerDepartmentId = departmentId;
      console.log(reviewerUserId + " " + reviewerDepartmentId);
      const response = await axios.post(
        `${API_ENDPOINT}/api/Assigning/UnassignDepartmentFromUser`,
        { userId: reviewerUserId, departmentId: reviewerDepartmentId },
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
        if (userId) {
          fetchDepartments(userId);
          fetchModules(userId);
          fetchGroups(userId);
        }
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          customClass: { popup: "my-swal-theme" },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: "An error occurred",
        icon: "error",
        customClass: { popup: "my-swal-theme" },
      });
    }
  };

  const handleAssignModule = async (userId, moduleId) => {
    try {
      const lecturerUserId = userId;
      const lecturerModuleId = moduleId;
      const response = await axios.post(
        `${API_ENDPOINT}/api/Assigning/AssignModuleToUser`,
        { userId: lecturerUserId, moduleId: lecturerModuleId },
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
        if (userId) {
          fetchDepartments(userId);
          fetchModules(userId);
          fetchGroups(userId);
        }
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          customClass: { popup: "my-swal-theme" },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: "An error occurred",
        icon: "error",
        customClass: { popup: "my-swal-theme" },
      });
    }
  };

  const handleRemoveModule = async (userId, moduleId) => {
    try {
      const lecturerUserId = userId;
      const lecturerModuleId = moduleId;
      const response = await axios.post(
        `${API_ENDPOINT}/api/Assigning/UnassignModuleFromUser`,
        { userId: lecturerUserId, moduleId: lecturerModuleId },
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
        if (userId) {
          fetchDepartments(userId);
          fetchModules(userId);
          fetchGroups(userId);
        }
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          customClass: { popup: "my-swal-theme" },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: "An error occurred",
        icon: "error",
        customClass: { popup: "my-swal-theme" },
      });
    }
  };

  const handleAssignGroup = async (userId, moduleId, groupName) => {
    try {
      const lecturerUserId = userId;

      const response = await axios.post(
        `${API_ENDPOINT}/api/Assigning/AssignGroupsToUserModule`,
        {
          userId: lecturerUserId,
          moduleId: moduleId,
          groups: [groupName],
        },
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
        if (userId) {
          fetchDepartments(userId);
          fetchModules(userId);
          fetchGroups(userId);
        }
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          customClass: { popup: "my-swal-theme" },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: "An error occurred",
        icon: "error",
        customClass: { popup: "my-swal-theme" },
      });
    }
  };

  const handleRemoveGroup = async (userId, moduleId, groupName) => {
    try {
      const lecturerUserId = userId;
      const response = await axios.post(
        `${API_ENDPOINT}/api/Assigning/UnassignGroupsFromUserModule`,
        {
          userId: lecturerUserId,
          moduleId: moduleId,
          groups: [groupName],
        },
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
        if (userId) {
          fetchDepartments(userId);
          fetchModules(userId);
          fetchGroups(userId);
        }
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          customClass: { popup: "my-swal-theme" },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: "An error occurred",
        icon: "error",
        customClass: { popup: "my-swal-theme" },
      });
    }
  };

  const handleViewFullUser = (userId, role) => {
    if (role === "LECTURER") {
      navigate(`/assign/lecturer/${userId}`);
    } else {
      navigate(`/assign/reviewer/${userId}`);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  return (
    <div className="assign-academic-properties-container">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="assign-academic-properties-header"
      >
        <div>
          <h1>Assign Academic Properties</h1>
          <p>Assign departments, modules, and student groups to users</p>
        </div>
        {selectedUser?.userId && (
          <button
            className="full-user-button"
            onClick={() =>
              handleViewFullUser(selectedUser.userId, selectedUser.userRole)
            }
          >
            <UserCog size={16} /> View Full User
          </button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="assign-academic-properties-filters"
      >
        <div className="lecturers-list-search-container">
          <div className="admin-search-box">
            <div className="admin-search-icon">
              <Search className="icon" />
            </div>
            <input
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="admin-dropdown"
          >
            <option value="all">All Roles</option>
            <option value="LECTURER">Lecturers</option>
            <option value="REVIEWER">Reviewers</option>
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
        </div>
      </motion.div>

      <div className="assign-academic-properties-content">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="assign-academic-properties-users"
        >
          <div className="assign-academic-properties-header">
            <h2>Users</h2>
          </div>

          <div className="assign-academic-users-list-container">
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.userId}
                  className={`user-info-card  user-item ${
                    selectedUser.userId === user.userId ? "selected" : ""
                  }`}
                  onClick={() => handleSelectUser(user)}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      `${user.userName?.charAt(0) || ""}${
                        user.userSurname?.charAt(0) || ""
                      }` || "User"
                    )}&background=random`}
                    alt={user.userName}
                  />
                  <div className="user-card-information">
                    <h2>{user.userName}</h2>
                    <span>{user.userEmail}</span>
                    <span className="role">{user.userRole}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-users-found">
                <p>No users found.</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="assign-academic-properties-interface"
        >
          {selectedUser && selectedUser.userRole ? (
            <>
              <div className="selected-user-info-container">
                <div className="selected-user-info-content">
                  <img
                    src={
                      selectedUser.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        `${selectedUser.userName?.charAt(0) || ""}${
                          selectedUser.userSurname?.charAt(0) || ""
                        }` || "User"
                      )}&background=random`
                    }
                    alt={selectedUser.userName}
                    className="edit-user-profile-pic"
                  />

                  <div className="selected-user-info-text">
                    <h2>
                      {selectedUser.userName} {selectedUser.userSurname}{" "}
                    </h2>
                    <span className="email">{selectedUser.userEmail}</span>
                    <p className={`role ${selectedUser.userRole}`}>
                      {selectedUser.userRole}
                    </p>
                  </div>
                </div>
              </div>
              <div className="assign-academic-properties-section">
                <div className="academic-properties-header">
                  <Building2
                    size={25}
                    className="assign-academic-properties-icon departments"
                  />
                  <h3>Departments</h3>
                </div>

                <div className="assign-academic-properties-options departments">
                  {departments.map((dept) => {
                    return (
                      <div className="assign-property-card department">
                        <label
                          key={dept.departmentId}
                          className={`option ${
                            dept.isAssigned ? "checked" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={dept.isAssigned}
                            onChange={() =>
                              dept.isAssigned
                                ? handleRemoveDept(
                                    selectedUser.userId,
                                    dept.departmentId
                                  )
                                : handleAssignDept(
                                    selectedUser.userId,
                                    dept.departmentId
                                  )
                            }
                          />
                          <strong>{dept.departmentName}</strong>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedUser.userRole === "LECTURER" && (
                <div className="assign-academic-properties-section">
                  <div className="academic-properties-header">
                    <BookOpen
                      size={25}
                      className="assign-academic-properties-icon modules"
                    />
                    <h3>Modules</h3>
                  </div>

                  <div className="assign-academic-properties-options modules">
                    {modules.map((mod) => {
                      return (
                        <div className="assign-property-card module">
                          <label
                            key={mod.moduleId}
                            className={`option ${
                              mod.isAssigned ? "checked" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={mod.isAssigned}
                              onChange={() =>
                                mod.isAssigned
                                  ? handleRemoveModule(
                                      selectedUser.userId,
                                      mod.moduleId
                                    )
                                  : handleAssignModule(
                                      selectedUser.userId,
                                      mod.moduleId
                                    )
                              }
                            />
                            <strong>{mod.moduleCode}:</strong>{" "}
                            <span>{mod.moduleName}</span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedUser.userRole === "LECTURER" && (
                <div className="assign-academic-properties-section">
                  <div className="academic-properties-header">
                    <Users
                      size={25}
                      className="assign-academic-properties-icon groups"
                    />
                    <h3>Student Groups</h3>
                  </div>

                  <div className="assign-academic-properties-options groups">
                    {studentGroups.map((group) => {
                      return (
                        <div className="assign-property-card group">
                          <label
                            key={group.groupId}
                            className={`option ${
                              group.isAssigned ? "checked" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={group.isAssigned}
                              onChange={() =>
                                group.isAssigned
                                  ? handleRemoveGroup(
                                      selectedUser.userId,
                                      group.moduleId,
                                      group.groupName
                                    )
                                  : handleAssignGroup(
                                      selectedUser.userId,
                                      group.moduleId,
                                      group.groupName
                                    )
                              }
                            />
                            <strong>
                              {group.moduleCode}: Group - {group.groupName}:
                            </strong>{" "}
                            <span>{group.totalStudents} students</span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-user-selected">
              <User size={36} />
              <p>Select a user to manage their academic assignments.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AssignAcademicProperties;
