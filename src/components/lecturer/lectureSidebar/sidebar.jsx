import React from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ClipboardPlus,
  LogOut,
  Settings,
  NotepadTextDashed,
  NotepadText,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";
import "./sidebar.css";
import Swal from "sweetalert2";

function SideBar({ closeSidebar }) {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const location = useLocation();

  const adminNavItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard/lecturer" },
    { name: "Create Report", icon: ClipboardPlus, path: "/weekly-report" },
    { name: "My Reports", icon: NotepadText, path: "/report-history" },
    { name: "My Drafts", icon: NotepadTextDashed, path: "/lecturer-drafts" },
  ];

  let navItems = adminNavItems;

  const navigate = useNavigate();

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
    <div className="lecturer-sidebar-container">
      <Toaster />
      <div className="lecturer-sidebar-main">
        <nav className="lecturer-sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`lecturer-sidebar-link ${isActive ? "active" : ""}`}
                onClick={closeSidebar}
              >
                <item.icon
                  className={`lecturer-sidebar-icon ${
                    isActive ? "active-icon" : ""
                  }`}
                />
                <span>{item.name}</span>

                {isActive && (
                  <motion.div
                    layoutId="lecturer-sidebar-indicator"
                    className="lecturer-sidebar-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="lecturer-sidebar-footer">
        <div className="lecturer-sidebar-actions">
          <Link to="/lecture/settings" className="action-link">
            <Settings className="action-icon" />
            Settings
          </Link>
          <button className="action-link" onClick={handleLogout}>
            <LogOut className="action-icon" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
