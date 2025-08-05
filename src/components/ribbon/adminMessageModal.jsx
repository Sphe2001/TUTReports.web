// src/components/modals/AdminMessageModal.jsx
import Swal from "sweetalert2";
import axios from "axios";
import { Calendar, User, MessageCircle, Edit } from "lucide-react";
import "./adminMessageModal.css";
import ReactDOMServer from "react-dom/server";

export const showAdminMessageModal = async (note) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const formatDate = (timestamp) =>
    timestamp
      ? new Date(timestamp).toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Unknown date";

  const icons = {
    calendar: ReactDOMServer.renderToStaticMarkup(
      <Calendar className="modal-icon" />
    ),
    user: ReactDOMServer.renderToStaticMarkup(<User className="modal-icon" />),
    message: ReactDOMServer.renderToStaticMarkup(
      <MessageCircle className="modal-icon" />
    ),
    edit: ReactDOMServer.renderToStaticMarkup(<Edit className="modal-icon" />),
  };

  const { value: replyMessage, isConfirmed } = await Swal.fire({
    title: "Message Details",
    html: `
    <div class="message-details">
      <div class="detail-section">
        <h4>${icons.calendar} Date Received:</h4>
        <p>${formatDate(note.dateCreated)}</p>
      </div>
      <div class="detail-section">
        <h4>${icons.user} From:</h4>
        <p>${note.Email || note.email || "No email provided"}</p>
      </div>
      <div class="detail-section">
        <h4>${icons.message} Message:</h4>
        <div class="message-content">
          <p>${note.message || "No message content"}</p>
        </div>
      </div>
      <div class="reply-section">
        <h4>${icons.edit} Your Reply</h4>
        <textarea id="replyMessage" placeholder="Type your reply here..." class="reply-textarea"></textarea>
      </div>
    </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Send Reply",
    cancelButtonText: "Close",
    confirmButtonColor: "#007bff",
    cancelButtonColor: "#6c757d",
    width: "600px",
    preConfirm: () => {
      const reply = document.getElementById("replyMessage").value;
      if (!reply.trim()) {
        Swal.showValidationMessage("Please enter a reply message");
        return false;
      }
      return reply.trim();
    },
  });

  if (isConfirmed && replyMessage) {
    // Show loading
    Swal.fire({
      title: "Sending Reply...",
      text: "Please wait while we send your reply.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await axios.post(
        `${API_ENDPOINT}/api/ContactUs/ReplyQuery`,
        { contactUsId: note.notificationId, replyMessage },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      // Show success toast
      Swal.fire({
        icon: "success",
        title: "Reply Sent!",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        background: "#007bff",
        color: "#fff",
      });
    } catch (error) {
      console.error("Failed to send reply:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send reply. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#EF4444",
      });
    }
  }
};
