import { showToastSuccess } from "@/utils/toast/successToast";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState("");
  const [confirmValidation, setConfirmValidation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Extract token and email from URL
    const queryParams = new URLSearchParams(window.location.search);
    const tokenParam = queryParams.get("token");
    const emailParam = queryParams.get("email");
    
    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
      // Validate token with backend
      validateToken(tokenParam, emailParam);
    } else {
      setIsValid(false);
      setErrorMessage("Invalid or missing reset information");
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string, email: string) => {
    try {
      setIsLoading(true);
      // We send the raw token to be hashed by the backend
      const response = await axios.get(
        `http://localhost:5000/api/auth/validate-reset-token`,
        { params: { token, email } }
      );
      
      if (response.status === 200) {
        setIsValid(true);
      }
    } catch (error: any) {
      console.error("Invalid or expired token:", error);
      setIsValid(false);
      setErrorMessage(error.response?.data?.message || "The password reset link is invalid or has expired");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 6) {
      setPasswordValidation("Password must be at least 6 characters");
    } else {
      setPasswordValidation("");
    }

    // Check if confirm password matches
    if (confirmPassword && value !== confirmPassword) {
      setConfirmValidation("Passwords do not match");
    } else if (confirmPassword) {
      setConfirmValidation("");
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== password) {
      setConfirmValidation("Passwords do not match");
    } else {
      setConfirmValidation("");
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!password.trim() || !confirmPassword.trim()) {
      setErrorMessage("All fields are required.");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }

    if (passwordValidation || confirmValidation) {
      setErrorMessage("Please fix the validation errors before submitting.");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }

    setIsSubmitting(true);
    try {
      // Send the original token (will be hashed server-side)
      const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        email,
        newPassword: password
      });

      if (response.status === 200) {
        showToastSuccess("Password has been reset successfully!");
        setResetSuccess(true);
        setTimeout(() => {
          navigate("/?openLogin=true");
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error during password reset:", error);
      setErrorMessage(error.response?.data?.message || "Password reset failed");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="p-6 text-center bg-white shadow-xl bg-opacity-10 backdrop-blur-lg rounded-2xl">
          <h2 className="mb-4 text-2xl font-bold text-white">Verifying Reset Link</h2>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-t-4 rounded-full border-white/20 border-t-white animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isValid && !resetSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="p-6 text-center bg-white shadow-xl bg-opacity-10 backdrop-blur-lg rounded-2xl">
          <h2 className="mb-4 text-2xl font-bold text-white">Password Reset Error</h2>
          <p className="text-red-400">{errorMessage}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 mt-4 text-sm font-semibold text-white transition bg-white rounded-md bg-opacity-20 hover:bg-green-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full max-w-md p-6 m-5 bg-white shadow-xl bg-opacity-10 backdrop-blur-lg rounded-2xl"
      >
        <h2 className="mb-2 text-2xl font-bold text-center text-white">
          {resetSuccess ? "Password Reset Successful" : "Reset Your Password"}
        </h2>
        
        {resetSuccess ? (
          <div className="text-center">
            <p className="mb-4 text-gray-300">
              Your password has been reset successfully. You will be redirected to the login page shortly.
            </p>
            <button
              onClick={() => navigate("/?openLogin=true")}
              className="px-4 py-2 text-sm font-semibold text-white transition bg-white rounded-md bg-opacity-20 hover:bg-green-700"
            >
              Login Now
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-center text-gray-300">
              Please enter your new password below
            </p>

            <form onSubmit={handleSubmit}>
              <div className="relative mb-3">
                <label className="text-sm text-white">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full p-2 mt-1 text-white bg-gray-700 border border-gray-500 rounded-md bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute text-gray-300 right-3 top-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {passwordValidation && (
                  <p className="mt-1 text-xs text-red-500">* {passwordValidation}</p>
                )}
              </div>

              <div className="relative mb-3">
                <label className="text-sm text-white">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="w-full p-2 mt-1 text-white bg-gray-700 border border-gray-500 rounded-md bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute text-gray-300 right-3 top-10"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {confirmValidation && (
                  <p className="mt-1 text-xs text-red-500">* {confirmValidation}</p>
                )}
              </div>

              {errorMessage && (
                <p className="mt-1 mb-2 text-xs text-red-500">* {errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 mb-2 text-sm font-semibold text-white transition bg-white rounded-md ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "bg-opacity-20 hover:bg-green-700"
                }`}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}