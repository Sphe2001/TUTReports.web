import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  Settings,
  LogOut,
  ShieldUser,
  Building2,
  MessageSquare,
  UserPlus,
  UserCog,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import "./adminSideBar.css";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

function AdminSideBar({ closeSidebar }) {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const navigate = useNavigate();
  const location = useLocation();

  const adminNavItems = useMemo(
    () => [
      { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard/admin" },
      {
        name: "Manage Users",
        icon: UserPlus,
        path: "/manage-users",
        subItems: [
          { name: "Users", path: "/manage-users" },
          { name: "Add User", path: "/manage-users/add-user" },
          { name: "Lecturers", path: "/manage-users/users/view/lecturers" },
          { name: "Reviewers", path: "/manage-users/users/view/reviewers" },
        ],
      },
      {
        name: "Assign Academics",
        icon: UserCog,
        path: "/assign/academic/properties",
      },
      { name: "Roles", icon: ShieldUser, path: "/manage-roles" },
      { name: "Departments", icon: Building2, path: "/manage-departments" },
      { name: "Modules", icon: GraduationCap, path: "/manage-modules" },
      { name: "Student Groups", icon: Users, path: "/manage-groups" },
      {
        name: "Communication Channels",
        icon: MessageSquare,
        path: "/manage-channels",
      },
    ],
    []
  );

  const [openDropdown, setOpenDropdown] = useState(null);

  // Add collapsed state
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const currentDropdown = adminNavItems.find(
      (item) =>
        item.subItems &&
        item.subItems.some((sub) => location.pathname.startsWith(sub.path))
    );
    if (currentDropdown) {
      setOpenDropdown(currentDropdown.name);
    } else {
      setOpenDropdown(null);
    }
  }, [location.pathname, adminNavItems]);

  const handleDropdownClick = (item) => {
    const isOpen = openDropdown === item.name;

    if (!isOpen) {
      const inSubItem = item.subItems.some((sub) =>
        location.pathname.startsWith(sub.path)
      );
      if (!inSubItem && item.subItems.length > 0) {
        navigate(item.subItems[0].path);
      }
    }

    setOpenDropdown(isOpen ? null : item.name);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your session.",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        popup: "my-swal-theme",
      },
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            `${API_ENDPOINT}/api/Auth/Logout`,
            {},
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          )
          .then((response) => {
            toast.success(response.data.message);
            navigate("/login");
          })
          .catch((error) => {
            toast.error("Unable to logout");
            console.error(error);
          });
      }
    });
  };

  return (
    <div className={`sidebar-container${collapsed ? " collapsed" : ""}`}>
      <div className="sidebar-main">
        <nav className="sidebar-nav">
          <div className="sidebar-hamburger-wrapper">
            <button
              className="sidebar-hamburger"
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <Menu className="sidebar-icon" size={30} />
              ) : (
                <PanelLeftClose className="sidebar-icon" size={30} />
              )}
            </button>
          </div>
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isDropdownOpen = openDropdown === item.name;
            const hasDropdown = item.subItems && item.subItems.length > 0;

            return (
              <div key={item.name}>
                {hasDropdown ? (
                  <div
                    className={`sidebar-link ${isDropdownOpen ? "active" : ""}`}
                    onClick={() => handleDropdownClick(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <item.icon
                      className={`sidebar-icon ${
                        isDropdownOpen ? "active-icon" : ""
                      }`}
                    />
                    {!collapsed && <span>{item.name}</span>}
                    {isDropdownOpen && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="sidebar-indicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                    onClick={closeSidebar}
                  >
                    <item.icon
                      className={`sidebar-icon ${
                        isActive ? "active-icon" : ""
                      }`}
                    />
                    {!collapsed && <span>{item.name}</span>}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="sidebar-indicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                )}

                {hasDropdown && isDropdownOpen && (
                  <motion.div
                    layoutId="admin-dropdown-links"
                    className="admin-dropdown-links"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.subItems.map((sub) => {
                      const toProp = sub.state
                        ? { pathname: sub.path, state: sub.state }
                        : sub.path;

                      return (
                        <Link
                          key={sub.name}
                          to={toProp}
                          className={`admin-dropdown-link-item ${
                            location.pathname === sub.path ? "active-blue" : ""
                          }`}
                          onClick={closeSidebar}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-actions">
          <Link to="/admin/settings" className="admin-action-link">
            <Settings className="action-icon" />
            {!collapsed && "Settings"}
          </Link>

          <button className="admin-action-link" onClick={handleLogout}>
            <LogOut className="action-icon" />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSideBar;
