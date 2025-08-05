import "./moduleCard.css";
import { BookOpen, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const ModuleCard = ({
  id,
  moduleName,
  moduleCode,
  department,
  groups,
  refreshModules,
}) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const openEditModal = async (id, newModuleName, newModuleCode) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/AcademyEdit/EditModule`,
        {
          moduleId: id,
          newModuleName: newModuleName,
          newModuleCode: newModuleCode,
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
        await refreshModules();
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
        `${API_ENDPOINT}/api/AcademyRemove/DeleteModule/${id}`,
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
        await refreshModules();
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
    <div key={id} className="card module-card">
      <div className="module-card-header">
        <div className="module-card-info">
          <div className="module-card-icon-box">
            <BookOpen className="module-card-icon" />
          </div>
          <div className="module-card-info-text">
            <span>{moduleCode}</span>
            <p>{department}</p>
          </div>
        </div>
        <div className="module-card-action-buttons">
          <button
            onClick={() => {
              Swal.fire({
                text: `You are about to edit this module.`,
                icon: "info",
                html: `
                  <div class="swal-container">
                    <div class="swal-label-input-container">
                      <label for="module-name">Module Name</label>
                      <input type="text" id="module-name" class="swal2-input" value="${moduleName}" />
                    </div>
                    
                    <div class="swal-label-input-container">
                      <label for="module-code">Module Code</label>
                      <input type="text" id="module-code" class="swal2-input" value="${moduleCode}" />
                    </div>
                  </div>
                `,
                showCancelButton: true,
                confirmButtonText: `Save`,
                confirmButtonColor: "#16a34a",
                cancelButtonText: "Cancel",
                focusConfirm: false,
                preConfirm: () => {
                  const newModuleName =
                    document.getElementById("module-name").value;
                  const newModuleCode =
                    document.getElementById("module-code").value;

                  if (!newModuleName || !newModuleCode) {
                    Swal.showValidationMessage("All fields are required");
                    return false;
                  }

                  return { newModuleName, newModuleCode };
                },
                customClass: { popup: "my-swal-theme" },
              }).then(async (result) => {
                if (result.isConfirmed) {
                  const { newModuleName, newModuleCode } = result.value;
                  await openEditModal(id, newModuleName, newModuleCode);
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
                text: `You are about to delete this module.`,
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
      <div className="module-card-details">
        <div className="module-name">
          <strong>{moduleName}</strong>
        </div>
        <div className="student-group-count">
          <span>student groups</span> <strong>{groups}</strong>
        </div>
      </div>
    </div>
  );
};
export default ModuleCard;
