import { useState, useEffect } from "react";
import "./lecturerAssign.css";
import { toast } from "react-hot-toast";
import { Trash2, UserRoundPen, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LecturerAssignPage = ({ interface: interfaceData = null }) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const navigate = useNavigate();
  const { userId } = useParams();

  const [activeSection, setActiveSection] = useState("Departments");
  const sections = ["Departments", "Modules", "Groups"];
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [modules, setModules] = useState([]);
  const [lecturer, setLecturer] = useState(null);

  const fetchLecturer = async (id) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/AdminGetUserProfile/GetLecturerProfile`,
        {
          params: { userId: id },
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response?.data?.status) {
        setLecturer(response?.data?.lecturer);
      } else {
        console.log(response?.data?.message || "Failed to fetch lecturer");
        setLecturer(null);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setLecturer(null);
    }
  };
  const [profile, setProfile] = useState(null);
  const getUserProfile = async (id) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/UserProfile/GetUserProfilePicture`,
        {
          params: { userId: id },
          withCredentials: true,
          responseType: "blob",
        }
      );
      const imageBlob = response.data;
      const imageUrl = URL.createObjectURL(imageBlob);
      setProfile(imageUrl);
    } catch (error) {
      console.log(error);
      setProfile(null);
    }
  };

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
        setGroups(response?.data?.groups || []);
      } else {
        console.log(response?.data?.message || "Failed to fetch groups");
        setGroups([]);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setGroups([]);
    }
  };
  useEffect(() => {
    if (interfaceData) {
      setDepartments(interfaceData.departments || []);
      setModules(interfaceData.modules || []);
      setGroups(interfaceData.groups || []);
      setLecturer(interfaceData.lecturer || null);
    } else {
      if (userId) {
        fetchDepartments(userId);
        fetchLecturer(userId);
        fetchModules(userId);
        fetchGroups(userId);
        getUserProfile(userId);
      }
    }
  }, [
    interfaceData,
    fetchDepartments,
    fetchLecturer,
    fetchModules,
    fetchGroups,
    getUserProfile,
    userId,
  ]);

  const handleAssignDepartment = async (userId, departmentId) => {
    try {
      const lecturerUserId = userId;
      const lecturerDepartmentId = departmentId;
      console.log(lecturerDepartmentId);
      const response = await axios.post(
        `${API_ENDPOINT}/api/Assigning/AssignDepartmentToUser`,
        { userId: lecturerUserId, departmentId: lecturerDepartmentId },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
        {
          validateStatus: () => true,
        }
      );

      if (response?.data?.status) {
        toast.success(response?.data?.message);
        if (userId) {
          fetchDepartments(userId);
          fetchLecturer(userId);
          fetchModules(userId);
          fetchGroups(userId);
        }
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
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
        toast.success(response?.data?.message);
        if (userId) {
          fetchDepartments(userId);
          fetchLecturer(userId);
          fetchModules(userId);
          fetchGroups(userId);
        }
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
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
        toast.success(response?.data?.message);
        if (userId) {
          fetchDepartments(userId);
          fetchLecturer(userId);
          fetchModules(userId);
          fetchGroups(userId);
        }
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleRemoveDepartment = async (userId, departmentId) => {
    try {
      const lecturerUserId = userId;
      const lecturerDepartmentId = departmentId;
      const response = await axios.post(
        `${API_ENDPOINT}/api/Assigning/UnassignDepartmentFromUser`,
        { userId: lecturerUserId, departmentId: lecturerDepartmentId },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
        {
          validateStatus: () => true,
        }
      );

      if (response?.data?.status) {
        toast.success(response?.data?.message);
        if (userId) {
          fetchDepartments(userId);
          fetchLecturer(userId);
          fetchModules(userId);
          fetchGroups(userId);
        }
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
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
        toast.success(response?.data?.message);
        if (userId) {
          fetchDepartments(userId);
          fetchLecturer(userId);
          fetchModules(userId);
          fetchGroups(userId);
        }
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
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
        toast.success(response?.data?.message);
        if (userId) {
          fetchDepartments(userId);
          fetchLecturer(userId);
          fetchModules(userId);
          fetchGroups(userId);
        }
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleAddDept = () => {
    navigate("/manage-departments");
  };
  const handleAddMod = () => {
    navigate("/manage-modules");
  };
  const handleAddGrp = () => {
    navigate("/manage-groups");
  };

  return (
    <div className="lecturer-assign-page">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lecturer-assign-header-container"
      >
        <div className="page-header-left">
          <Link
            onClick={() => window.history.back()}
            className="back-icon-button"
          >
            <ArrowLeft />
          </Link>
          <div className="admin-dashboard-header">
            <h2 className="admin-header-text">Lecturer Assign</h2>
          </div>
        </div>
        <div className="header-buttons-container">
          <div className="header-button">
            <button className="add-department-button" onClick={handleAddDept}>
              <span>Add New Department</span>
            </button>
          </div>
          <div className="header-button">
            <button className="add-department-button" onClick={handleAddMod}>
              <span>Add New Module</span>
            </button>
          </div>
          <div className="header-button">
            <button className="add-department-button" onClick={handleAddGrp}>
              <span>Add New Group</span>
            </button>
          </div>
        </div>
      </motion.div>
      <div className="lecturer-assign-content-container">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="user-details-container"
        >
          <div className="card assigning-user-details-card">
            <div className="card-header">
              <h2>User Details</h2>
            </div>
            <div className="card-body">
              <div className="assign-user-profile">
                <div className="assign-profile-image">
                  <img
                    src={
                      profile ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        `${lecturer?.lecturerName?.charAt(0) || ""}${
                          lecturer?.lecturerSurname?.charAt(0) || ""
                        }` || "User"
                      )}&background=random`
                    }
                    alt={lecturer?.lecturerName}
                  />
                </div>
                <div className="assign-user-info">
                  <div className="input-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={lecturer?.lecturerName}
                      disabled
                      className="user-input"
                    />
                  </div>
                  <div className="input-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={lecturer?.lecturerSurname}
                      disabled
                      className="user-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card assigning-current-assignments-card">
            <div className="card-header">
              <h2>Current Assignments</h2>
            </div>
            <div className="card-body">
              <div className="assignments-section">
                <h3>Departments</h3>
                <div className="assignments-table">
                  {departments
                    .filter((d) => d.isAssigned)
                    .map((dept) => (
                      <div key={dept.departmentId} className="assignment-row">
                        <span>{dept.departmentName}</span>
                      </div>
                    ))}
                  {departments.filter((d) => d.isAssigned).length === 0 && (
                    <div className="no-assignments">
                      No departments assigned
                    </div>
                  )}
                </div>
              </div>

              <div className="assignments-section">
                <h3>Modules</h3>
                <div className="assignments-table">
                  {modules
                    .filter((m) => m.isAssigned)
                    .map((mod) => (
                      <div key={mod.moduleId} className="assignment-row">
                        <div className="module-info">
                          <span className="module-name">{mod.moduleName}</span>
                          <span className="module-code">{mod.moduleCode}</span>
                        </div>
                        <span className="department">{mod.department}</span>
                      </div>
                    ))}
                  {modules.filter((m) => m.isAssigned).length === 0 && (
                    <div className="no-assignments">No modules assigned</div>
                  )}
                </div>
              </div>

              <div className="assignments-section">
                <h3>Groups</h3>
                <div className="assignments-table">
                  {groups
                    .filter((g) => g.isAssigned)
                    .map((grp) => (
                      <div key={grp.groupId} className="assignment-row">
                        <div className="group-info">
                          <span className="group-name">{grp.groupName}</span>
                          <span className="module-code">{grp.moduleCode}</span>
                        </div>
                        <span className="student-count">
                          {grp.totalStudents} students
                        </span>
                      </div>
                    ))}
                  {groups.filter((g) => g.isAssigned).length === 0 && (
                    <div className="no-assignments">No groups assigned</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="assign-academic-content-container"
        >
          <div className="header-tabs">
            {sections.map((section) => (
              <button
                key={section}
                className={`tab-button ${
                  activeSection === section ? "active" : ""
                }`}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </button>
            ))}
          </div>

          <div className="academic-content">
            <AnimatePresence mode="wait">
              <motion.div key={activeSection} className="table-content">
                <div className="avaliable-content-modal">
                  {activeSection === "Departments" && (
                    <>
                      {departments.length > 0 ? (
                        departments.map((department, i) => {
                          const assigned = department.isAssigned;

                          return (
                            <div className="department-container" key={i}>
                              <div>{department.departmentName}</div>
                              <div>{department.isAssigned}</div>
                              <div>
                                <button
                                  className={
                                    assigned ? "remove-btn" : "assign-btn"
                                  }
                                  onClick={() =>
                                    assigned
                                      ? handleRemoveDepartment(
                                          userId,
                                          department.departmentId
                                        )
                                      : handleAssignDepartment(
                                          userId,
                                          department.departmentId
                                        )
                                  }
                                >
                                  {assigned ? (
                                    <>
                                      <Trash2 className="remove-btn-icon" />
                                      Remove
                                    </>
                                  ) : (
                                    <>
                                      <UserRoundPen className="assign-btn-icon" />
                                      Assign
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="department-container">
                          <div
                            style={{
                              textAlign: "center",
                              padding: "1rem",
                            }}
                          >
                            No departments found.
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {activeSection === "Modules" && (
                    <>
                      {modules.length > 0 ? (
                        modules.map((module, i) => {
                          const assigned = module.isAssigned;
                          return (
                            <div className="module-container" key={i}>
                              <div>
                                <div className="module-code-name-container">
                                  <div className="module-code-text">
                                    {module.moduleCode} :{" "}
                                  </div>
                                  <div className="module-name-text">
                                    {module.moduleName}
                                  </div>
                                </div>
                                <div className="department-name-text">
                                  {module.department}
                                </div>
                              </div>

                              <div>
                                <button
                                  className={
                                    assigned ? "remove-btn" : "assign-btn"
                                  }
                                  onClick={() =>
                                    assigned
                                      ? handleRemoveModule(
                                          userId,
                                          module.moduleId
                                        )
                                      : handleAssignModule(
                                          userId,
                                          module.moduleId
                                        )
                                  }
                                >
                                  {assigned ? (
                                    <>
                                      <Trash2 className="remove-btn-icon" />
                                      Remove
                                    </>
                                  ) : (
                                    <>
                                      <UserRoundPen className="assign-btn-icon" />
                                      Assign
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="department-container">
                          <div
                            style={{
                              textAlign: "center",
                              padding: "1rem",
                            }}
                          >
                            No modules found.
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {activeSection === "Groups" && (
                    <>
                      {groups.length > 0 ? (
                        groups.map((group, i) => {
                          const assigned = group.isAssigned;
                          return (
                            <div className="group-container" key={i}>
                              <div>
                                <div>{group.moduleCode}</div>
                                <div className="group-name-container">
                                  <div className="group-name-text">
                                    {group.groupName}
                                  </div>
                                  <div className="students-text">
                                    STUDENTS : {group.totalStudents}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <button
                                  className={
                                    assigned ? "remove-btn" : "assign-btn"
                                  }
                                  onClick={() =>
                                    assigned
                                      ? handleRemoveGroup(
                                          userId,
                                          group.moduleId,
                                          group.groupName
                                        )
                                      : handleAssignGroup(
                                          userId,
                                          group.moduleId,
                                          group.groupName
                                        )
                                  }
                                >
                                  {assigned ? (
                                    <>
                                      <Trash2 className="remove-btn-icon" />
                                      Remove
                                    </>
                                  ) : (
                                    <>
                                      <UserRoundPen className="assign-btn-icon" />
                                      Assign
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="department-container">
                          <div
                            style={{
                              textAlign: "center",
                              padding: "1rem",
                            }}
                          >
                            No groups found.
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LecturerAssignPage;
