import { User as UserIcon, Calendar, Shield, CheckCircle } from "lucide-react";
import "./profileSideInfo.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileSideInfo = ({ user, refreshProfile }) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const navigate = useNavigate();
  const handleManageDepartment = (userId) => {
    navigate(`/assign/reviewer/${userId}`);
  };
  const handleManageAssign = (userId) => {
    navigate(`/assign/lecturer/${userId}`);
  };
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
        refreshProfile(userId);
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
        refreshProfile(userId);
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
  const openSendEmailModal = async (email, subject, body) => {
    try {
      console.log(email + subject + body);
      const response = await axios.post(
        `${API_ENDPOINT}/api/AdminSendEmailMessage/SendEmailMessage`,
        {
          email: email,
          subject: subject,
          body: body,
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
    <div className="profile-side-info-container">
      <div className="profile-side-info-card">
        <div className="profile-side-info-card-header">
          <h2>Account Summary</h2>
        </div>
        <div className="profile-side-info-card-body">
          <div className="profile-side-info-sidebar-row">
            <UserIcon className="icon-sm user-icon" />
            <span>User ID: {user.userId}</span>
          </div>
          <div className="profile-side-info-sidebar-row">
            <Calendar className="icon-sm calendar-icon" />
            <span>
              Created: {new Date(user.registeredAt).toLocaleDateString()}
            </span>
          </div>
          <div className="profile-side-info-sidebar-row">
            <Shield className="icon-sm shield-icon" />
            <span>Role: {user.role}</span>
          </div>
          <div className="profile-side-info-sidebar-row">
            <span
              className={`status-indicator ${
                user.isActive ? "active" : "inactive"
              } `}
            ></span>
            <span>Status: {user.isActive ? "Active" : "Inactive"}</span>
          </div>
        </div>
      </div>

      <div className="profile-side-info-card">
        <div className="profile-side-info-card-header">
          <h2>Quick Actions</h2>
        </div>
        {user.role === "ADMIN" && (
          <>
            <div className="profile-side-info-card-body">
              <button
                className="profile-side-info-sidebar-btn"
                onClick={() => {
                  Swal.fire({
                    title: `Send to ${user.email}`,
                    html: `
                    <div class="swal-container">
                    <div class="swal-label-input-container">
                      <label for="subject">Subject</label>
                      <input type="text" id="subject" class="swal2-input" placeholder="Subject" />
                    </div>
                    <div class="swal-label-input-container">
                      <label for="body">Message</label>
                      <textarea id="body" class="swal2-textarea" placeholder="Enter your message here..." rows="5" style="width: 100%; resize: vertical;" /></textarea>
                    </div>
                    </div>
                    `,
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    confirmButtonColor: "#16a34a",
                    cancelButtonText: "Cancel",
                    focusConfirm: false,
                    preConfirm: () => {
                      const subject = document.getElementById("subject").value;
                      const body = document.getElementById("body").value;

                      if (!subject || !body) {
                        Swal.showValidationMessage("All fields are required");
                        return false;
                      }

                      return {
                        subject,
                        body,
                      };
                    },
                    customClass: { popup: "my-swal-theme" },
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      const { subject, body } = result.value;
                      await openSendEmailModal(user.email, subject, body);
                    }
                  });
                }}
              >
                Send Email
              </button>
              {/* <button className="profile-side-info-sidebar-btn">
                View Activity Log
              </button> */}
              <button
                className={`profile-side-info-sidebar-btn ${
                  user.isActive ? "deactivate" : "activate"
                }`}
                onClick={async () => {
                  const action = user.isActive ? "deactivate" : "activate";
                  const handler = user.isActive ? handleDisable : handleEnable;

                  const result = await Swal.fire({
                    title: `Are you sure?`,
                    text: `You are about to ${action} this user account.`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: `Yes, ${action}`,
                    cancelButtonText: "Cancel",
                    confirmButtonColor: user.isActive ? "#dc2626" : "#16a34a",
                    customClass: { popup: "my-swal-theme" },
                  });

                  if (result.isConfirmed) {
                    await handler(user.userId);
                  }
                }}
              >
                {user.isActive ? "Deactivate Account" : "Activate Account"}
              </button>
            </div>
          </>
        )}
        {user.role === "LECTURER" && (
          <>
            <div className="profile-side-info-card-body">
              <button
                className="profile-side-info-sidebar-btn"
                onClick={() => {
                  Swal.fire({
                    title: `Send to ${user.email}`,
                    html: `
                    <div class="swal-container">
                    <div class="swal-label-input-container">
                      <label for="subject">Subject</label>
                      <input type="text" id="subject" class="swal2-input" placeholder="Subject" />
                    </div>
                    <div class="swal-label-input-container">
                      <label for="body">Message</label>
                      <textarea id="body" class="swal2-textarea" placeholder="Enter your message here..." rows="5" style="width: 100%; resize: vertical;" /></textarea>
                    </div>
                    </div>
                                  `,
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    confirmButtonColor: "#16a34a",
                    cancelButtonText: "Cancel",
                    focusConfirm: false,
                    preConfirm: () => {
                      const subject = document.getElementById("subject").value;
                      const body = document.getElementById("body").value;

                      if (!subject || !body) {
                        Swal.showValidationMessage("All fields are required");
                        return false;
                      }

                      return {
                        subject,
                        body,
                      };
                    },
                    customClass: { popup: "my-swal-theme" },
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      const { subject, body } = result.value;
                      await openSendEmailModal(user.email, subject, body);
                    }
                  });
                }}
              >
                Send Email
              </button>
              <button
                className="profile-side-info-sidebar-btn"
                onClick={() => {
                  handleManageAssign(user.userId);
                }}
              >
                Assign Properties
              </button>
              {/* <button className="profile-side-info-sidebar-btn">
                View Activity Log
              </button> */}
              <button
                className={`profile-side-info-sidebar-btn ${
                  user.isActive ? "deactivate" : "activate"
                }`}
                onClick={async () => {
                  const action = user.isActive ? "deactivate" : "activate";
                  const handler = user.isActive ? handleDisable : handleEnable;

                  const result = await Swal.fire({
                    title: `Are you sure?`,
                    text: `You are about to ${action} this user account.`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: `Yes, ${action}`,
                    cancelButtonText: "Cancel",
                    confirmButtonColor: user.isActive ? "#dc2626" : "#16a34a",
                    customClass: { popup: "my-swal-theme" },
                  });

                  if (result.isConfirmed) {
                    await handler(user.userId);
                  }
                }}
              >
                {user.isActive ? "Deactivate Account" : "Activate Account"}
              </button>
            </div>
          </>
        )}
        {user.role === "REVIEWER" && (
          <>
            <div className="profile-side-info-card-body">
              <button
                className="profile-side-info-sidebar-btn"
                onClick={() => {
                  Swal.fire({
                    title: `Send to ${user.email}`,
                    html: `
                    <div class="swal-container">
                    <div class="swal-label-input-container">
                      <label for="subject">Subject</label>
                      <input type="text" id="subject" class="swal2-input" placeholder="Subject" />
                    </div>
                    <div class="swal-label-input-container">
                      <label for="body">Message</label>
                      <textarea id="body" class="swal2-textarea" placeholder="Enter your message here..." rows="5" style="width: 100%; resize: vertical;" /></textarea>
                    </div>
                    </div>
                                  `,
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    confirmButtonColor: "#16a34a",
                    cancelButtonText: "Cancel",
                    focusConfirm: false,
                    preConfirm: () => {
                      const subject = document.getElementById("subject").value;
                      const body = document.getElementById("body").value;

                      if (!subject || !body) {
                        Swal.showValidationMessage("All fields are required");
                        return false;
                      }

                      return {
                        subject,
                        body,
                      };
                    },
                    customClass: { popup: "my-swal-theme" },
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      const { subject, body } = result.value;
                      await openSendEmailModal(user.email, subject, body);
                    }
                  });
                }}
              >
                Send Email
              </button>
              <button
                className="profile-side-info-sidebar-btn"
                onClick={() => {
                  handleManageDepartment(user.userId);
                }}
              >
                Manage Department
              </button>
              {/* <button className="profile-side-info-sidebar-btn">
                View Activity Log
              </button> */}
              <button
                className={`profile-side-info-sidebar-btn ${
                  user.isActive ? "deactivate" : "activate"
                }`}
                onClick={async () => {
                  const action = user.isActive ? "deactivate" : "activate";
                  const handler = user.isActive ? handleDisable : handleEnable;

                  const result = await Swal.fire({
                    title: `Are you sure?`,
                    text: `You are about to ${action} this user account.`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: `Yes, ${action}`,
                    cancelButtonText: "Cancel",
                    confirmButtonColor: user.isActive ? "#dc2626" : "#16a34a",
                    customClass: { popup: "my-swal-theme" },
                  });

                  if (result.isConfirmed) {
                    await handler(user.userId);
                  }
                }}
              >
                {user.isActive ? "Deactivate Account" : "Activate Account"}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="profile-side-info-card">
        <div className="profile-side-info-card-header">
          <h2>Role Permissions</h2>
        </div>
        <div className="profile-side-info-card-body">
          {user.role === "ADMIN" && (
            <>
              <div className="profile-side-info-sidebar-row">
                <CheckCircle className="icon-success" />
                <span>Manage all users</span>
              </div>
              <div className="profile-side-info-sidebar-row">
                <CheckCircle className="icon-success" />
                <span>System configuration</span>
              </div>
              <div className="profile-side-info-sidebar-row">
                <CheckCircle className="icon-success" />
                <span>Manage academics</span>
              </div>
            </>
          )}
          {user.role === "REVIEWER" && (
            <>
              <div className="profile-side-info-sidebar-row">
                <CheckCircle className="icon-success" />
                <span>Review reports</span>
              </div>
              <div className="profile-side-info-sidebar-row">
                <CheckCircle className="icon-success" />
                <span>Provide feedback</span>
              </div>
            </>
          )}
          {user.role === "LECTURER" && (
            <>
              <div className="profile-side-info-sidebar-row">
                <CheckCircle className="icon-success" />
                <span>Create reports</span>
              </div>
              <div className="profile-side-info-sidebar-row">
                <CheckCircle className="icon-success" />
                <span>View own reports</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSideInfo;
