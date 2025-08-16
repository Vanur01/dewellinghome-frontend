import { api } from "../utils/axiosInstance";

export const referralApi = {
  createReferral: (data: {
    referralName: string;
    referralEmail: string;
    referralPhone: string;
    referralAddress: string;
    relationship?: string;
    notes?: string;
  }) => api.post("/referrals", data),

  getReferrals: (params?: { userId:string }) =>
    api.get("/referrals/user-referrals", { params }),

  // Admin-specific endpoints
  getAllReferrals: (params?: {
    page?: number;
    limit?: number;
    refId?: string;
    name?: string;
    phone?: string;
    status?: string;
  }) => api.get("/referrals/admin", { params }),

  updateReferralStatus: (
    id: string,
    status: "pending" | "processing" | "completed" | "rejected"
  ) => api.put(`/referrals/${id}/status`, { status }),

  updateReferralRewardMessage: (id: string, rewardMessage: string) =>
    api.put(`/referrals/${id}/reward-message`, { rewardMessage }),
};
