import { Star } from "lucide-react";

export default function ProductCard() {
  

  return (
    <div className="max-w-xs p-4 text-white bg-gray-900 shadow-lg rounded-2xl">
      <div className="flex justify-center p-4 bg-gray-800 rounded-xl">
        <img
          src="https://harithaweli.lk/wp-content/uploads/2023/03/Waterproofing.jpeg"
          alt=""
          className="object-contain h-48"
        />
      </div>
      <div className="mt-4">
        <div className="flex items-center">
          {[...Array(4)].map((_, i) => (
            <Star key={i} size={16} className="text-yellow-400" />
          ))}
          <Star size={16} className="text-gray-600" />
        </div>
        <h2 className="mt-1 text-lg font-semibold">Ready Mix Plaster</h2>
        <p className="text-sm text-gray-400">Ready Mix Plaster</p>
        <p className="mt-2 text-xl font-bold">$110.97</p>
      </div>
      
    </div>
  );
}