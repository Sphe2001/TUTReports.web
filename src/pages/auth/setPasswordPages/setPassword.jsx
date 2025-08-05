import { useState } from "react";
import "./setPassword.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import BackgroundImage from "../../../assets/illustration.jpg";

const SetPasswordPage = () => {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    lengthError: "",
    numberError: "",
    letterError: "",
    specialCharError: "",
    matchError: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePasswordLength = (pwd) => pwd.length >= 8;
  const validatePasswordNumber = (pwd) => /\d/.test(pwd);
  const validatePasswordLetter = (pwd) => /[a-zA-Z]/.test(pwd);
  const validatePasswordSpecialChar = (pwd) => /[^a-zA-Z0-9\s]/.test(pwd);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      lengthError: "",
      numberError: "",
      letterError: "",
      specialCharError: "",
      matchError: "",
    };

    let isValid = true;

    if (!validatePasswordLength(password)) {
      newErrors.lengthError = "Password must be at least 8 characters long.";
      isValid = false;
    }
    if (!validatePasswordNumber(password)) {
      newErrors.numberError = "Password must contain at least one number.";
      isValid = false;
    }
    if (!validatePasswordLetter(password)) {
      newErrors.letterError =
        "Password must contain at least one letter (a-z or A-Z).";
      isValid = false;
    }
    if (!validatePasswordSpecialChar(password)) {
      newErrors.specialCharError =
        "Password must contain at least one special character (e.g., @, #, &).";
      isValid = false;
    }
    if (password !== confirmPassword) {
      newErrors.matchError = "Passwords do not match.";
      toast.error(newErrors.matchError);
      isValid = false;
    }

    setError(newErrors);

    if (isValid) {
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_ENDPOINT}/api/Auth/SetPassword`,
          {
            password,
            confirmPassword,
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.status) {
          toast.success(response.data.message);
          navigate(response?.data?.url || "/");
        } else {
          toast.error(response?.data?.message || "Failed to set password.");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="set-password-container"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Toaster />
      <div className="set-password-box">
        <h1 className="set-password-title">Create Password</h1>
        <form onSubmit={handleSubmit} className="set-password-form">
          <div className="set-password-form-group">
            <label htmlFor="password">Enter password:</label>
            <div className="set-password-form-input-container">
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
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                className="set-password-toggle-visibility"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <EyeSlashIcon className="set-password-icon" />
                ) : (
                  <EyeIcon className="set-password-icon" />
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

            <label htmlFor="confirmPassword">Confirm password:</label>
            <div className="set-password-form-input-container">
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
                aria-label={
                  confirmPasswordVisible
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                className="set-password-toggle-visibility"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                {confirmPasswordVisible ? (
                  <EyeSlashIcon className="set-password-icon" />
                ) : (
                  <EyeIcon className="set-password-icon" />
                )}
              </button>
            </div>
            {error.matchError && (
              <p className="error-message">{error.matchError}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="set-password-submit-btn"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        <div className="set-password-password-rules">
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

export default SetPasswordPage;
