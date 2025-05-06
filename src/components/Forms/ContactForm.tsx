import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import InquiryStore from "../../store/public/InquiryStore";
import { useNavigate } from "react-router-dom";
import { UserDetails } from "../../../src/types/enquiry";

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
  className?: string;
  onComplete?: () => void;
  initialData?: UserDetails;
  isEditing?: boolean;
}

const ContactForm = ({ className = "", onComplete, initialData, isEditing = false }: ContactFormProps) => {
  const [formData, setFormData] = useState<UserDetails>(() => {
    return initialData || {
      name: "",
      email: "",
      phone: "",
      pincode: "",
      countryCode: "+91",
      message: "",
    };
  });
  const [showCountryList, setShowCountryList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const { setUserDetails, userDetails } = InquiryStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryList(false);
        setSearchQuery("");
      }
    };

    console.log(userDetails);

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
    setUserDetails(formData);
    
    if (onComplete) {
      onComplete();
    } else if (!isEditing) {
      navigate("/get-estimate");
    }
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

  // Show thank you message if user details exist but project details don't
  if (userDetails.name ) {
    return (
      <div className={`text-center ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-green-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-800">Thank You, {userDetails.name}!</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              We've received your contact information. Let's proceed with your design requirements.
            </p>
          </div>

          <div className="w-full max-w-sm pt-6">
            <button
              onClick={() => navigate('/get-estimate')}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors text-sm flex items-center justify-center group"
            >
              Continue to Design Requirements
              <svg
                className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col justfiy-between space-y-3 ${className}`}>
      <div>
        <h2 className="text-medium text-xl">{isEditing ? "Edit Contact Information" : "Meet a Designer"}</h2>
      </div>
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
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your address"
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
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="flex-1 border-b border-gray-300 py-1.5 focus:outline-none focus:border-green-500 text-sm"
            required
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

      <div>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Additional notes or requirements (optional)"
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-green-500 text-sm resize-y"
          rows={2}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 px-4 rounded-md mt-4 hover:bg-red-700 transition-colors text-sm"
      >
        {isEditing ? "Update Contact Info" : "Continue"}{" "}
        {!isEditing && (
          <span className="bg-yellow-400 text-black text-xs px-1.5 py-0.5 ml-1 rounded">
            FREE
          </span>
        )}
      </button>

      {!isEditing && (
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
      )}
    </form>
  );
};

export default ContactForm;
