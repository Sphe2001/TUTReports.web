import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, ArrowLeft, AlertTriangle, User as UserIcon } from "lucide-react";
import "./lecturerProfile.css";
import axios from "axios";
import ProfileSideInfo from "../../../../../components/admin/editUserProfile/profileSideInfo/profileSideInfo";
import Swal from "sweetalert2";

const EditLecturerProfilePage = ({ interface: interfaceData = null }) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    contact: "",
    staffNo: 0,
  });

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
        setUser(response?.data?.lecturer);
        setFormData({
          name: response?.data?.lecturer.lecturerName,
          surname: response?.data?.lecturer.lecturerSurname,
          email: response?.data?.lecturer.email,
          contact: response?.data?.lecturer.contacts,
          staffNo: response?.data?.lecturer.staffNumber,
        });
        setDepartments(response?.data?.lecturer.lecturerDepartments);
      } else {
        console.log(response?.data?.message || "Failed to fetch lecturer");
        setUser(null);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (interfaceData) {
      setUser(interfaceData);
    } else {
      if (userId) {
        fetchLecturer(userId);
      }
    }
  }, [interfaceData, fetchLecturer, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/AdminEditUserProfile/UpdateUserProfile`,
        {
          userId: userId,
          userName: formData.name,
          userSurname: formData.surname,
          email: formData.email,
          contact: formData.contact,
        },
        {
          validateStatus: () => true,
        }
      );
      if (response.data.status) {
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          customClass: { popup: "my-swal-theme" },
        });
        setSaving(false);
        fetchLecturer(userId);
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
          customClass: { popup: "my-swal-theme" },
        });
        setSaving(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Failed!",
        text: "An error occurred",
        icon: "error",
        customClass: { popup: "my-swal-theme" },
      });
      console.error(error);
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="centered-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="centered-container">
        <div className="text-center">
          <AlertTriangle className="icon-error" />
          <h2 className="not-found-title">User Not Found</h2>
          <p className="not-found-message">
            The user you're looking for doesn't exist.
          </p>
          <Link onClick={() => window.history.back()} className="btn primary">
            <ArrowLeft className="icon-left" /> Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-lecturer-container">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="page-header"
      >
        <div className="page-header-left">
          <Link
            onClick={() => window.history.back()}
            className="back-icon-button"
          >
            <ArrowLeft />
          </Link>
          <div className="admin-dashboard-header">
            <h2 className="admin-header-text">Edit User Profile</h2>
          </div>
        </div>
      </motion.div>

      <div className="edit-user-form-layout">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="edit-user-form-section"
        >
          <div className="edit-user-card">
            <div className="edit-user-card-header">
              <h2>User Information</h2>
            </div>
            <form onSubmit={handleSubmit} className="edit-user-form-body">
              <div className="edit-user-profile-section">
                <div className="edit-user-profile-pic-wrapper">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      `${user.lecturerName?.charAt(0) || ""}${
                        user.lecturerSurname?.charAt(0) || ""
                      }` || "User"
                    )}&background=random`}
                    alt={user.lecturerName}
                    className="edit-user-profile-pic"
                  />
                </div>
                <div className="profile-info-section">
                  <h3>
                    {user.lecturerName + " " + user.lecturerSurname || "User"}
                  </h3>
                  <p className="role">{user.role}</p>
                  <p className="login-time">
                    Last login:{" "}
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>
              </div>

              <div className="edit-user-form-grid">
                <div className="edit-user-form-group">
                  <label>Staff Number</label>
                  <input
                    type="text"
                    value={formData.staffNo}
                    onChange={(e) =>
                      handleInputChange("staffNo", e.target.value)
                    }
                    disabled
                  />
                </div>
                <div className="edit-user-form-group">
                  <label>Email Address </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled
                  />
                </div>
                <div className="edit-user-form-group">
                  <label>Name </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="edit-user-form-group">
                  <label>Surname </label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) =>
                      handleInputChange("surname", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="edit-user-form-group">
                  <label>Contacts </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) =>
                      handleInputChange("contacts", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div className="user-departments-section">
                <div className="department-section-header">Departments</div>
                <div className="department-section-grid">
                  {departments.map((dep, i) => {
                    return (
                      <div className="edit-lecturer-department-card" key={i}>
                        <div className="edit-lecturer-department-text">
                          <span>{dep}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="edit-user-form-actions">
                <Link
                  onClick={() => window.history.back()}
                  className="btn cancel"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn save-changes"
                >
                  {saving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="icon-left" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="edit-user-side-information-section"
        >
          <ProfileSideInfo user={user} refreshProfile={fetchLecturer} />
        </motion.div>
      </div>
    </div>
  );
};

export default EditLecturerProfilePage;
