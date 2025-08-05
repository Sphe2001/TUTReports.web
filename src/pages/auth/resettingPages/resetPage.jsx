import { useState } from "react";
import "./resetPage.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import BackgroundImage from "../../../assets/illustration.jpg";

export const ResetPasswordPage = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    lengthError: "",
    numberError: "",
    letterError: "",
    specialCharError: "",
    matchError: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const validatePasswordLength = (pwd) => pwd.length >= 8;
  const validatePasswordNumber = (pwd) => /\d/.test(pwd);
  const validatePasswordLetter = (pwd) => /[a-zA-Z]/.test(pwd);
  const validatePasswordSpecialChar = (pwd) => /[^a-zA-Z0-9\s]/g.test(pwd);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    setError({
      lengthError: "",
      numberError: "",
      letterError: "",
      specialCharError: "",
      matchError: "",
    });

    let isValid = true;

    if (!validatePasswordLength(newPassword)) {
      setError((prev) => ({
        ...prev,
        lengthError: "Password must be at least 8 characters long.",
      }));
      isValid = false;
    }

    if (!validatePasswordNumber(newPassword)) {
      setError((prev) => ({
        ...prev,
        numberError: "Password must contain at least one number.",
      }));
      isValid = false;
    }

    if (!validatePasswordLetter(newPassword)) {
      setError((prev) => ({
        ...prev,
        letterError: "Password must contain at least one letter (a-z or A-Z).",
      }));
      isValid = false;
    }

    if (!validatePasswordSpecialChar(newPassword)) {
      setError((prev) => ({
        ...prev,
        specialCharError:
          "Password must contain at least one special character (e.g., @, #, &).",
      }));
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await axios.post(
          `${API_ENDPOINT}/api/Auth/ResetPassword`,
          {
            NewPassword: newPassword,
            ConfirmPassword: confirmPassword,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response?.data.status) {
          toast.success(response?.data.message);
          navigate("/login");
        } else {
          toast.error(response?.data.message || "Reset failed.");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div
      className="reset-password-container"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Toaster />
      <div className="reset-password-box">
        <h1 className="reset-password-title">Reset Password</h1>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="reset-password-form-group">
            <label htmlFor="password">Enter password: </label>
            <div className="reset-password-form-input-container">
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
                required
              />
              <button
                type="button"
                className="reset-password-toggle-visibility"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <EyeSlashIcon className="reset-password-icon" />
                ) : (
                  <EyeIcon className="reset-password-icon" />
                )}
              </button>
            </div>
            {error.lengthError && (
              <p className="error-message">{error.lengthError}</p>
            )}
            {error.numberError && (
              <p className="error-message">{error.numberError}</p>
            )}
            {error.letterError && (
              <p className="error-message">{error.letterError}</p>
            )}
            {error.specialCharError && (
              <p className="error-message">{error.specialCharError}</p>
            )}

            <label htmlFor="confirmPassword">Confirm password: </label>
            <div className="reset-password-form-input-container">
              <input
                id="confirmPassword"
                type={confirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="confirm-password-input"
                required
              />
              <button
                type="button"
                className="reset-password-toggle-visibility"
                onClick={toggleConfirmPasswordVisibility}
              >
                {confirmPasswordVisible ? (
                  <EyeSlashIcon className="reset-password-icon" />
                ) : (
                  <EyeIcon className="reset-password-icon" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="reset-password-submit-btn"
            disabled={isloading}
          >
            {isloading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="spinner"></span> Loading...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="reset-password-password-rules">
          <h3>Password Requirements:</h3>
          <ul>
            <li>Password must be 8 characters or more.</li>
            <li>Password must contain both numbers and letters.</li>
            <li>
              Password must contain at least one special character (e.g., @, #,
              &).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
