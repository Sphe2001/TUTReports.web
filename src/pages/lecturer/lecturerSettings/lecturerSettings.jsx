import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import {
  User,
  Lock,
  Phone,
  UploadCloud,
  RefreshCcw,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./lecturerSettings.css";
import DefaultProfilePic from "../../../assets/defaultProfilePicture.png";

const LecturerSettings = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [profile, setProfile] = useState(DefaultProfilePic);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [newContact, setNewContact] = useState("");
  const [department, setDepartment] = useState("");
  const [roleName, setRoleName] = useState("");
  const [staffNumber, setStaffNumber] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toLocaleDateString()
  );
  const [country, setCountry] = useState("za");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentDateTime(new Date().toLocaleDateString()),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}/api/UserProfile/GetProfile`,
          { withCredentials: true }
        );
        const data = response.data;
        if (data.status) {
          setName(data.name);
          setSurname(data.surname);
          setEmail(data.email);
          setContact(data.contact || "");
          setDepartment(data.department || "");
          setRoleName(data.roleName || "");
          setStaffNumber(data.staffNumber || "");
          if (data.profilePictureUrl) setProfile(data.profilePictureUrl);
        } else {
          toast.error(data.message || "Failed to load profile");
        }
      } catch {
        toast.error("Error fetching profile");
      }
    };

    const getProfilePicture = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}/api/UserProfile/ViewProfilePicture`,
          {
            withCredentials: true,
            responseType: "blob",
          }
        );
        setProfile(URL.createObjectURL(response.data));
      } catch {
        setProfile(DefaultProfilePic);
      }
    };

    fetchProfile();
    getProfilePicture();
  }, [API_ENDPOINT]);

  const handleUploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("ProfilePicture", file);

    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/UserProfile/UploadProfilePicture`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (response.data.status) {
        const newUrl = URL.createObjectURL(file);
        setProfile(newUrl);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Failed to upload");
      }
    } catch {
      toast.error("Error uploading profile picture");
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return toast.error("Only image files allowed");
    if (file.size > 2 * 1024 * 1024) return toast.error("Image must be <2MB");
    handleUploadProfilePicture(file);
  };

  const resetToDefault = async () => {
    try {
      const response = await axios.delete(
        `${API_ENDPOINT}/api/UserProfile/DeleteProfilePicture`,
        { withCredentials: true }
      );
      if (response.data.status) {
        setProfile(DefaultProfilePic);
        toast.success("Profile picture reset.");
      } else toast.error("Failed to reset.");
    } catch {
      toast.error("Error resetting profile picture");
    }
  };

  const isValidPhoneNumber = (number, countryCode) => {
    try {
      const parsed = parsePhoneNumberFromString(
        number,
        countryCode.toUpperCase()
      );
      return (
        parsed?.isValid() &&
        parsed?.country?.toLowerCase() === countryCode.toLowerCase()
      );
    } catch {
      return false;
    }
  };

  const handleUpdatePhoneNumber = async (e) => {
    e.preventDefault();
    if (!newContact) return toast.error("Enter a phone number");
    const formatted = newContact.startsWith("+")
      ? newContact
      : `+${newContact}`;
    if (!isValidPhoneNumber(formatted, country))
      return toast.error("Invalid number");
    if (formatted === contact) return toast.error("Same as current number");
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/UserProfile/UpdatePhoneNumber`,
        { contact: formatted },
        { withCredentials: true }
      );
      if (response.data.status) {
        toast.success("Phone updated");
        setContact(formatted);
        setNewContact("");
      } else toast.error(response.data.message);
    } catch {
      toast.error("Error updating phone");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword)
      return toast.error("All fields required");
    if (currentPassword === newPassword)
      return toast.error("New password must differ");
    if (!passwordRegex.test(newPassword)) return toast.error("Weak password");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords don't match");

    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/UserProfile/ChangePassword`,
        { currentPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );
      if (response.data.status) {
        toast.success(response.data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        await axios.post(
          `${API_ENDPOINT}/api/Auth/Logout`,
          {},
          { withCredentials: true }
        );
        setTimeout(() => navigate("/login"), 2000);
      } else toast.error(response.data.message);
    } catch {
      toast.error("Error changing password");
    }
  };

  return (
    <div className="lecturer-settings">
      <Toaster position="top-center" />
      <div className="datetime-header">
        <h2 className="page-title">Lecturer Settings</h2>
        <p>{currentDateTime}</p>
      </div>

      {/* Profile Section */}
      <div className="form-section">
        <div className="form-header">
          <User className="form-icon" />
          <h2>Profile Information</h2>
        </div>
        <div className="profile-picture-section">
          <div className="picture-container">
            <img src={profile} alt="Profile" className="profile-image" />
          </div>
          <div className="picture-buttons">
            <button className="upload-btn">
              <UploadCloud /> Upload
              <input
                type="file"
                className="file-input"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </button>
            <button className="remove-btn" onClick={resetToDefault}>
              <RefreshCcw /> Remove Picture
            </button>
          </div>
        </div>
        <div className="settings-form">
          <div className="form-row">
            <div className="form-group">
              <label>Staff Number</label>
              <input className="form-input" value={staffNumber} readOnly />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input className="form-input" value={roleName} readOnly />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input className="form-input" value={name} readOnly />
            </div>
            <div className="form-group">
              <label>Surname</label>
              <input className="form-input" value={surname} readOnly />
            </div>
          </div>
          <div className="form-group">
            <label>Department</label>
            <input className="form-input" value={department} readOnly />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <form className="form-section" onSubmit={handleUpdatePhoneNumber}>
        <div className="form-header">
          <Phone className="form-icon" />
          <h2>Contact Information</h2>
        </div>
        <div className="settings-form">
          <div className="form-group">
            <label>Email</label>
            <input className="form-input" value={email} readOnly />
          </div>
          <div className="form-group">
            <label>Current Contact</label>
            <input
              className="form-input"
              value={contact || "Not provided"}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>New Contact</label>
            <PhoneInput
              country={country}
              value={newContact}
              inputClass="form-input"
              buttonClass="lecturer-phone-flag-button"
              onChange={(phone, countryData) => {
                setNewContact(phone);
                setCountry(countryData.countryCode);
              }}
            />
          </div>
          <button type="submit" className="save-btn">
            <Save /> Update Contact
          </button>
        </div>
      </form>

      {/* Password Section */}
      <form className="form-section" onSubmit={changePassword}>
        <div className="form-header">
          <Lock className="form-icon" />
          <h2>Change Password</h2>
        </div>
        <div className="settings-form">
          <div className="form-group">
            <label>Current Password</label>
            <div style={{ display: "flex" }}>
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>New Password</label>
            <div style={{ display: "flex" }}>
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
              />
              <button type="button" onClick={() => setShowNew(!showNew)}>
                {showNew ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <div style={{ display: "flex" }}>
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <button type="submit" className="save-btn">
            <Save /> Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default LecturerSettings;
