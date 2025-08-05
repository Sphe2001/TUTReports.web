import { useLocation, useNavigate } from "react-router-dom";
import NotificationDetail from "./notificationDetail";

const NotificationDetailWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const notification = location.state?.notification;

  if (!notification) {
    return <p>No notification data provided.</p>;
  }

  const handleBack = () => navigate(-1);
  const handleSendReply = (reply) => {
    console.log("Reply sent:", reply);
  };

  return (
    <NotificationDetail
      notification={notification}
      onBack={handleBack}
      onSendReply={handleSendReply}
    />
  );
};

export default NotificationDetailWrapper;
