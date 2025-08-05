import React from "react";
import Ribbon from "../../components/ribbon/ribbon";
import HodDashboardSidebar from "../../components/reviewer/hodDashboardSidebar/hodDashboardSidebar";
import { Outlet } from "react-router-dom";
import "./reviewerLayout.css";
import { Toaster } from "react-hot-toast";

function ReviewerLayout() {
  return (
    <div className="reviewer-layout-container">
      <Toaster />
      <Ribbon />
      <div className="reviewer-pages-container">
        <HodDashboardSidebar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ReviewerLayout;
