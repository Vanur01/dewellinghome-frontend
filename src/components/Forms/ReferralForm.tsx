import { useState } from "react";
import { referralApi } from "../../utils/api";
import { toast } from "sonner";

const ReferralForm = () => {
  const [formData, setFormData] = useState({
    referralName: "",
    referralEmail: "",
    referralPhone: "",
    referralAddress: "",
    relationship: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await referralApi.createReferral(formData);
      setSubmitted(true);
      setFormData({
        referralName: "",
        referralEmail: "",
        referralPhone: "",
        referralAddress: "",
        relationship: "",
        notes: "",
      });
      toast("Referral sent!", {
        description: "Your referral has been submitted successfully.",
      });
    } catch (error) {
      console.error("Failed to submit referral:", error);
      toast("Submission failed",
        {description:
          "There was an error submitting your referral. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Refer Someone
      </h2>
      {submitted && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          Referral submitted successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="referralName"
              value={formData.referralName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="referralEmail"
              value={formData.referralEmail}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="referralPhone"
              value={formData.referralPhone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="referralAddress"
              value={formData.referralAddress}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Relationship</label>
          <input
            type="text"
            name="relationship"
            value={formData.relationship}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Submit Referral
        </button>
      </form>
    </div>
  );
};

export default ReferralForm;
