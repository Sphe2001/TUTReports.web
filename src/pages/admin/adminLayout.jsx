import React from "react";
import Ribbon from "../../components/ribbon/ribbon";
import AdminSideBar from "../../components/admin/adminSideBar/adminSideBar";
import { Outlet } from "react-router-dom";
import "./adminLayout.css";
import { Toaster } from "react-hot-toast";

function AdminLayout() {
  return (
    <div className="layout-container">
      <Toaster />
      <Ribbon />
      <div className="pages-container">
        <AdminSideBar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
