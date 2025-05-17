import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { inquiryApi } from "../utils/api";
import { toast } from "sonner";

const ContactUsPage = () => {
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
        if (!/^[6-9]\d{9}$/.test(value)) {
          error = "Please enter a valid 10-digit Indian mobile number";
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

  const handleChange = (e) => {
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

  // Update the input fields to explicitly use type="number"
  const validateForm = () => {
    const errors: {
      name: string;
      email: string;
      phone: string;
      address: string;
      pincode: string;
      message: string;
    } = {
      name: "",
      email: "",
      phone: "",
      address: "",
      pincode: "",
      message: ""
    };
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key as keyof typeof formData] = error;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
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
        homeType: "residential",
        purpose: "general_inquiry"
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
    } catch (err) {
      setError("Failed to submit inquiry. Please try again later.");
      toast.error("Failed to submit inquiry. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/contact-bg.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-2xl opacity-90">
            Have questions about transforming your home? Our design experts are
            ready to help you create your dream space.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-16">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Contact Information */}
            <div className="w-full lg:w-1/3">
              <h2 className="text-2xl font-bold mb-8 text-gray-800">
                Contact Information
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-50 rounded-full">
                    <MapPin size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      Visit Us
                    </h3>
                    <p className="text-gray-600">
                      PLOT NO. 1014 , RingRoad
                      <br />
                      Sambalpur, Odisha 768006
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-50 rounded-full">
                    <Phone size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      Call Us
                    </h3>
                    <p className="text-gray-600">8328973166</p>
                    <p className="text-gray-600">Mon-Sat: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-50 rounded-full">
                    <Mail size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      Email Us
                    </h3>
                    <p className="text-gray-600">Hello@DewellingHome.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-50 rounded-full">
                    <Clock size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      Business Hours
                    </h3>
                    <p className="text-gray-600">
                      Monday - Saturday: 9:00 AM - 8:00 PM
                      <br />
                      Sunday: 10:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full lg:w-2/3">
              <h2 className="text-2xl font-bold mb-8 text-gray-800">
                Send Us a Message
              </h2>
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white transition-colors"
                      placeholder="john@example.com"
                    />
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white transition-colors"
                      placeholder="Your complete address"
                    />
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white transition-colors"
                    placeholder="Tell us about your project and requirements..."
                  ></textarea>
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
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            Our Location
          </h2>
          <div className="h-[400px] w-full bg-white rounded-xl overflow-hidden shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3712.43220351993!2d83.93731989999999!3d21.4907845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a2117f043823aef%3A0x7865723235ee1870!2sMeher%20Disposable!5e0!3m2!1sen!2sin!4v1747393282291!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Get a free, personalized estimate for your home interior project.
          </p>
          <Link
            to="/get-estimate"
            className="inline-block bg-white text-red-600 hover:bg-red-50 font-medium py-3 px-8 rounded-lg transition-colors duration-300 text-lg"
          >
            Get Free Estimate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
