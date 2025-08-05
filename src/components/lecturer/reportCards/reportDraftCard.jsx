import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import "./reportDraftCard.css";
import Swal from "sweetalert2";
import axios from "axios";
import { motion } from "framer-motion";

const ReportDraftCard = ({ draft, refreshDrafts }) => {
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
  const openDeleteModal = async (id) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/LecturerReports/DeleteDraft`,
        { draftId: id },
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
        await refreshDrafts();
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
  const getStatusClass = (status) => {
    switch (status) {
      case true:
        return "Draft";
      default:
        return "Draft";
    }
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case true:
        return "status-span-draft";
      default:
        return "status-span-draft";
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      key={draft.draftId}
      className="report-history-card"
    >
      <div className="report-header">
        <div>
          <div className="report-title-row">
            <h3 className="report-title">
              {draft.module} - {draft.moduleCode}
            </h3>
            <span className={getStatusStyle(true)}>{getStatusClass(true)}</span>
          </div>
          <div className="report-date">
            <Calendar className="icon-small" />
            <span>
              {draft.startDate} to {draft.endDate}
            </span>
          </div>
          <p className="report-summary">{draft.weeklyActivity}</p>
        </div>

        <div className="report-actions">
          <Link
            to={`/editDraft/${draft.draftId}`}
            className="report-btn-icon"
            title="Edit Report"
          >
            <Edit className="icon-medium" />
          </Link>

          <button
            onClick={() => {
              Swal.fire({
                title: `Are you sure?`,
                text: `You are about to delete this draft.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: `Yes, Delete`,
                confirmButtonColor: "#dc2626",
                cancelButtonText: "Cancel",
                customClass: { popup: "my-swal-theme" },
              }).then(async (result) => {
                if (result.isConfirmed) {
                  await openDeleteModal(draft.draftId);
                }
              });
            }}
            className="delete-draft-btn"
          >
            <Trash2 className="icon-medium" />
          </button>
        </div>
      </div>

      <div className="report-footer">
        <div className="footer-info">
          <span className="separator">•</span>
          <span>
            Created on {format(new Date(draft.draftedDate), "MMM d, yyyy")}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportDraftCard;
