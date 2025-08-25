import { useAuth } from "@/Providers/AuthProvider";
import { showToastSuccess } from "@/utils/toast/successToast";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
// Import the AuthContext hook

type loginProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginPage({ isOpen, onClose }: loginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phoneNumber: "", password: "" });
  const [emailValidation, setEmailValidation] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const navigate = useNavigate();
  const { handleLoginSuccess } = useAuth(); // Use the authentication context

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        setEmailValidation("Invalid email format");
      } else {
        setEmailValidation("");
      }
    }

    if (name === "password") {
      if (value.length < 6) {
        setPasswordValidation("Password must be at least 6 characters");
      } else {
        setPasswordValidation("");
      }
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!isLogin) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.phoneNumber.trim() || !formData.password.trim()) {
        setErrorMessage("All fields are required.");
        setTimeout(() => {
          setErrorMessage("");
        }, 1000);
        return;
      }

      if (emailValidation || passwordValidation) {
        setErrorMessage("Please fix the validation errors before submitting.");
        setTimeout(() => {
          setErrorMessage("");
        }, 1000);
        return;
      }
    }

    if (isLogin) {
      try {
        const response = await axios.post("http://localhost:3000/auth/login", formData);
        if (response.status === 200) {
          console.log("Login successful!");
          const token = response.data.token;
          const userID = response.data.user._id;
          sessionStorage.setItem("authToken", token);
          sessionStorage.setItem("userID", userID);
          
          console.log(response.data.user.role);
          
          // Call the context's handleLoginSuccess function
          handleLoginSuccess(response.data.user.role);
          
          onClose(); // Close the modal first
          
          // Then navigate based on role
          setTimeout(() => {
            if (response.data.user.role === "ADMIN") {
              navigate("/admin");
            } 
            else {
              navigate("/");
            }
          }, 300);

          setFormData({ name: "", email: "", phoneNumber: "", password: "" });
        }
      } catch (error: any) {
        console.error("Error during login:", error);
        setErrorMessage(error.response?.data?.message || "Login failed");
        setTimeout(() => {
          setErrorMessage("");
        }, 1000);
      }
    } else {
      try {
        const response = await axios.post("http://localhost:3000/auth/signup", formData);
        if (response.status === 200) {
          showToastSuccess("Registration successful!");
          setIsLogin(true);
          setFormData({ name: "", email: "", phoneNumber: "", password: "" });
        }
      } catch (error: any) {
        console.error("Error during registration:", error);
        setErrorMessage(error.response?.data?.message || "Registration failed");
        setTimeout(() => {
          setErrorMessage("");
        }, 2000);
      }
    }
  };

  const handleGoogleLoginSuccess = async (response: any) => {
    console.log("Google login success response:", response);
    try {
      const { credential } = response;
  
      if (!credential) {
        console.error("No credential in Google response");
        return;
      }
  
      console.log("Sending token to backend...");
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        credential: credential,
      });
  
      console.log("Backend response:", res.data);
  
      if (res.status === 200) {
        const token = res.data.token;
        const userID = res.data.user.id;
        sessionStorage.setItem("authToken", token);
        sessionStorage.setItem("userID", userID);
  
        // Call the context's handleLoginSuccess function
        handleLoginSuccess(res.data.user.role);
        
        // Close the modal first
        onClose();
        
        // Then navigate based on role
        setTimeout(() => {
          if (res.data.user.role === "ADMIN") {
            navigate("/admin");
          } else if (res.data.user.role === "AGENT") {
            navigate("/agent");
          } else if (response.data.user.role === "REP") {
            navigate("/rep");
          } else {
            navigate("/");
          }
        }, 300);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      // Show user-friendly error message
      alert("Google login failed. Please try again.");
    }
  };
  
  const handleGoogleLoginFailure = () => {
    console.error("Google Login Failed:");
  };

  if (!isOpen) return null;

   // Handle forgot password click
   const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  // Return to login from forgot password
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

   // Show forgot password component if showForgotPassword is true
   if (showForgotPassword) {
    return (
      <ForgotPassword 
        isOpen={showForgotPassword}
        onClose={onClose}
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  // Rest of your component remains the same
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative w-full max-w-md p-6 m-5 bg-white shadow-xl bg-opacity-10 backdrop-blur-lg rounded-2xl"
      >
        <button className="absolute text-lg text-white top-4 right-4" onClick={onClose}>
          <FaTimes />
        </button>

        <h2 className="mb-2 text-2xl font-bold text-center text-white">
          {isLogin ? "Welcome Back!" : "Create an Account"}
        </h2>
        <p className="mb-4 text-sm text-center text-gray-300">
          {isLogin ? "Enter your details below to sign in" : "Join us by entering your details below"}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isLogin ? (
              <>
                <div className="mb-3">
                  <label className="text-sm text-white">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 text-white bg-gray-700 border border-gray-500 rounded-md bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your email"
                  />
                  {emailValidation && (
                    <p className="mt-1 text-xs text-red-500">* {emailValidation}</p>
                  )}
                </div>

                <div className="relative mb-3">
                  <label className="text-sm text-white">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 text-white bg-gray-700 border border-gray-500 rounded-md bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Password"
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

                <div className="mb-3 text-right">
                  <button 
                    onClick={handleForgotPasswordClick}
                    className="text-sm text-green-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2">
                  <label className="text-sm text-white">Name</label>
                  <input
                    type="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 mt-0.5 rounded-md bg-gray-700 bg-opacity-40 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="mb-2">
                  <label className="text-sm text-white">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 mt-0.5 rounded-md bg-gray-700 bg-opacity-40 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your email"
                  />
                  {emailValidation && (
                    <p className="mt-1 text-xs text-red-500">* {emailValidation}</p>
                  )}
                </div>
                <div className="mb-2">
                  <label className="text-sm text-white">Phone Number</label>
                  <input
                    type="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 mt-0.5 rounded-md bg-gray-700 bg-opacity-40 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="relative mb-2">
                  <label className="text-sm text-white">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 mt-0.5 rounded-md bg-gray-700 bg-opacity-40 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Create Strong Password"
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
                
              </>
            )}
          </motion.div>
          {errorMessage && (
            <p className="mt-1 mb-2 text-xs text-red-500">* {errorMessage}</p>
          )}
        </AnimatePresence>

        <button
          onClick={handleSubmit}
          className="w-full py-2 mb-4 text-sm font-semibold text-white transition bg-white rounded-md bg-opacity-20 hover:bg-green-700"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        {/* <button className="w-full flex items-center justify-center mt-1 gap-2 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:text-black">
          <FcGoogle className="text-2xl" />
          <h3 className="text-white hover:text-black">Continue with Google</h3>
        </button> */}
        <div className="flex items-center justify-center w-full mt-1 ">
  <GoogleLogin
    onSuccess={handleGoogleLoginSuccess}
    onError={handleGoogleLoginFailure}
  />
</div>
        <p className="mt-2 text-center text-gray-300">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-green-400 hover:underline">
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}