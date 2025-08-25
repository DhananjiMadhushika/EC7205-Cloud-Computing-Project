import { MdSearch } from 'react-icons/md';
import { useState, useEffect, useRef } from 'react';

const DISTRICTS = [
  // Colombo
  'Colombo', 'Nugegoda', 'Maharagama', 'Boralesgamuwa', 'Rajagiriya', 'Dehiwala', 'Battaramulla', 'Koswatta', 'Nawala', 'Kotikawatta', 'Kollonnawa',
  // Gampaha
  'Gampaha', 'Negombo', 'Wattala', 'Ja-Ela', 'Kadawatha', 'Yakkala', 'Kiribathgoda', 'Delgoda', 'Ragama', 'Minuwangoda', 'Meerigama',
  // Kalutara
  'Kalutara', 'Horana', 'Panadura', 'Bandaragama', 'Beruwala', 'Wadduwa', 'Matugama', 'Bulathsinhala', 'Alpitiya',
  // Galle
  'Galle', 'Hikkaduwa', 'Ambalangoda', 'Baddegama', 'Kirinda', 'Unawatuna', 'Ahangama', 'Telewa',
  // Matara
  'Matara', 'Akuressa', 'Dikwella', 'Devinuwara', 'Hakmana', 'Thaldena', 'Pasgoda', 'Kotapola',
  // Hambantota
  'Hambantota', 'Tangalle', 'Ambalantota', 'Weeraketiya', 'Sooriyawewa', 'Ridiyagama', 'Beliatta', 'Kataragama',
  // Monaragala
  'Monaragala', 'Buttala', 'Wellimada', 'Siththiliya', 'Bibile', 'Okampitiya',
  // Badulla
  'Badulla', 'Bandarawela', 'Diyathalawa', 'Passara', 'Hali Ela', 'Wiyaluma', 'Ella',
  // Nuwara Eliya
  'Nuwara Eliya', 'Hatton', 'Thalawakele', 'Maskeliya', 'Ramboda', 'Ginthota',
  // Kandy
  'Kandy', 'Gampola', 'Peradeniya', 'Kadugannawa', 'Kandepola', 'Vilgamuwa', 'Perawela',
  // Matale
  'Matale', 'Galewela', 'Rikkala', 'Dambulla', 'Palapathwewa', 'Nawalapitiya',
  // Anuradhapura
  'Anuradhapura', 'Medawachchiya', 'Thalawa', 'Habarana', 'Kekirawa', 'Eppawala',
  // Polonnaruwa
  'Polonnaruwa', 'Kaduruwela', 'Hingurakgoda', 'Minipura', 'Madirigiriya', 'Alaeru',
  // Kurunegala
  'Kurunegala', 'Kuliyapitiya', 'Weerawila', 'Narammala', 'Pannala', 'Galegoda', 'Masapola',
  // Puttalam
  'Puttalam', 'Chilaw', 'Marawila', 'Nattandiya', 'Anamunuketiya', 'Puttukudirippu',
  // Ratnapura
  'Ratnapura', 'Balangoda', 'Kuruwita', 'Embilipitiya', 'Eratna', 'Kahawatta', 'Wickramasinghapura',
  // Trincomalee
  'Trincomalee', 'Kantalai', 'Kinniya', 'Mutur', 'Seruwila',
  // Batticaloa
  'Batticaloa', 'Kalmunai', 'Eravur', 'Vellaveli', 'Manmunai',
  // Ampara
  'Ampara', 'Sainthamaruthu', 'Oluvil', 'Mahaoya', 'Uhana', 'Nintavur',
  // Jaffna
  'Jaffna', 'Nallur', 'Chavakachcheri', 'Kopay', 'Punnalaikkadduvan',
  // Kilinochchi
  'Kilinochchi', 'Karachchi', 'Pallai', 'Kandavalai',
  // Mullaitivu
  'Mullaitivu', 'Oddusuddan', 'Thunukkai', 'Nedunkeni',
  // Mannar
  'Mannar', 'Thalaimannar', 'Madu', 'Musali',
  // Vavuniya
  'Vavuniya', 'Vellankulam', 'Pooneryn', 'Nedunkeni',
  // Kegalle
  'Kegalle', 'Mawanella', 'Rambukkana', 'Ruwanwella', 'Udammita', 'Yatiyanthota'
];

interface SearchProps {
  onSearchChange?: (searchTerm: string) => void;
}

const LocationSearch = ({ onSearchChange }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = DISTRICTS.filter(district =>
        district.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 10); // Limit to 10 suggestions
      setFilteredDistricts(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredDistricts([]);
      setShowDropdown(false);
    }
    setSelectedIndex(-1);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange?.(value);
  };

  const handleSuggestionClick = (district: string) => {
    setSearchTerm(district);
    setShowDropdown(false);
    onSearchChange?.(district);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredDistricts.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredDistricts.length) {
          handleSuggestionClick(filteredDistricts[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowDropdown(false);
    onSearchChange?.('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full lg:w-auto">
      <div className="flex items-center gap-2 border border-gray-300 rounded-[30px] px-3 py-2 w-full lg:w-auto ">
        <MdSearch className="flex-shrink-0 text-gray-500" size={20} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by location..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="flex-shrink-0 ml-1 text-gray-400 hover:text-gray-600"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 z-50 mt-1 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg top-full max-h-60"
        >
          {filteredDistricts.map((district, index) => (
            <button
              key={district}
              onClick={() => handleSuggestionClick(district)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                index === selectedIndex ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
              type="button"
            >
              <span className="font-medium">{district}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;