import React, { useState, useEffect } from "react";
import "./reviewerAssign.css";

import { toast } from "react-hot-toast";
import axios from "axios";
import { Trash2, UserRoundPen, ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ReviewerAssignPage = ({ interface: interfaceData = null }) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const navigate = useNavigate();
  const { userId } = useParams();
  const [departments, setDepartments] = useState([]);
  const [reviewer, setReviewer] = useState(null);

  const fetchReviewer = async (id) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/AdminGetUserProfile/GetReviewerProfile`,
        {
          params: { userId: id },
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response?.data?.status) {
        setReviewer(response?.data?.reviewer);
      } else {
        console.log(response?.data?.message || "Failed to fetch reviewer");
        setReviewer(null);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setReviewer(null);
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

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/AcademyGet/GetAllDepartments`
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
  useEffect(() => {
    if (interfaceData) {
      setDepartments(interfaceData);
      setReviewer(interfaceData);
    } else {
      fetchDepartments();
      if (userId) {
        fetchReviewer(userId);
        getUserProfile(userId);
      }
    }
    getUserProfile(userId);
  }, [interfaceData, fetchDepartments, fetchReviewer, userId]);

  const handleAssign = async (userId, departmentId) => {
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
        toast.success(response?.data?.message);
        if (userId) fetchReviewer(userId);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleRemove = async (userId, departmentId) => {
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
        toast.success(response?.data?.message);
        if (userId) fetchReviewer(userId);
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

  return (
    <div className="reviewer-assign-page">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="reviewer-assign-header-container"
      >
        <div className="page-header-left">
          <Link
            onClick={() => window.history.back()}
            className="back-icon-button"
          >
            <ArrowLeft />
          </Link>
          <div className="admin-dashboard-header">
            <h2 className="admin-header-text">Reviewer Assign</h2>
          </div>
        </div>
        <div className="header-button">
          <button className="add-department-button" onClick={handleAddDept}>
            <span>Add New Department</span>
          </button>
        </div>
      </motion.div>
      <div className="reviewer-assign-content-container">
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
                        `${reviewer?.reviewerName?.charAt(0) || ""}${
                          reviewer?.reviewerSurname?.charAt(0) || ""
                        }` || "User"
                      )}&background=random`
                    }
                    alt={reviewer?.reviewerName}
                  />
                </div>
                <div className="assign-user-info">
                  <div className="input-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={reviewer?.reviewerName}
                      disabled
                      className="user-input"
                    />
                  </div>
                  <div className="input-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={reviewer?.reviewerSurname}
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
                  <div className="assignment-row">
                    <span>{reviewer?.reviewerDepartment}</span>
                  </div>

                  {reviewer?.reviewerDepartment.length === 0 && (
                    <div className="no-assignments">
                      No departments assigned
                    </div>
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
          className="assign-content-container"
        >
          <div className="assign-content-header">
            <h3 className="details-header-text">AVALIABLE DEPARTMENTS</h3>
          </div>
          <div className="assign-content-body">
            <div className="department-list-wrapper">
              {departments.length > 0 ? (
                departments.map((department, i) => (
                  <div className="department-container" key={i}>
                    <div>{department.departmentName}</div>
                    <div>
                      {reviewer?.reviewerDepartment ===
                      department.departmentName ? (
                        <button
                          className="remove-button"
                          onClick={() =>
                            handleRemove(
                              reviewer.userId,
                              department.departmentId
                            )
                          }
                        >
                          <Trash2 className="assign-button-icon" />
                          <span>Remove</span>
                        </button>
                      ) : (
                        <button
                          className="assign-button"
                          onClick={() =>
                            handleAssign(
                              reviewer.userId,
                              department.departmentId
                            )
                          }
                        >
                          <UserRoundPen className="assign-button-icon" />
                          <span>Assign</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="department-container">
                  <div
                    colSpan="6"
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    No departments found.
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewerAssignPage;
