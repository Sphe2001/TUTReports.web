import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart2,
  Settings,
  LogOut,
  BookOpenCheck,
  BookText,
  LibraryBig,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import "./hodDashboardSidebar.css";
import Swal from "sweetalert2";

const HodDashboardSidebar = ({ closeSidebar }) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const navigate = useNavigate();
  const location = useLocation();

  const adminNavItems = useMemo(
    () => [
      { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard/reviewer" },
      {
        name: "All Reports",
        icon: LibraryBig,
        path: "/view-reports",
      },

      {
        name: "Pending Reports",
        icon: BookText,
        path: "/pending-reports",
      },

      {
        name: "Reviewed Reports",
        icon: BookOpenCheck,
        path: "/reviewed-reports",
      },
      {
        name: "Report Statistics",
        icon: BarChart2,
        path: "/report-stats",
      },
    ],
    []
  );

  const [openDropdown, setOpenDropdown] = useState(null);
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
      const inSubItem = item.subItems?.some((sub) =>
        location.pathname.startsWith(sub.path)
      );
      if (!inSubItem && item.subItems?.length > 0) {
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
          <Link to="/reviewer-profile" className="action-link">
            <Settings className="action-icon" />
            {!collapsed && "Settings"}
          </Link>
          <button className="action-link" onClick={handleLogout}>
            <LogOut className="action-icon" />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HodDashboardSidebar;
