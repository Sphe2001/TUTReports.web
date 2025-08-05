import "./roleCard.css";
import { ShieldUser, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const RoleCard = ({ id, roleName, numOfUsers, createdAt, refreshRoles }) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const openEditModal = async (id, newRoleName) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/AcademyEdit/EditRole`,
        {
          roleId: id,
          newRoleName: newRoleName,
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
        await refreshRoles();
      } else {
        Swal.fire({
          title: "Error . ",
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

  const openDeleteModal = async (id) => {
    try {
      const response = await axios.delete(
        `${API_ENDPOINT}/api/AcademyRemove/DeleteRole/${id}`,
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
        await refreshRoles();
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
    <div key={id} className="card role-card">
      <div className="role-card-header">
        <div className="role-card-info">
          <div className="role-card-icon-box">
            <ShieldUser className="role-card-icon" />
          </div>
          <div className="role-card-info-text">
            <strong>{roleName}</strong>
            <span>{numOfUsers} users</span>
          </div>
        </div>
        <div className="role-card-action-buttons">
          <button
            onClick={() => {
              Swal.fire({
                text: `You are about to edit this role.`,
                icon: "info",
                input: "text",
                inputLabel: "Role Name",
                inputValue: roleName,
                showCancelButton: true,
                confirmButtonText: `Save`,
                confirmButtonColor: "#16a34a",
                cancelButtonText: "Cancel",
                customClass: { popup: "my-swal-theme" },
              }).then(async (result) => {
                if (result.isConfirmed && result.value?.trim()) {
                  await openEditModal(id, result.value);
                }
              });
            }}
            className="action-btn"
          >
            <Edit className="card-action-icon-edit" />
          </button>
          <button
            onClick={() => {
              Swal.fire({
                title: `Are you sure?`,
                text: `You are about to delete this role.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: `Yes, Delete`,
                confirmButtonColor: "#dc2626",
                cancelButtonText: "Cancel",
                customClass: { popup: "my-swal-theme" },
              }).then(async (result) => {
                if (result.isConfirmed) {
                  await openDeleteModal(id);
                }
              });
            }}
            className="action-btn delete"
          >
            <Trash2 className="card-action-icon-delete" />
          </button>
        </div>
      </div>
      <div className="role-card-details">
        <div className="card-date-container">
          <span>Created: </span>
          <span>{createdAt}</span>
        </div>
      </div>
    </div>
  );
};
export default RoleCard;
