import { api } from "../utils/axiosInstance";
import { PaymentSchedule, Project } from "./types";

export const paymentScheduleApi = {
  // Get all payment schedules (admin)
  getAllPaymentSchedules: () =>
    api.get<{ data: PaymentSchedule[] }>("/payments/schedules"),

  // Get user's payment schedules
  getUserPaymentSchedules: (params?:{userId:string}) =>
    api.get<{ data: (PaymentSchedule & { projectId: Project })[] }>(
      "/payments/schedules/user-payment-schedules",{params}
    ),

  // Get specific payment schedule
  getPaymentScheduleById: (id: string) =>
    api.get<{ data: PaymentSchedule & { projectId: Project } }>(
      `/payments/schedules/${id}`
    ),

  // Get payment schedule by project ID
  getPaymentScheduleByProjectId: (projectId: string) =>
    api.get<{ data: PaymentSchedule & { projectId: Project } }>(
      `/payments/schedules/project/${projectId}`
    ),

  // Create new payment schedule (admin)
  createPaymentSchedule: (data: {
    projectId: string;
    totalProjectValue: number;
    milestones: Array<{
      timeline: string;
      percentage: number;
    }>;
  }) => api.post<{ data: PaymentSchedule }>("/payments/schedules", data),

  // Update project value (admin)
  updateProjectValue: (id: string, totalProjectValue: number) =>
    api.put<{ data: PaymentSchedule }>(
      `/payments/schedules/${id}/project-value`,
      {
        totalProjectValue,
      }
    ),

  // Update payment structure/milestones (admin)
  updatePaymentStructure: (
    id: string,
    milestones: Array<{
      timeline: string;
      percentage: number;
      actualPaid?: number;
    }>
  ) =>
    api.put<{ data: PaymentSchedule }>(`/payments/schedules/${id}/structure`, {
      milestones,
    }),

  // Update current milestone (admin)
  updateCurrentMilestone: (id: string, currentMilestone: number) =>
    api.put<{ data: PaymentSchedule }>(
      `/payments/schedules/${id}/current-milestone`,
      {
        currentMilestone,
      }
    ),

  // Update milestone payment
  updateMilestonePayment: (
    scheduleId: string,
    milestoneId: string,
    data: {
      amount: number;
      paymentMethod?: string;
      paymentReference?: string;
    }
  ) =>
    api.put<{ data: PaymentSchedule }>(
      `/payments/schedules/${scheduleId}/milestone/${milestoneId}`,
      data
    ),
};

export const paymentApi = {
  // Create new payment order
  createOrder: (data: { amount: number; projectId: string; userId: string }) =>
    api.post("/payments/create-order", data),

  // Verify payment after successful payment
  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    amount: number;
    projectId: string;
    userId: string;
  }) => api.post("/payments/verify-payment", data),

  // Check transaction status
  checkTransactionStatus: (orderId: string) =>
    api.get("/payments/transaction-status", { params: { orderId } }),

  // Add manual payment (admin only)
  addManualPayment: (data: {
    amount: number;
    projectId: string;
    userId: string;
  }) => api.post("/payments/manual-payment", data),
};
