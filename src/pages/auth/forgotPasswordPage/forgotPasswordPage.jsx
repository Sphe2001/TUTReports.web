import { useState } from "react";
import { Link } from "react-router-dom";
import "./forgotPasswordPage.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../../../assets/illustration.jpg";

function ForgotPasswordPage() {
  const API_ENDPOINT = process.env.REACT_APP_API_END_POINT;
  const [email, setEmail] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/Auth/RecoverAccount`,
        {
          email,
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
        navigate("/verify/password-reset-otp");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="forgot-password-container"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Toaster />
      <div className="forgot-password-box">
        <h1 className="forgot-password-title">Forgot Password</h1>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="forgot-password-form-group">
            <label htmlFor="email">Enter your email:</label>
            <div className="forgot-password-input-container">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="forgot-password-submit-btn"
            disabled={isloading}
          >
            {isloading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="spinner"></span> Submitting...
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>

        <div className="forgot-password-back-link">
          <Link to="/">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
