import React, { useState } from "react";
import { Send } from "lucide-react";
import { inquiryApi } from "../../utils/api";
import { toast } from "sonner";

export const ContactusForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "name":
        if (value.trim().length < 3) {
          error = "Name must be at least 3 characters long";
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          error = "Name should only contain letters and spaces";
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!/^\d{10}$/.test(value)) {
          error = "Please enter a valid 10-digit phone number";
        }
        break;
      case "address":
        if (value.trim().length < 10) {
          error = "Please enter a complete address (minimum 10 characters)";
        }
        break;
      case "pincode":
        if (!/^[1-9][0-9]{5}$/.test(value)) {
          error = "Please enter a valid 6-digit pincode";
        }
        break;
      case "message":
        if (value.trim().length < 10) {
          error = "Message must be at least 10 characters long";
        }
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Only allow numbers for phone and pincode fields
    if ((name === 'phone' || name === 'pincode') && !/^\d*$/.test(value)) {
      return;
    }
    
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    
    const error = validateField(name, value);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const validateForm = () => {
    let hasErrors = false;
    const newErrors = { ...formErrors };
    
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      newErrors[key as keyof typeof formErrors] = error;
      if (error) {
        hasErrors = true;
      }
    });
    
    setFormErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await inquiryApi.createInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.pincode}`,
        message: formData.message,
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        pincode: "",
        message: "",
      });
      setFormErrors({
        name: "",
        email: "",
        phone: "",
        address: "",
        pincode: "",
        message: "",
      });

      toast.success("Thank you for reaching out! We will contact you shortly.");
    } catch {
      setError("Failed to submit inquiry. Please try again later.");
      toast.error("Failed to submit inquiry. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 bg-gray-50 border ${formErrors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white transition-colors`}
            placeholder="John Doe"
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 bg-gray-50 border ${formErrors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white transition-colors`}
            placeholder="john@example.com"
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number
          </label>
          <input
            type="number"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 bg-gray-50 border ${formErrors.phone ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white transition-colors`}
            placeholder="Enter 10-digit mobile number"
          />
          {formErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 bg-gray-50 border ${formErrors.address ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white transition-colors`}
            placeholder="Your complete address"
          />
          {formErrors.address && (
            <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="pincode"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Pincode
          </label>
          <input
            type="number"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 bg-gray-50 border ${formErrors.pincode ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white transition-colors`}
            placeholder="Enter 6-digit pincode"
          />
          {formErrors.pincode && (
            <p className="mt-1 text-sm text-red-600">{formErrors.pincode}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          required
          className={`w-full px-4 py-3 bg-gray-50 border ${formErrors.message ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white transition-colors`}
          placeholder="Tell us about your project and requirements..."
        ></textarea>
        {formErrors.message && (
          <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? "Sending..." : "Send Message"}
          <Send size={16} className="ml-2" />
        </button>
      </div>
    </form>
  );
};

export default ContactusForm;