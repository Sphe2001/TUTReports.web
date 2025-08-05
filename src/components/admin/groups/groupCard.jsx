import "./groupCard.css";
import { Users, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const GroupCard = ({
  id,
  groupName,
  moduleCode,
  moduleName,
  department,
  students,
  refreshGroups,
}) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const openEditModal = async (id, newGroupName) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/AcademyEdit/EditGroup`,
        {
          groupId: id,
          newGroupName: newGroupName,
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
        await refreshGroups();
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
  const openDeleteModal = async (id) => {
    try {
      const response = await axios.delete(
        `${API_ENDPOINT}/api/AcademyRemove/DeleteGroup/${id}`,
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
        await refreshGroups();
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
    <div key={id} className="card group-card">
      <div className="group-card-header">
        <div className="group-card-info">
          <div className="group-card-icon-box">
            <Users className="group-card-icon" />
          </div>
          <div className="group-card-info-text">
            <span>Group - {groupName}</span>
            <p>{moduleCode}</p>
          </div>
        </div>
        <div className="group-card-action-buttons">
          <button
            onClick={() => {
              Swal.fire({
                text: `You are about to edit this group.`,
                icon: "info",
                input: "text",
                inputLabel: "Group Name",
                inputValue: groupName,
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
                text: `You are about to delete this group.`,
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
      <div className="group-card-details">
        <div className="group-name">
          <strong>{moduleName}</strong>
          <span>{department}</span>
        </div>
        <div className="total-students">
          <span>Students</span> <strong>{students}</strong>
        </div>
      </div>
    </div>
  );
};
export default GroupCard;
