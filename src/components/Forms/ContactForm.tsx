import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const countries = [
  { code: "IN", dial: "+91", name: "India" },
  { code: "US", dial: "+1", name: "United States" },
  { code: "GB", dial: "+44", name: "United Kingdom" },
  { code: "AE", dial: "+971", name: "UAE" },
  { code: "SG", dial: "+65", name: "Singapore" },
  { code: "AU", dial: "+61", name: "Australia" },
  { code: "CA", dial: "+1", name: "Canada" },
];

interface ContactFormProps {
  onSubmit: (formData: any) => void;
  className?: string;
}

const ContactForm = ({ onSubmit, className = ""}: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    pincode: "",
    receiveUpdates: true,
    countryCode: "+91",
  });
  const [showCountryList, setShowCountryList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryList(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectCountry = (dial: string) => {
    setFormData({ ...formData, countryCode: dial });
    setShowCountryList(false);
  };

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dial.includes(searchQuery)
  );

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col justfiy-between space-y-3 ${className}`}>
      <div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="w-full border-b border-gray-300 py-1.5 focus:outline-none focus:border-green-500 text-sm"
          required
        />
      </div>

      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="w-full border-b border-gray-300 py-1.5 focus:outline-none focus:border-green-500 text-sm"
          required
        />
      </div>

      {/* Phone input with country selector */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex">
          <div className="relative">
            <button
              type="button"
              className="flex items-center border-b border-gray-300 py-1.5 px-2 focus:outline-none text-sm hover:bg-gray-50 rounded-t"
              onClick={() => setShowCountryList(!showCountryList)}
            >
              {formData.countryCode}
              <ChevronDown className={`ml-2 transition-transform duration-200 ${showCountryList ? 'rotate-180' : ''}`} size={16}/>
            </button>
            {showCountryList && (
              <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg animate-in fade-in duration-200">
                <div className="p-2 border-b">
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 text-sm border rounded-md focus:outline-none focus:border-red-500"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
                  {filteredCountries.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">No countries found</div>
                  ) : (
                    filteredCountries.map((country) => (
                      <div
                        key={country.code}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center"
                        onClick={() => selectCountry(country.dial)}
                      >
                        <span className="w-16 text-gray-600">{country.dial}</span>
                        <span className="font-medium">{country.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            className="flex-1 border-b border-gray-300 py-1.5 focus:outline-none focus:border-green-500 text-sm"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between py-1">
        <label className="text-gray-600 text-sm">
          Send me updates on WhatsApp
        </label>
        <div
          className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${
            formData.receiveUpdates ? "bg-red-500" : "bg-gray-300"
          }`}
          onClick={() =>
            setFormData({
              ...formData,
              receiveUpdates: !formData.receiveUpdates,
            })
          }
        >
          <div
            className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${
              formData.receiveUpdates ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      </div>

      <div>
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="Enter your current residence pincode"
          className="w-full border-b border-gray-300 py-1.5 focus:outline-none focus:border-green-500 text-sm"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 px-4 rounded-md mt-4 hover:bg-red-700 transition-colors text-sm"
      >
        Enquiry{" "}
        <span className="bg-yellow-400 text-black text-xs px-1.5 py-0.5 ml-1 rounded">
          FREE
        </span>
      </button>

      <p className="text-xs text-gray-600 mt-2">
        By submitting, you agree to our{" "}
        <a href="#" className="text-red-600">
          privacy policy
        </a>{" "}
        and{" "}
        <a href="#" className="text-red-600">
          terms of use
        </a>
        , allowing us to use your information as outlined.
      </p>
    </form>
  );
};

export default ContactForm;
