import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InquiryStore from "../../store/public/InquiryStore";
import { UserDetails } from "../../../src/types/enquiry";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const countries = [
  { code: "IN", dial: "+91", name: "India" },
  { code: "US", dial: "+1", name: "United States" },
  { code: "GB", dial: "+44", name: "United Kingdom" },
  { code: "AE", dial: "+971", name: "UAE" },
  { code: "SG", dial: "+65", name: "Singapore" },
  { code: "AU", dial: "+61", name: "Australia" },
  { code: "CA", dial: "+1", name: "Canada" },
];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string()
    .min(7, "Invalid phone number")
    .max(15, "Phone number is too long")
    .regex(/^[0-9]+$/, "Only numbers are allowed"),
  address: z.string().min(1, "Address is required"),
  pincode: z.string().min(5, "Invalid pincode").regex(/^[0-9]+$/, "Only numbers are allowed"),
  countryCode: z.string().min(1),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ContactFormProps {
  className?: string;
  onComplete?: () => void;
  initialData?: UserDetails;
  isEditing?: boolean;
}

const ContactForm = ({
  className = "",
  onComplete,
  initialData,
  isEditing = false,
}: ContactFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      address: "",
      pincode: "",
      countryCode: "+91",
      message: "",
    },
  });

  const { setUserDetails, userDetails } = InquiryStore();
  const navigate = useNavigate();
  const [showCountryList, setShowCountryList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const countryCode = watch("countryCode");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setShowCountryList(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dial.includes(searchQuery)
  );

  const onSubmit = (data: FormData) => {
    setUserDetails(data);
    if (onComplete) {
      onComplete();
    } else if (!isEditing) {
      navigate("/get-estimate");
    }
  };

  if (userDetails.name) {
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
            <h3 className="text-2xl font-bold text-gray-800">
              Thank You, {userDetails.name}!
            </h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              We've received your contact information. Let's proceed with your
              design requirements.
            </p>
          </div>
          <div className="w-full max-w-sm pt-6">
            <Button
              onClick={() => navigate("/get-estimate")}
              className="w-full text-sm bg-red-600 hover:bg-red-700 text-white "
            >
              Continue to Design Requirements
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col space-y-3 ${className}`}
    >
      <h2 className="text-medium text-xl">
        {isEditing ? "Edit Contact Information" : "Meet a Designer"}
      </h2>

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input {...field} placeholder="Enter your name" className="text-sm" />
        )}
      />
      {errors.name && (
        <p className="text-sm text-red-500">{errors.name.message}</p>
      )}

      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="Enter your address"
            className="text-sm"
          />
        )}
      />
      {errors.address && (
        <p className="text-sm text-red-500">{errors.address.message}</p>
      )}

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="email"
            placeholder="Enter your email"
            className="text-sm"
          />
        )}
      />
      {errors.email && (
        <p className="text-sm text-red-500">{errors.email.message}</p>
      )}

      {/* Phone input */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex">
          <button
            type="button"
            className="flex items-center border py-1.5 px-2 text-sm rounded-l"
            onClick={() => setShowCountryList(!showCountryList)}
          >
            {countryCode}
            <ChevronDown
              className={`ml-2 transition-transform duration-200 ${
                showCountryList ? "rotate-180" : ""
              }`}
              size={16}
            />
          </button>

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your phone number"
                className="flex-1 text-sm rounded-l-none"
                type="tel"
              />
            )}
          />
        </div>

        {showCountryList && (
          <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="p-2 border-b">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country..."
                className="text-sm"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredCountries.map((country) => (
                <div
                  key={country.code}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setValue("countryCode", country.dial);
                    setShowCountryList(false);
                    setSearchQuery("");
                  }}
                >
                  <span className="w-16 inline-block">{country.dial}</span>
                  <span>{country.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {errors.phone && (
        <p className="text-sm text-red-500">{errors.phone.message}</p>
      )}

      <Controller
        name="pincode"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="Enter your pincode"
            className="text-sm"
          />
        )}
      />
      {errors.pincode && (
        <p className="text-sm text-red-500">{errors.pincode.message}</p>
      )}

      <Controller
        name="message"
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="Additional notes or requirements (optional)"
            className="text-sm"
            rows={2}
          />
        )}
      />

      <Button
        type="submit"
        className="bg-red-600 hover:bg-red-700 text-white text-sm"
      >
        {isEditing ? "Update Contact Info" : "Continue"}{" "}
        {!isEditing && (
          <span className="bg-yellow-400 text-black text-xs px-1.5 py-0.5 ml-1 rounded">
            FREE
          </span>
        )}
      </Button>

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
