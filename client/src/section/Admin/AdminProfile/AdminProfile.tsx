import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AdminProfile() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        console.log("No auth token found");
        return;
      }
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(data.message || "Failed to change password.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex-1 p-12 md:pl-0 bg-[#262626] min-h-screen text-white rounded-2xl">
      {/* Title - Positioned Above the Image, Aligned Right */}

      <div className="flex justify-end pr-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-300 capitalize">
          CHANGE PASSWORD
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-6 px-2">
        {/* First Column - Image */}
        <div className="flex justify-center items-center">
          <div className="flex w-32 h-32 md:w-72 md:h-72 rounded-full bg-[#0000007c] justify-center items-center mt-0 md:mt-16">
            <div className="w-28 h-28 mt-6 md:mt-0  md:w-44 md:h-44 overflow-hidden">
              <img
                src="/Admin/profile/lock.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Second Column - Change Password Form */}
        <div className="flex flex-col justify-center mt-6 md:mt-0">
          <hr />
          <form className="space-y-4 py-5" onSubmit={handleSubmit}>
            

            {/* Current Password */}
            <div className="relative">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium mb-2"
              >
                Current Password
              </label>
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 rounded bg-[#333] focus-visible:bg-black text-white border border-[#555] focus:outline-none focus:border-green-500"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                className="absolute text-gray-300 right-3 top-9"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium mb-2"
              >
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 rounded bg-[#333] focus-visible:bg-black text-white border border-[#555] focus:outline-none focus:border-green-500"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                className="absolute text-gray-300 right-3 top-9"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Confirm New Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 mb-4 rounded bg-[#333] focus-visible:bg-black text-white border border-[#555] focus:outline-none focus:border-green-500"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                className="absolute text-gray-300 right-3 top-9"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* Error / Success Messages */}
            {errorMessage && <p className="text-red-500">* {errorMessage}</p>}
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 font-semibold text-white py-2 px-4 rounded hover:bg-green-800 transition duration-200"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
