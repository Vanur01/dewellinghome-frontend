import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { ContactusForm } from "../components/Forms/ContactusForm";

const ContactUsPage = () => {
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
              <ContactusForm />
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
