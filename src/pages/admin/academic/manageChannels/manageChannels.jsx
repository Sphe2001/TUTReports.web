import { useEffect, useState } from "react";
import "./manageChannels.css";
import { motion } from "framer-motion";
import { Plus, Search, Building2 } from "lucide-react";
import axios from "axios";
import ChannelCard from "../../../../components/admin/communicationChannels/channelCard";
import Swal from "sweetalert2";

const ManageChannels = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [channels, setChannels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchChannels = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}/api/AcademyGet/GetAllCommunicationChannels`
      );

      if (response?.data?.status) {
        setChannels(response.data.channels);
      } else {
        console.log(response?.data?.message);
        setChannels([]);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "An error occurred");
      setChannels([]);
    }
  };
  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const openAddChannelModal = async (newChannelName) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/AcademyAdd/AddChannel`,
        {
          name: newChannelName,
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
        await fetchChannels();
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

  const openImportChannelsModal = async (file) => {
    const formData = new FormData();
    formData.append("communicationChannelsFile", file);
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/Import/ImportCommunicationChannels`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            withCredentials: true,
          },
        }
      );

      if (response?.data?.status) {
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          customClass: { popup: "my-swal-theme" },
        });
        await fetchChannels();
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

  // ✅ Filter channels
  const filteredChannels = channels.filter((channel) =>
    channel.channelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="manage-container">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="manage-header-container">
          <div>
            <h2 className="admin-header-text">Manage Channels</h2>
          </div>
          <div className="add-academic-button-container">
            <button
              className="btn academic-button"
              onClick={() => {
                Swal.fire({
                  title: "Add New Communication Channel",
                  input: "text",
                  inputLabel: "Channel Name",
                  showCancelButton: true,
                  confirmButtonText: `Save`,
                  confirmButtonColor: "#16a34a",
                  cancelButtonText: "Cancel",
                  customClass: { popup: "my-swal-theme" },
                }).then(async (result) => {
                  if (result.isConfirmed && result.value?.trim()) {
                    await openAddChannelModal(result.value);
                  }
                });
              }}
            >
              <Plus className="icon" /> Add New Channel
            </button>
            <button
              className="btn academic-button"
              onClick={async () => {
                const { value: file } = await Swal.fire({
                  title: "Import Channels",
                  input: "file",
                  inputLabel: "Upload Channels file (.csv or .xlsx)",
                  inputAttributes: {
                    accept: ".csv, .xlsx",
                    "aria-label": "Upload your file",
                  },
                  showCancelButton: true,
                  confirmButtonText: `Upload`,
                  confirmButtonColor: "#16a34a",
                  cancelButtonText: "Cancel",
                  customClass: { popup: "my-swal-theme" },
                  preConfirm: (file) => {
                    if (!file) {
                      Swal.showValidationMessage("Please select a file");
                      return false;
                    }
                    return file;
                  },
                });
                if (file) {
                  await openImportChannelsModal(file);
                }
              }}
            >
              <Plus className="icon" /> Import Channels
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card search-filter"
      >
        <div className="lecturers-list-search-container">
          <div className="admin-search-box">
            <div className="admin-search-icon">
              <Search className="icon" />
            </div>
            <input
              type="search"
              placeholder="Search Channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="channels-grid"
      >
        {filteredChannels.map((channel) => (
          <ChannelCard
            key={channel.channelId}
            id={channel.channelId}
            channelName={channel.channelName}
            messagesCount={channel.messageCount}
            createdAt={channel.createdAt}
            refreshChannels={fetchChannels}
          />
        ))}
      </motion.div>

      {filteredChannels.length === 0 && (
        <div className="card no-data">
          <Building2 className="icon no-data-icon" />
          <p>No Channels found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default ManageChannels;
