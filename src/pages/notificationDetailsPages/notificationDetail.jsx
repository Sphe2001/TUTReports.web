import { useState } from "react";
import { ArrowLeft, Mail, Send, User } from "lucide-react";
import axios from "axios";
import "./notificationDetail.css";
//import DarkModeToggle from "../../themeToggle/darkModeToggle";

const NotificationDetail = ({ notification, onBack, onSendReply }) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [reply, setReply] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendReply = async () => {
    if (!reply.trim()) return;

    setIsSending(true);

    try {
      await axios.post(
        `${API_ENDPOINT}/api/ContactUs/ReplyQuery`,
        {
          contactUsId: notification.notificationId,
          replyMessage: reply,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      onSendReply(reply);
      setReply("");
    } catch (error) {
      console.error("Failed to send reply:", error);
      alert("Failed to send reply. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="notification-detail">
      <header className="detail-header">
        <div className="detail-header-content">
          <h2 className="detail-title">Message Details</h2>
        </div>

        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
          Back
        </button>
      </header>

      <main className="detail-main">
        <div className="message-card">
          <div className="message-header">
            <div className="sender-info">
              <div className="sender-avatar">
                <User size={20} />
              </div>
              <div className="sender-details">
                <div className="sender-header">
                  <h2 className="sender-full-name">
                    {notification.senderName} {notification.senderSurname}
                  </h2>
                  <span className="message-date">{currentDate}</span>
                </div>
                <p className="sender-email">{notification.senderEmail}</p>
              </div>
            </div>
          </div>

          <div className="message-content">
            <h3 className="message-label">
              <Mail size={20} />
              Message
            </h3>
            <div className="message-text">
              <p className="message-body">{notification.message}</p>
            </div>
          </div>

          <div className="reply-section">
            <h3 className="reply-title">Reply</h3>
            <div className="reply-form">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={`Reply to ${notification.senderName}...`}
                className="reply-textarea"
                maxLength={500}
              />
              <div className="reply-footer">
                <p className="character-count">{reply.length}/500 characters</p>
                <button
                  onClick={handleSendReply}
                  disabled={!reply.trim() || isSending || reply.length > 500}
                  className="send-button"
                >
                  {isSending ? (
                    <>
                      <div className="loading-spinner"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationDetail;
