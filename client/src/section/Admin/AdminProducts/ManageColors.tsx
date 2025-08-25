import { BackButton } from "@/components/button/BackButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

interface Color {
  _id: string;
  name: string;
  hexCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  _count?: {
    products: number;
  };
}

function ManageColors() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [colorToDelete, setColorToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    hexCode: "#000000",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchColors = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/colors");
      console.log("Fetched colors:", response.data);
      setColors(response.data);
    } catch (error) {
      console.error("Failed to fetch colors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const openModal = (color?: Color) => {
    if (color) {
      setEditingColor(color);
      setFormData({
        name: color.name,
        hexCode: color.hexCode,
      });
    } else {
      setEditingColor(null);
      setFormData({
        name: "",
        hexCode: "#000000",
      });
    }
    setIsModalOpen(true);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingColor(null);
    setFormData({ name: "", hexCode: "#000000" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        setErrorMessage("No auth token found");
        return;
      }

      if (editingColor) {
        // Update color
        await axios.put(
          `http://localhost:3001/colors/${editingColor._id}`,
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        setSuccessMessage("Color updated successfully!");
      } else {
        // Create color
        await axios.post(
          "http://localhost:3001/colors",
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        setSuccessMessage("Color created successfully!");
      }

      fetchColors();
      closeModal();
    } catch (error: any) {
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  const handleDelete = async () => {
    if (!colorToDelete) return;

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        console.log("No auth token found");
        return;
      }

      await axios.delete(
        `http://localhost:3001/colors/${colorToDelete}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      fetchColors();
      setIsDeleteModalOpen(false);
      setColorToDelete(null);
    } catch (error) {
      console.error("Failed to delete color", error);
    }
  };

  const openDeleteModal = (colorId: string) => {
    setColorToDelete(colorId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setColorToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Predefined color options
  const predefinedColors = [
    "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
    "#000000", "#FFFFFF", "#808080", "#FFA500", "#800080", "#008000",
    "#FFC0CB", "#A52A2A", "#FFD700", "#40E0D0", "#EE82EE", "#90EE90"
  ];

  return (
    <div className="flex-1 p-4 md:p-6 xl:p-10 bg-[#262626] min-h-screen rounded-2xl">
      <BackButton />
      
      <div className="flex flex-col-reverse justify-between mt-4 mb-8 sm-425:flex-row sm-525:mb-10 gap-y-3">
        <h1 className="text-2xl font-semibold text-white md:text-2xl xl:text-3xl">
          Manage Colors
        </h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
        >
          <FiPlus size={20} />
          Add Color
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-400">Loading...</p>
        </div>
      ) : (
        <div className="overflow-hidden bg-black rounded-2xl">
          <table className="w-full text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 font-semibold text-white">ID</th>
                <th className="px-6 py-3 font-semibold text-white">Color</th>
                <th className="px-6 py-3 font-semibold text-white">Name</th>
                <th className="px-6 py-3 font-semibold text-white">Hex Code</th>
                <th className="px-6 py-3 font-semibold text-white">Products</th>
                <th className="px-6 py-3 font-semibold text-white">Status</th>
                <th className="px-6 py-3 font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {colors.map((color) => (
                <tr key={color._id} className="border-b border-gray-700">
                  <td className="px-6 py-4 text-white">{color._id}</td>
                  <td className="px-6 py-4">
                    <div
                      className="w-8 h-8 border-2 border-gray-400 rounded-full"
                      style={{ backgroundColor: color.hexCode }}
                    ></div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{color.name}</td>
                  <td className="px-6 py-4 font-mono text-white">{color.hexCode}</td>
                  <td className="px-6 py-4 text-white">{color._count?.products || 0}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        color.isActive
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {color.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(color)}
                        className="flex items-center justify-center w-8 h-8 text-white transition bg-blue-600 rounded-full shadow-lg hover:bg-blue-500"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(color._id)}
                        className="flex items-center justify-center w-8 h-8 text-white transition bg-red-600 rounded-full shadow-lg hover:bg-red-500"
                        disabled={(color._count?.products || 0) > 0}
                        title={(color._count?.products || 0) > 0 ? "Cannot delete color with products" : "Delete color"}
                      >
                        <RiDeleteBin6Line size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {colors.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <p className="text-xl text-gray-400">No colors found</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="p-6 bg-[#262626] rounded-xl w-[400px] max-w-[90vw]">
            <h2 className="mb-4 text-xl font-semibold text-white">
              {editingColor ? "Edit Color" : "Add Color"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-white">
                  Color Name:
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-black border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-green-600"
                  placeholder="e.g., Royal Blue, Forest Green"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-white">
                  Hex Code:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.hexCode}
                    onChange={(e) => setFormData({ ...formData, hexCode: e.target.value })}
                    className="bg-black border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5 focus:outline-none focus:border-green-600 font-mono"
                    placeholder="#000000"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    required
                  />
                  <input
                    type="color"
                    value={formData.hexCode}
                    onChange={(e) => setFormData({ ...formData, hexCode: e.target.value })}
                    className="w-12 h-10 border border-gray-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Predefined Color Palette */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-white">
                  Quick Colors:
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, hexCode: color })}
                      className={`w-8 h-8 rounded border-2 transition-all ${
                        formData.hexCode === color ? "border-white scale-110" : "border-gray-400"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {errorMessage && (
                <p className="mb-4 text-sm text-red-500">* {errorMessage}</p>
              )}
              {successMessage && (
                <p className="mb-4 text-sm text-green-500">{successMessage}</p>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  {editingColor ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="p-6 bg-[#262626] rounded-xl w-[340px] sm-425:w-[380px]">
            <h2 className="text-xl font-semibold text-white">
              Confirm Deletion
            </h2>
            <p className="mt-5 text-sm text-gray-300 md:text-base">
              Are you sure you want to delete this color?
            </p>
            <div className="flex justify-end mt-5 space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-6 py-1.5 text-sm md:text-base text-white bg-gray-500 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-1.5 text-sm md:text-base text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageColors;