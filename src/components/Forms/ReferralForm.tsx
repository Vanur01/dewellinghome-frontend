import { useForm } from "react-hook-form";
import { referralApi } from "../../utils/api";
import { toast } from "sonner";

type FormData = {
  referralName: string;
  referralEmail: string;
  referralPhone: string;
  referralAddress: string;
  relationship: string;
  notes: string;
};

const ReferralForm = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await referralApi.createReferral(data);
      toast("Referral sent!", {
        description: "Your referral has been submitted successfully.",
      });
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to submit referral:", error);
      toast("Submission failed", {
        description:
          "There was an error submitting your referral. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Refer Someone
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              {...register("referralName", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters long",
                },
              })}
              className={`w-full px-3 py-2 border rounded ${errors.referralName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.referralName && (
              <p className="text-red-500 text-xs mt-1">{errors.referralName.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              {...register("referralEmail", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              className={`w-full px-3 py-2 border rounded ${errors.referralEmail ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.referralEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.referralEmail.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              {...register("referralPhone", {
                required: "Phone number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Phone number must be 10 digits",
                },
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                },
              })}
              placeholder="10 digits only"
              className={`w-full px-3 py-2 border rounded ${errors.referralPhone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.referralPhone && (
              <p className="text-red-500 text-xs mt-1">{errors.referralPhone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              {...register("referralAddress", {
                required: "Address is required",
                minLength: {
                  value: 5,
                  message: "Please enter a valid address",
                },
              })}
              className={`w-full px-3 py-2 border rounded ${errors.referralAddress ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.referralAddress && (
              <p className="text-red-500 text-xs mt-1">{errors.referralAddress.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Relationship</label>
          <input
            type="text"
            {...register("relationship")}
            placeholder="e.g. Friend, Colleague etc."
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes (optional)</label>
          <textarea
            {...register("notes")}
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
