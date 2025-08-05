import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, ArrowLeft, AlertTriangle } from "lucide-react";
import "./reviewerProfile.css";
import axios from "axios";
import ProfileSideInfo from "../../../../../components/admin/editUserProfile/profileSideInfo/profileSideInfo";

import Swal from "sweetalert2";

const EditReviewerProfilePage = ({ interface: interfaceData = null }) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    contact: "",
    department: "",
    staffNo: 0,
  });

  const fetchReviewer = useCallback(
    async (id) => {
      try {
        console.log("i am passing this userId: " + id + " to the backend.");
        const response = await axios.get(
          `${API_ENDPOINT}/api/AdminGetUserProfile/GetReviewerProfile`,
          {
            params: { userId: id },
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response?.data?.status) {
          setUser(response?.data?.reviewer);
          setFormData({
            name: response?.data?.reviewer.reviewerName,
            surname: response?.data?.reviewer.reviewerSurname,
            email: response?.data?.reviewer.email,
            contact: response?.data?.reviewer.contacts,
            department: response?.data?.reviewer.reviewerDepartment || "",
            staffNo: response?.data?.reviewer.staffNumber,
          });
        } else {
          console.log(response?.data?.message || "Failed to fetch reviewer");
          setUser(null);
        }
      } catch (error) {
        console.log(error.response?.data?.message || "An error occurred");
        setUser(null);
      } finally {
        setLoading(false);
      }
    },
    [API_ENDPOINT]
  );
  useEffect(() => {
    if (interfaceData) {
      setUser(interfaceData);
    } else {
      if (userId) {
        fetchReviewer(userId);
      }
    }
  }, [interfaceData, fetchReviewer, userId]);

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
        fetchReviewer(userId);
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
    <div className="edit-reviewer-container">
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
                      `${user.reviewerName?.charAt(0) || ""}${
                        user.reviewerSurname?.charAt(0) || ""
                      }` || "User"
                    )}&background=random`}
                    alt={user.reviewerName}
                    className="edit-user-profile-pic"
                  />
                </div>
                <div className="profile-info-section">
                  <h3>
                    {user.reviewerName + " " + user.reviewerSurname || "User"}
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
                  <label>Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
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
                  <label>Email Address </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled
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
          <ProfileSideInfo user={user} refreshProfile={fetchReviewer} />
        </motion.div>
      </div>
    </div>
  );
};

export default EditReviewerProfilePage;
