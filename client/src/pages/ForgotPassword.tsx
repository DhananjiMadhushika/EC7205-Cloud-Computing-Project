import { showToastSuccess } from "@/utils/toast/successToast";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaArrowLeft, FaEnvelope, FaTimes } from "react-icons/fa";

type ForgotPasswordProps = {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
};

export default function ForgotPassword({ isOpen, onClose, onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setEmailValidation("Invalid email format");
    } else {
      setEmailValidation("");
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMessage("Email is required.");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }

    if (emailValidation) {
      setErrorMessage("Please provide a valid email address.");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      if (response.status === 200) {
        showToastSuccess("Password reset instructions sent to your email!");
        setResetSent(true);
      }
    } catch (error: any) {
      console.error("Error during password reset request:", error);
      setErrorMessage(error.response?.data?.message || "Failed to send reset email. Please try again.");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative w-full max-w-md p-6 m-5 bg-white border border-white shadow-xl bg-opacity-10 backdrop-blur-lg rounded-2xl border-opacity-10"
      >
        <button 
          className="absolute text-lg text-white transition-colors top-4 right-4 hover:text-gray-300" 
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes />
        </button>
        
        <button 
          className="absolute flex items-center gap-1 text-sm text-gray-300 transition-colors top-4 left-4 hover:text-white" 
          onClick={onBackToLogin}
          aria-label="Back to login"
        >
          <FaArrowLeft size={12} /> Back to Login
        </button>

        <h2 className="mt-3 mb-2 text-2xl font-bold text-center text-white">
          {resetSent ? "Check Your Email" : "Forgot Password"}
        </h2>
        
        {resetSent ? (
          <div className="text-center">
            <div className="flex justify-center my-6">
              <div className="p-3 bg-green-500 rounded-full bg-opacity-20">
                <FaEnvelope size={28} className="text-green-400" />
              </div>
            </div>
            <p className="mb-4 text-gray-300">
              We've sent a password reset link to <span className="font-medium text-white">{email}</span>. Please check your inbox and follow the instructions.
            </p>
            <p className="text-sm text-gray-400">
              Didn't receive an email? Check your spam folder or
              <button 
                onClick={() => { setResetSent(false); setEmail(""); }}
                className="ml-1 text-green-400 rounded hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                try again
              </button>
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-center text-gray-300">
              Enter your email address below and we'll send you a link to reset your password
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="text-sm text-white">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope className="text-gray-400" size={14} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full p-2 pl-10 mt-1 text-white bg-gray-700 border border-gray-500 rounded-md bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your email"
                  />
                </div>
                {emailValidation && (
                  <p className="mt-1 text-xs text-red-500">* {emailValidation}</p>
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
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}