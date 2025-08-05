import React from "react";
import Ribbon from "../../components/ribbon/ribbon";
import SideBar from "../../components/lecturer/lectureSidebar/sidebar";
import { Outlet } from "react-router-dom";
import "./lecturerLayout.css";
import { Toaster } from "react-hot-toast";

function LecturerLayout() {
  return (
    <div className="lecturer-layout-container">
      <Toaster />
      <Ribbon />
      <div className="lecturer-pages-container">
        <SideBar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LecturerLayout;
