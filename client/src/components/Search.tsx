import { MdSearch } from 'react-icons/md';

interface SearchProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
}

const Search = ({ searchTerm, onSearchChange, placeholder = "Search products..." }: SearchProps) => {
  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-[30px] px-3 py-2 w-full lg:w-auto">
      <MdSearch className="text-gray-500" size={20} />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full text-sm text-white placeholder-gray-400 bg-transparent outline-none"
      />
    </div>
  );
};

export default Search;