import { useNavigate } from "react-router-dom";
import InquiryStore from "../../store/public/InquiryStore";
import { UserDetails } from "../../../src/types/enquiry";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits.")
    .max(10, "Phone number cannot exceed 10 digits.")
    .regex(/^[0-9]+$/, "Phone number should contain only numbers."),
  address: z.string().min(5, "Please enter complete address."),
  pincode: z
    .string()
    .min(5, "Pincode must be at least 5 digits.")
    .max(6, "Pincode cannot exceed 6 digits.")
    .regex(/^[0-9]+$/, "Pincode should contain only numbers."),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ContactFormProps {
  className?: string;
  initialData?: UserDetails;
}

// Custom Input component with bottom border styling
const BottomBorderInput = ({
  placeholder,
  value,
  onChange,
  onKeyDown,
  type = "text",
  className = "",
  ...props
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  [key: string]: any;
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    className={`w-full px-0 py-2 text-sm bg-transparent border-0 border-b border-gray-300 focus:border-red-500 focus:outline-none placeholder-gray-400 transition-colors ${className}`}
    {...props}
  />
);

// Custom Textarea component with bottom border styling
const BottomBorderTextarea = ({
  placeholder,
  value,
  onChange,
  rows = 2,
  className = "",
  ...props
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
  [key: string]: any;
}) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    className={`w-full px-0 py-3 text-sm bg-transparent border-0 border-b border-gray-300 focus:border-red-500 focus:outline-none placeholder-gray-400 resize-none transition-colors ${className}`}
    {...props}
  />
);

const ContactForm = ({ className = "", initialData }: ContactFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      address: "",
      pincode: "",
      message: "",
    },
  });

  const { setUserDetails, userDetails } = InquiryStore();
  const navigate = useNavigate();

  // Handle number-only input for phone and pincode
  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if (
      [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  const onSubmit = (data: FormData) => {
    try {
      // Convert to strings (already strings from form, but ensuring type safety)
      const formattedData = {
        ...data,
        phone: data.phone.toString(),
        pincode: data.pincode.toString(),
      };

      setUserDetails(formattedData);
      navigate("/get-estimate");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form");
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
              className="w-full text-sm bg-red-600 hover:bg-red-700 text-white"
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
      className={`flex flex-col space-y-4 ${className}`}
    >
      <h2 className="text-medium text-xl mb-4">Meet a Designer</h2>

      {/* Name Field */}
      <div>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <BottomBorderInput
              placeholder="Enter your name"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Address Field */}
      <div>
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <BottomBorderInput
              placeholder="Enter your address"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.address && (
          <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <BottomBorderInput
              type="email"
              placeholder="Enter your email"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Field */}
      <div>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <BottomBorderInput
              placeholder="Enter your phone number"
              value={field.value}
              onChange={field.onChange}
              onKeyDown={handleNumberInput}
              inputMode="numeric"
            />
          )}
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Pincode Field */}
      <div>
        <Controller
          name="pincode"
          control={control}
          render={({ field }) => (
            <BottomBorderInput
              placeholder="Enter your pincode"
              value={field.value}
              onChange={field.onChange}
              onKeyDown={handleNumberInput}
              inputMode="numeric"
              maxLength={6}
            />
          )}
        />
        {errors.pincode && (
          <p className="text-sm text-red-500 mt-1">{errors.pincode.message}</p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <textarea
            className="w-full px-2 py-3 text-sm bg-transparent border-1 border-gray-300 focus:border-red-500 focus:outline-none placeholder-gray-400 resize-none transition-colors rounded-md"
              placeholder="Additional notes or requirements (optional)"
              value={field.value || ""}
              onChange={field.onChange}
              rows={3}
            />
          )}
        />
      </div>

      <Button
  type="submit"
  className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
>
  <span>Enquire For</span>
  <span className=" bg-yellow-300 px-2 py-0.5 text-[11px] font-bold text-black shadow-sm">
    FREE
  </span>
</Button>

    </form>
  );
};

export default ContactForm;
