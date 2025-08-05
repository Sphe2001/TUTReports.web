import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import "./verifyLoginOtp.css";
import BackgroundImage from "../../../assets/illustration.jpg";

const VerifyLogInOTPPage = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  const handleVerifyLoginOTP = async () => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/Auth/VerifyLogInOTP`,
        {
          otp,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        toast.success(response?.data.message);
        navigate(response?.data?.url);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/Auth/ResendLoginOtp`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.status) {
        toast.success("OTP has been sent");
        setCooldown(90);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    if (cooldown === 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  return (
    <div
      className="login-otp-container"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Toaster />
      <div className="login-otp-box">
        <h1 className="login-otp-title">Verify Login OTP</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerifyLoginOTP();
          }}
          className="login-otp-form"
        >
          <div className="login-otp-form-group">
            <label htmlFor="email">Enter OTP sent to your email: </label>
            <input
              id="otp"
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="login-otp-input"
              required
            />
          </div>

          <button type="submit" className="login-otp-submit-btn">
            Verify OTP
          </button>
        </form>

        <div
          className={`login-otp-back-link ${cooldown > 0 ? "disabled" : ""}`}
          onClick={handleResendOTP}
          style={{
            cursor: cooldown > 0 ? "not-allowed" : "pointer",
            opacity: cooldown > 0 ? 0.5 : 1,
          }}
        >
          {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
        </div>
      </div>
    </div>
  );
};

export default VerifyLogInOTPPage;
