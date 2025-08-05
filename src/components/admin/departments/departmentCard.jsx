import "./departmentCard.css";
import { Building2, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const DepartmentCard = ({
  id,
  departmentName,
  numOfLecturers,
  numOfModules,
  refreshDepartments,
}) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const openEditModal = async (id, newDepartmentName) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/AcademyEdit/EditDepartment`,
        {
          departmentId: id,
          newDepartmentName: newDepartmentName,
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
        await refreshDepartments();
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
        `${API_ENDPOINT}/api/AcademyRemove/DeleteDepartment/${id}`,
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
        await refreshDepartments();
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
    <div key={id} className="card department-card">
      <div className="department-card-header">
        <div className="department-card-info">
          <div className="department-card-icon-box">
            <Building2 className="department-card-icon" />
          </div>
          <div className="department-card-info-text">
            <h3>{departmentName}</h3>
          </div>
        </div>
        <div className="department-card-action-buttons">
          <button
            onClick={() => {
              Swal.fire({
                text: `You are about to edit this department.`,
                icon: "info",
                input: "text",
                inputLabel: "Department Name",
                inputValue: departmentName,
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
                text: `You are about to delete this department.`,
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
      <div className="department-card-details">
        <div className="department-detail-container">
          <span>Modules:</span> <strong>{numOfModules}</strong>
        </div>
        <div className="department-detail-container">
          <span>Lecturers:</span> <strong>{numOfLecturers}</strong>
        </div>
      </div>
    </div>
  );
};
export default DepartmentCard;
