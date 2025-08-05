import "./channelCard.css";
import { MessageSquare, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { format } from "date-fns";
import Swal from "sweetalert2";

const ChannelCard = ({
  id,
  channelName,
  messagesCount,
  createdAt,
  refreshChannels,
}) => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const openEditModal = async (id, newChannelName) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/AcademyEdit/EditCommEditChannel`,
        {
          communicationChannelsId: id,
          newCommunicationChannelsName: newChannelName,
        },
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
        await refreshChannels();
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

  const openDeleteModal = async (id) => {
    try {
      const response = await axios.delete(
        `${API_ENDPOINT}/api/AcademyRemove/DeleteChhannel/${id}`,
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
        await refreshChannels();
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
  return (
    <div key={id} className="card channel-card">
      <div className="channel-card-header">
        <div className="channel-card-info">
          <div className="channel-card-icon-box">
            <MessageSquare className="channel-card-icon" />
          </div>
          <div className="channel-card-info-text">
            <span>{channelName}</span>
          </div>
        </div>
        <div className="channel-card-action-buttons">
          <button
            onClick={() => {
              Swal.fire({
                text: `You are about to edit this channel.`,
                icon: "info",
                input: "text",
                inputLabel: "Channel Name",
                inputValue: channelName,
                showCancelButton: true,
                confirmButtonText: `Save`,
                confirmButtonColor: "#16a34a",
                cancelButtonText: "Cancel",
                customClass: { popup: "my-swal-theme" },
              }).then(async (result) => {
                if (result.isConfirmed && result.value?.trim()) {
                  await openEditModal(id, result.value);
                }
              });
            }}
            className="action-btn"
          >
            <Edit className="card-action-icon-edit" />
          </button>
          <button
            onClick={() => {
              Swal.fire({
                title: `Are you sure?`,
                text: `You are about to delete this channel.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: `Yes, Delete`,
                confirmButtonColor: "#dc2626",
                cancelButtonText: "Cancel",
                customClass: { popup: "my-swal-theme" },
              }).then(async (result) => {
                if (result.isConfirmed) {
                  await openDeleteModal(id);
                }
              });
            }}
            className="action-btn delete"
          >
            <Trash2 className="card-action-icon-delete" />
          </button>
        </div>
      </div>
      <div className="channel-card-details">
        <div className="card-messages-container">
          <span>Activity: </span>
          <strong>{messagesCount}</strong>
        </div>

        <div className="card-date-container">
          <span>Created: </span>
          <span>{format(new Date(createdAt), "yyyy/MM/dd")}</span>
        </div>
      </div>
    </div>
  );
};
export default ChannelCard;
