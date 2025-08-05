import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./verifyPasswordResetOtp.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import BackgroundImage from "../../../assets/illustration.jpg";

function VerifyPasswordResetOTPPage() {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/Auth/VerifyResetPasswordOtp`,
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
        toast.success(response.data.message);
        console.log(response);
        navigate("/reset-password");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/Auth/ResendForgotPasswordOtp`,
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
      className="password-reset-otp-container"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Toaster />
      <div className="password-reset-otp-box">
        <h1 className="password-reset-otp-title">Verify Reset Password OTP</h1>

        <form onSubmit={handleVerify} className="password-reset-otp-form">
          <div className="password-reset-otp-form-group">
            <label htmlFor="email">Enter OTP sent to your email: </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="password-reset-otp-submit-btn">
            Verify OTP
          </button>
        </form>

        <div
          className={`password-reset-otp-back-link ${
            cooldown > 0 ? "disabled" : ""
          }`}
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
}

export default VerifyPasswordResetOTPPage;
