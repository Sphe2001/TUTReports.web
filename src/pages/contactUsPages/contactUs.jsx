import { useState } from "react";

import "./contactUs.css";
import toast, { Toaster } from "react-hot-toast";
import NavigationBar from "../navigationPages/navigationBar";
import axios from "axios";
import BackgroundImage from "../../assets/illustration.jpg";

const ContactUs = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;

  const [userName, setUserName] = useState("");
  const [userSurname, setUserSurname] = useState("");
  const [userEmail, setEmail] = useState("");
  const [userMessage, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/ContactUs/ContactUs`,
        {
          userName,
          userSurname,
          email: userEmail,
          message: userMessage,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status) {
        toast.success(response.data.message || "Message sent successfully!");
        setUserName("");
        setUserSurname("");
        setEmail("");
        setMessage("");
      } else {
        toast.error(response.data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div
      className="contact-page"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
        padding: "20px",
      }}
    >
      <Toaster />
      <NavigationBar />

      <div className="contact-container">
        <h2 className="contact-title">Contact Us</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">First Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="userSurname">Last Name</label>
            <input
              type="text"
              id="userSurname"
              name="userSurname"
              value={userSurname}
              onChange={(e) => setUserSurname(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userEmail}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={userMessage}
              onChange={(e) => setMessage(e.target.value)}
              className="form-textarea"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="form-button send-btn">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
