import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

export const BackButton = () => {
  const navigate = useNavigate();
  
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-white bg-gray-700 hover:bg-green-800 font-medium rounded-lg  px-3 md:px-5 py-1.5 sm-425:py-2 text-sm sm:text-base"
    >
      <FaArrowLeft size={12} />
      Back
    </button>
  );
};
