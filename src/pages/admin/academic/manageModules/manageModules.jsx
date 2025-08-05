import { useEffect, useState, useCallback } from "react";
import "./manageModules.css";
import { motion } from "framer-motion";
import { Plus, Search, Building2, ArrowLeft } from "lucide-react";
import axios from "axios";
import ModuleCard from "../../../../components/admin/modules/moduleCard";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const ManageModules = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [modules, setModules] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 Search state

  const fetchModules = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/AcademyGet/GetAllModules`
      );
      if (response?.data?.status) {
        setModules(response.data.modules);
      } else {
        setModules([]);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setModules([]);
    }
  }, [API_ENDPOINT]);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/AcademyGet/GetAllDepartments`
      );
      if (response?.data?.status) {
        setDepartments(response.data.departments);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setDepartments([]);
    }
  }, [API_ENDPOINT]);

  useEffect(() => {
    fetchModules();
    fetchDepartments();
  }, [fetchModules, fetchDepartments]);

  const openAddModuleModal = async (
    departmentId,
    newModuleName,
    moduleCode
  ) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/AcademyAdd/AddModule`,
        {
          departmentId,
          name: newModuleName,
          code: moduleCode,
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
        await fetchModules();
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

  const openImportModulesModal = async (file, departmentId) => {
    const formData = new FormData();
    formData.append("modulesFile", file);
    formData.append("departmentId", departmentId);
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/Import/ImportModules`,
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
        await fetchModules();
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

  const filteredModules = modules.filter((mod) =>
    `${mod.moduleName} ${mod.moduleCode} ${mod.departmentName}`
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
              <h2 className="admin-header-text">Manage Modules</h2>
            </div>
          </div>
          <div className="add-academic-button-container">
            <button
              className="btn academic-button"
              onClick={() => {
                Swal.fire({
                  title: "Add New Module",
                  html: `
                    <label for="department-select">Select Department</label>
                    <select id="department-select" class="swal2-input">
                      ${
                        departments.length > 0
                          ? departments
                              .map(
                                (d) =>
                                  `<option value="${d.departmentId}">${d.departmentName}</option>`
                              )
                              .join("")
                          : `<option disabled selected>No Departments</option>`
                      }
                    </select>
                    <input type="text" id="module-name" class="swal2-input" placeholder="Module Name" />
                    <input type="text" id="module-code" class="swal2-input" placeholder="Module Code" />
                  `,
                  showCancelButton: true,
                  confirmButtonText: "Save",
                  confirmButtonColor: "#16a34a",
                  cancelButtonText: "Cancel",
                  preConfirm: () => {
                    const departmentId =
                      document.getElementById("department-select").value;
                    const moduleName =
                      document.getElementById("module-name").value;
                    const moduleCode =
                      document.getElementById("module-code").value;

                    if (!departmentId || !moduleName || !moduleCode) {
                      Swal.showValidationMessage("All fields are required");
                      return false;
                    }

                    return { departmentId, moduleName, moduleCode };
                  },
                  customClass: { popup: "my-swal-theme" },
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    const { departmentId, moduleName, moduleCode } =
                      result.value;
                    await openAddModuleModal(
                      departmentId,
                      moduleName,
                      moduleCode
                    );
                  }
                });
              }}
            >
              <Plus className="icon" /> Add New Module
            </button>

            <button
              className="btn academic-button"
              onClick={async () => {
                const result = await Swal.fire({
                  title: "Import Modules",
                  html: `
                    <label for="department-select">Select Department</label>
                    <select id="department-select" class="swal2-input">
                      ${departments
                        .map(
                          (d) =>
                            `<option value="${d.departmentId}">${d.departmentName}</option>`
                        )
                        .join("")}
                    </select>
                    <div>
                    <label for="module-file">Select Module File (.csv or .xlsx)</label>
                    <input type="file" id="module-file" class="swal2-file" accept=".csv, .xlsx" />
                    <div>
                    
                  `,
                  showCancelButton: true,
                  confirmButtonText: `Upload`,
                  confirmButtonColor: "#16a34a",
                  cancelButtonText: "Cancel",
                  customClass: { popup: "my-swal-theme" },
                  preConfirm: () => {
                    const departmentId =
                      document.getElementById("department-select").value;
                    const file =
                      document.getElementById("module-file").files[0];
                    if (!departmentId || !file) {
                      Swal.showValidationMessage(
                        "Please select department and file"
                      );
                      return false;
                    }
                    return { departmentId, file };
                  },
                });

                if (result.isConfirmed && result.value) {
                  const { file, departmentId } = result.value;
                  await openImportModulesModal(file, departmentId);
                }
              }}
            >
              <Plus className="icon" /> Import Modules
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
              placeholder="Search Modules..."
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
        className="modules-grid"
      >
        {filteredModules.map((module) => (
          <ModuleCard
            key={module.moduleId}
            id={module.moduleId}
            moduleName={module.moduleName}
            moduleCode={module.moduleCode}
            department={module.departmentName}
            groups={module.groupCount}
            refreshModules={fetchModules}
          />
        ))}
      </motion.div>

      {filteredModules.length === 0 && (
        <div className="card no-data">
          <Building2 className="icon no-data-icon" />
          <p>No Modules found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default ManageModules;
