import { useEffect, useState, useCallback } from "react";
import "./manageRoles.css";
import { motion } from "framer-motion";
import { Plus, Search, Building2, ArrowLeft } from "lucide-react";
import axios from "axios";
import RoleCard from "../../../../components/admin/roles/roleCard";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const ManageRoles = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRoles = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/AcademyGet/GetAllRoles`
      );

      if (response?.data?.status) {
        setRoles(response.data.roles);
      } else {
        console.log(response?.data?.message);
        setRoles([]);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setRoles([]);
    }
  }, [API_ENDPOINT]);
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const openAddRoleModal = async (newRoleName) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/AcademyAdd/AddRole`,
        {
          roleName: newRoleName,
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
        await fetchRoles();
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

  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(searchQuery.toLowerCase())
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
              <h2 className="admin-header-text">Manage Roles</h2>
            </div>
          </div>
          <button
            className="btn academic-button"
            onClick={() => {
              Swal.fire({
                title: "Add New Role",
                input: "text",
                inputLabel: "Role Name",
                showCancelButton: true,
                confirmButtonText: `Save`,
                confirmButtonColor: "#16a34a",
                cancelButtonText: "Cancel",
                customClass: { popup: "my-swal-theme" },
              }).then(async (result) => {
                if (result.isConfirmed && result.value?.trim()) {
                  await openAddRoleModal(result.value);
                }
              });
            }}
          >
            <Plus className="icon" /> Add New Role
          </button>
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
              placeholder="Search Roles..."
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
        className="roles-grid"
      >
        {filteredRoles.map((role) => (
          <RoleCard
            key={role.roleId}
            id={role.roleId}
            roleName={role.roleName}
            numOfUsers={role.userCount}
            createdAt={role.createdAt}
            refreshRoles={fetchRoles}
          />
        ))}
      </motion.div>

      {filteredRoles.length === 0 && (
        <div className="card no-data">
          <Building2 className="icon no-data-icon" />
          <p>No Roles found.</p>
        </div>
      )}
    </div>
  );
};

export default ManageRoles;
