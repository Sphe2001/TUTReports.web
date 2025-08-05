import { useEffect, useState, useCallback } from "react";
import "./manageGroups.css";
import { motion } from "framer-motion";
import { Plus, Search, Building2, ArrowLeft } from "lucide-react";
import axios from "axios";
import GroupCard from "../../../../components/admin/groups/groupCard";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const ManageGroups = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [groups, setGroups] = useState([]);
  const [modules, setModules] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchGroups = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/AcademyGet/GetAllGroups`
      );

      if (response?.data?.status) {
        setGroups(response.data.groups);
      } else {
        console.log(response?.data?.message);
        setGroups([]);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setGroups([]);
    }
  }, [API_ENDPOINT]);

  const fetchModules = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/AcademyGet/GetAllModules`
      );

      if (response?.data?.status) {
        setModules(response.data.modules);
      } else {
        console.log(response?.data?.message);
        setModules([]);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setModules([]);
    }
  }, [API_ENDPOINT]);

  useEffect(() => {
    fetchGroups();
    fetchModules();
  }, [fetchGroups, fetchModules]);

  const openAddGroupModal = async (moduleId, newGroupName, totalStudents) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/AcademyAdd/AddGroup`,
        {
          moduleId,
          groupName: newGroupName,
          totalStudents,
        },
        {
          withCredentials: true,
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
        await fetchGroups();
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
      console.error(error);
    }
  };

  const openImportGroupsModal = async (file) => {
    const formData = new FormData();
    formData.append("groupsFile", file);
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/Import/ImportGroups`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            withCredentials: true,
          },
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
        await fetchGroups();
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
      console.error(error);
    }
  };

  const filteredGroups = groups.filter((group) =>
    `${group.groupName} ${group.moduleName} ${group.departmentName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="manage-container">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="manage-header-container">
          <div className="page-header-left">
            <Link
              onClick={() => window.history.back()}
              className="back-icon-button"
            >
              <ArrowLeft />
            </Link>
            <div className="admin-dashboard-header">
              <h2 className="admin-header-text">Manage Student Groups</h2>
            </div>
          </div>
          <div className="add-academic-button-container">
            <button
              className="btn academic-button"
              onClick={() => {
                Swal.fire({
                  title: "Add New Group",
                  html: `
                    <label for="module-select">Select Module</label>
                    <select id="module-select" class="swal2-input">
                      ${
                        modules.length > 0
                          ? modules
                              .map(
                                (m) =>
                                  `<option value="${m.moduleId}">${m.moduleCode} - ${m.moduleName}</option>`
                              )
                              .join("")
                          : `<option disabled selected>No Modules</option>`
                      }
                    </select>
                    <input type="text" id="group-name" class="swal2-input" placeholder="Group Name" />
                    <input type="text" id="totalStudents" class="swal2-input" placeholder="Number Of Students" />
                  `,
                  showCancelButton: true,
                  confirmButtonText: "Save",
                  confirmButtonColor: "#16a34a",
                  cancelButtonText: "Cancel",
                  focusConfirm: false,
                  preConfirm: () => {
                    const moduleId =
                      document.getElementById("module-select").value;
                    const groupName =
                      document.getElementById("group-name").value;
                    const totalStudents =
                      document.getElementById("totalStudents").value;

                    if (!moduleId || !groupName || !totalStudents) {
                      Swal.showValidationMessage("All fields are required");
                      return false;
                    }

                    return { moduleId, groupName, totalStudents };
                  },
                  customClass: { popup: "my-swal-theme" },
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    const { moduleId, groupName, totalStudents } = result.value;
                    await openAddGroupModal(moduleId, groupName, totalStudents);
                  }
                });
              }}
            >
              <Plus className="icon" /> Add New Group
            </button>
            <button
              className="btn academic-button"
              onClick={async () => {
                const { value: file } = await Swal.fire({
                  title: "Import Groups",
                  input: "file",
                  inputLabel: "Upload Groups file (.csv or .xlsx)",
                  inputAttributes: {
                    accept: ".csv, .xlsx",
                    "aria-label": "Upload your file",
                  },
                  showCancelButton: true,
                  confirmButtonText: `Upload`,
                  confirmButtonColor: "#16a34a",
                  cancelButtonText: "Cancel",
                  customClass: { popup: "my-swal-theme" },
                  preConfirm: (file) => {
                    if (!file) {
                      Swal.showValidationMessage("Please select a file");
                      return false;
                    }
                    return file;
                  },
                });
                if (file) {
                  await openImportGroupsModal(file);
                }
              }}
            >
              <Plus className="icon" /> Import Groups
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card search-filter"
      >
        <div className="lecturers-list-search-container">
          <div className="admin-search-box">
            <div className="admin-search-icon">
              <Search className="icon" />
            </div>
            <input
              type="search"
              placeholder="Search Groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="groups-grid"
      >
        {filteredGroups.map((group) => (
          <GroupCard
            key={group.groupId}
            id={group.groupId}
            groupName={group.groupName}
            moduleName={group.moduleName}
            moduleCode={group.moduleCode}
            department={group.departmentName}
            students={group.totalStudents}
            refreshGroups={fetchGroups}
          />
        ))}
      </motion.div>

      {filteredGroups.length === 0 && (
        <div className="card no-data">
          <Building2 className="icon no-data-icon" />
          <p>No Groups found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default ManageGroups;
