import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./addUserPage.css";
import { toast } from "react-hot-toast";
import {
  UserPlus,
  FilePen,
  FileChartColumn,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const AddUserPage = ({ interface: interfaceData = null }) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const incomingError = location.state?.error || "";

  const [error, setError] = useState(incomingError);
  const [staffNumber, setStaffNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [roleOptions, setRoleOptions] = useState([]);
  const [totalLecturers, setTotalLecturers] = useState(0);
  const [totalReviewers, setTotalReviewers] = useState(0);

  const getTotalLecturers = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/stats/system/GetLecturerCount`
      );
      if (response?.data?.status) {
        setTotalLecturers(response.data.count);
      }
    } catch (error) {
      console.log(error);
    }
  }, [API_ENDPOINT]);

  const getTotalReviewers = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/stats/system/GetReviewerCount`
      );
      if (response?.data?.status) {
        setTotalReviewers(response.data.count);
      }
    } catch (error) {
      console.log(error);
    }
  }, [API_ENDPOINT]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/AcademyGet/GetAllRoles`
      );
      if (response?.data?.status && Array.isArray(response.data.roles)) {
        setRoleOptions(response.data.roles);
      } else {
        toast.error("Failed to load roles.");
        setRoleOptions([]);
      }
    } catch (error) {
      toast.error("Error fetching roles.");
      setRoleOptions([]);
    }
  }, [API_ENDPOINT]);
  useEffect(() => {
    if (!interfaceData) {
      fetchRoles();
      getTotalLecturers();
      getTotalReviewers();
    } else {
      setRoleOptions(interfaceData);
    }
  }, [interfaceData, fetchRoles, getTotalLecturers, getTotalReviewers]);

  const isPhoneValid = (phone) => /^\d{10}$/.test(phone);

  const validateInputs = () => {
    if (
      !staffNumber ||
      !firstName ||
      !surname ||
      !contactDetails ||
      !email ||
      !selectedRole
    ) {
      setError("Please fill all required fields.");
      return false;
    }

    if (!isPhoneValid(contactDetails)) {
      setError("Phone number must be exactly 10 digits.");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setStaffNumber("");
    setFirstName("");
    setSurname("");
    setContactDetails("");
    setEmail("");
    setSelectedRole("");
    setError("");
  };

  const addUser = async () => {
    if (!validateInputs()) return;
    setLoading(true);

    const payload = {
      staffNo: parseInt(staffNumber),
      userName: firstName.trim(),
      userSurname: surname.trim(),
      contacts: contactDetails.trim(),
      email: email.trim(),
      roleId: parseInt(selectedRole),
    };

    try {
      const results = await axios.post(
        `${API_ENDPOINT}/api/Auth/AddUserAccount`,
        payload,
        {
          validateStatus: () => true,
        }
      );

      if (results?.data?.status) {
        toast.success(results?.data?.message);
        resetForm();
        fetchRoles();
        getTotalLecturers();
        getTotalReviewers();
      } else {
        toast.error(results?.data?.message);
      }
    } catch (err) {
      toast.error(err.results?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const openImportUsersModal = async (file) => {
    const formData = new FormData();
    formData.append("usersFile", file);
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/Import/ImportUsers`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            withCredentials: true,
          },
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
        fetchRoles();
        getTotalLecturers();
        getTotalReviewers();
        const errors = response.data.errors;
        if (errors && errors.length > 0) {
          const formattedErrors = errors
            .map(
              (
                err
              ) => `<li style="margin-bottom: 8px; color: #e74c3c; font-weight: 500;">
                  ${err}
                </li>`
            )
            .join("");

          await Swal.fire({
            title: "Import Errors",
            html: `<ul style="text-align: left; padding-left: 20px; list-style-type: disc;">
             ${formattedErrors}
           </ul>`,
            icon: "info",
            customClass: { popup: "my-swal-theme" },
            width: 600,
          });
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
      console.error(error);
    }
  };

  return (
    <div className="add-users-page">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="add-user-header-container"
      >
        <div className="page-header-left">
          <Link
            onClick={() => window.history.back()}
            className="back-icon-button"
          >
            <ArrowLeft />
          </Link>
          <div className="admin-dashboard-header">
            <h2 className="admin-header-text">Add New User</h2>
          </div>
        </div>
        <div className="add-academic-button-container">
          <button
            className="btn academic-button"
            onClick={async () => {
              const { value: file } = await Swal.fire({
                title: "Import Users",
                input: "file",
                inputLabel: "Upload Users file (.csv or .xlsx)",
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
                await openImportUsersModal(file);
              }
            }}
          >
            <Plus className="icon" /> Import Users
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
            <div className="card-icon-container-lecturers">
              <FilePen className="file-pen-icon" />
            </div>
            <div className="card-users-info-container">
              <p className="stat-name">Total Lectures</p>
              <p className="stat-value">{totalLecturers}</p>
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
        <div className="admin-stats-card">
          <div className="card-content-1">
            <div className="card-icon-container-reviewers">
              <FileChartColumn className="file-chart-column-icon" />
            </div>
            <div className="card-users-info-container">
              <p className="stat-name">Total Reviewers</p>
              <p className="stat-value">{totalReviewers}</p>
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
      <div className="add-users-main-content-container">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="add-users-content-container"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addUser();
            }}
          >
            <div className="add-user-form-input-container">
              <div className="add-user-input-container">
                <div className="label-field-container">
                  <label htmlFor="staffNumber">Staff Number </label>
                  <input
                    id="staffNumber"
                    type="text"
                    value={staffNumber}
                    onChange={(e) => setStaffNumber(e.target.value)}
                  />
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  {roleOptions.map((role) => (
                    <option
                      key={role.roleId || role.RoleId}
                      value={role.roleId || role.RoleId}
                    >
                      {role.roleName || role.RoleName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-user-input-container">
                <div className="label-field-container">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="label-field-container">
                  <label htmlFor="surname">Last Name</label>
                  <input
                    id="surname"
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </div>
              </div>
              <div className="add-user-input-container">
                <div className="label-field-container">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="label-field-container">
                  <label htmlFor="contacts">Contacts</label>
                  <input
                    id="contacts"
                    type="text"
                    value={contactDetails}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,10}$/.test(value)) setContactDetails(value);
                    }}
                  />
                </div>
              </div>

              <div className="add-user-button-container">
                {error && <p className="form-error-message">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="dashboard-add-user-button"
                >
                  {loading ? (
                    "Adding..."
                  ) : (
                    <>
                      <UserPlus className="dashboard-button-icon" />
                      <span>Add User</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddUserPage;
