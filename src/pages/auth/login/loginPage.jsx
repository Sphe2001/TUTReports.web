import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";

import "./loginPage.css";

import BackgroundImage from "../../../assets/illustration.jpg";
import AnotherIcon from "../../../assets/TUT_Logo.png";

import { useRole } from "../../../contexts/RoleContext";

const LoginPage = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setRole } = useRole();

  const validateLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/Auth/Login`,
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status) {
        const roleFromBackend = response.data.role;
        sessionStorage.setItem("userRole", roleFromBackend);
        setRole(roleFromBackend);
        toast.success(response.data.message);

        if (response.data.otpRequired) {
          navigate("/verify/login-otp");
        }

        navigate(response.data.url);
      } else {
        toast.error(response.data.message || "Login failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Toaster />
      <div className="login-box">
        <div className="login-branding">
          <img className="login-logo" alt="TUT icon" src={AnotherIcon} />
        </div>
        <div className="login-title-container">
          <h1 className="login-page-title">Sign In</h1>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            validateLogin();
          }}
          className="login-form"
        >
          <div className="login-form-group">
            <label htmlFor="email">Enter Email:</label>
            <div className="login-form-input-container">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                required
              />
            </div>

            <label htmlFor="password">Password:</label>
            <div className="login-form-input-container">
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
                required
              />
              <button
                type="button"
                className="login-toggle-visibility"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <EyeSlashIcon className="login-icon" />
                ) : (
                  <EyeIcon className="login-icon" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={isloading}
          >
            {isloading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="spinner"></span> Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="login-back-link">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
