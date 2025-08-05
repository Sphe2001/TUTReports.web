import { useEffect, useState, useCallback } from "react";
import "./manageDepartments.css";
import { motion } from "framer-motion";
import { Plus, Search, Building2, ArrowLeft } from "lucide-react";
import axios from "axios";
import DepartmentCard from "../../../../components/admin/departments/departmentCard";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const ManageDepartments = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/AcademyGet/GetAllDepartments`
      );

      if (response?.data?.status) {
        setDepartments(response.data.departments);
      } else {
        console.log(response?.data?.message);
        setDepartments([]);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setDepartments([]);
    }
  }, [API_ENDPOINT]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const openAddDepartmentModal = async (newDepartmentName) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/AcademyAdd/AddDepartment`,
        { name: newDepartmentName },
        { withCredentials: true, validateStatus: () => true }
      );

      if (response?.data?.status) {
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          customClass: { popup: "my-swal-theme" },
        });
        await fetchDepartments();
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

  const openImportDepartmentsModal = async (file) => {
    const formData = new FormData();
    formData.append("departmentsFile", file);
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/Import/ImportDepartments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            withCredentials: true,
          },
        }
      );

      if (response?.data?.status) {
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          customClass: { popup: "my-swal-theme" },
        });
        await fetchDepartments();
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

  const filteredDepartments = departments.filter((dept) =>
    dept.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
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
              <h2 className="admin-header-text">Manage Departments</h2>
            </div>
          </div>

          <div className="add-academic-button-container">
            <button
              className="btn academic-button"
              onClick={() => {
                Swal.fire({
                  title: "Add New Department",
                  input: "text",
                  inputLabel: "Department Name",
                  showCancelButton: true,
                  confirmButtonText: `Save`,
                  confirmButtonColor: "#16a34a",
                  cancelButtonText: "Cancel",
                  customClass: { popup: "my-swal-theme" },
                }).then(async (result) => {
                  if (result.isConfirmed && result.value?.trim()) {
                    await openAddDepartmentModal(result.value);
                  }
                });
              }}
            >
              <Plus className="icon" /> Add New Department
            </button>

            <button
              className="btn academic-button"
              onClick={async () => {
                const { value: file } = await Swal.fire({
                  title: "Import Departments",
                  input: "file",
                  inputLabel: "Upload Departments file (.csv or .xlsx)",
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
                  await openImportDepartmentsModal(file);
                }
              }}
            >
              <Plus className="icon" /> Import Departments
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
              placeholder="Search departments..."
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
        className="departments-grid"
      >
        {filteredDepartments.map((department) => (
          <DepartmentCard
            key={department.departmentId}
            id={department.departmentId}
            departmentName={department.departmentName}
            numOfLecturers={department.lecturerCount}
            numOfReviewers={department.reviewerCount}
            numOfModules={department.moduleCount}
            refreshDepartments={fetchDepartments}
          />
        ))}
      </motion.div>

      {filteredDepartments.length === 0 && (
        <div className="card no-data">
          <Building2 className="icon no-data-icon" />
          <p>No departments found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default ManageDepartments;
