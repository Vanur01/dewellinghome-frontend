import { api } from "./axiosInstance";

// Project types
export interface ProjectItem {
  _id?: string;
  category: string;
  name: string;
  units: number;
  size: string;
  materials: string;
  notes?: string;
}

export interface CreateProjectData {
  clientId: string;
  title: string;
  location: string;
  status: "planning" | "designing" | "in_progress" | "completed" | "on_hold";
  startDate: Date;
  estimatedEndDate: Date;
  budget: number;
  notes?: string;
  items: ProjectItem[];
  gallery?: string[];
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  existingImages?: string[];
}

export interface Testimonial {
  _id?: string;
  clientId?: string;
  projectId?: string;
  name: string;
  address?: string;
  feedback: string;
  image?: string;
  youtubeLink?: string;
  rating?: number;
  showOnWebsite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTestimonialData {
  name: string;
  address?: string;
  feedback: string;
  youtubeLink?: string;
  rating?: number;
  clientId?: string;
  projectId?: string;
  showOnWebsite?: boolean;
  image?: File;
}

// Add Payment Types
export interface PaymentMilestone {
  slNo: number;
  timeline: string;
  percentage: number;
  amount: number;
  actualPaid: number;
  effectivePaid: number;
  overpayment: number;
  toBePaid: number;
  paymentDate?: Date;
  paymentMethod?: string;
  paymentReference?: string;
  status: "pending" | "partially_paid" | "paid";
}

// Update PaymentSchedule type to handle both populated and unpopulated versions
export interface Project {
  _id: string;
  title: string;
  clientId: { _id: string; name: string };
  status: string;
  startDate: string;
  estimatedEndDate: string;
}

export interface PaymentSchedule {
  _id: string;
  projectId: Project;
  currentMilestone: number;
  totalProjectValue: number;
  milestones: PaymentMilestone[];
  totalPaid: number;
  totalRemaining: number;
  totalOverpayment: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Custom config type with retry flag


// API endpoints
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (
    email: string,
    password: string,
    name: string,
    address: string,
    phone: string
  ) => api.post("/auth/register", { email, password, name, address, phone }),

  logout: () => api.post("/auth/logout"),

  refresh: () => api.post("/auth/refresh"),

  me: () => api.get("/auth/me"),
};

// Add new types for kitchen configuration
export interface WallDimension {
  feet: number;
  inches: number;
}

export interface WallDimensions {
  wallA: {
    length: WallDimension;
    height: WallDimension;
  };
  wallB?: {
    length: WallDimension;
    height: WallDimension;
  };
  wallC?: {
    length: WallDimension;
    height: WallDimension;
  };
}

export interface KitchenConfiguration {
  homeType: string;
  kitchenLayout: string;
  wallDimensions: WallDimensions;
  cabinetMaterial: string;
  shutterMaterial: string;
  carcassMaterial: string;
  accessories: Record<string, number>;
}

// Update inquiry types
export interface InquiryItem {
  category: string;
  name: string;
  units: number;
  size: string;
}

export const inquiryApi = {
  createInquiry: (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    message?: string;
    countryCode?: string;
    homeType?: string;
    purpose?: string;
    items?: InquiryItem[];
    kitchenConfiguration?: KitchenConfiguration;
  }) => api.post("/inquiries", data),

  getInquiries: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    name?: string;
    phone?: string;
    email?: string;
    status: string;
  }) =>
    api.get("/inquiries", {
      params: { ...params, limit: params?.limit || 10 },
    }),

  getInquiryById: (id: string) => api.get(`/inquiries/${id}`),

  updateInquiryStatus: (id: string, status: string) =>
    api.patch(`/inquiries/${id}/status`, { status }),

  deleteInquiry: (id: string) => api.delete(`/inquiries/${id}`),
};

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

export const userApi = {
  getAllUsers: (params: {
    page: number;
    limit: number;
    name: string;
    email: string;
    phone: string;
  }) => api.get("/users", { params }),

  searchUser: (params: {
    page: number;
    limit: number;
    name: string;
    phone: string;
  }) => api.get(`/users/search`, { params }),

  getUserById: (userId: string) => api.get(`/users/${userId}`),

  deleteUser: (userId: string) => api.delete(`/users/${userId}`),

  createUser: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    role?: "admin" | "client";
  }) => api.post("/users", data),

  updateUser: (
    userId: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
    }
  ) => api.put(`/users/${userId}`, data),

  // New profile endpoints
  getProfile: () => api.get("/users/profile"),

  updateProfile: (data: FormData) =>
    api.put("/users/profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export const dashboardApi = {
  getOverview: () => api.get("/dashboard/overview"),
};

export const warrantyApi = {
  createWarrantyClaim: (formData: FormData) =>
    api.post("/warranty", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getUserClaims: (params?:{userId:string}) => api.get("/warranty/user-warranty-claims",{ params }),

  getAllClaims: (params?: {
    page?: number;
    limit?: number;
    status?: "pending" | "in-review" | "approved" | "rejected" | "resolved";
  }) => api.get("/warranty", { params }),

  getClaimById: (id: string) => api.get(`/warranty/${id}`),

  updateClaimStatus: (
    id: string,
    data: {
      status: "pending" | "in-review" | "approved" | "rejected" | "resolved";
      adminNotes?: string;
    }
  ) => api.patch(`/warranty/${id}/status`, data),

  deleteClaim: (id: string) => api.delete(`/warranty/${id}`),
};

export const projectApi = {
  getProjects: (params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => api.get("/projects", { params }),

  searchProjects: (query: string) =>
    api.get("/projects/search", { params: { search: query } }),

  getUserProjects: (
    params?: {
    userId?: string,
      page?: number;
      limit?: number;
      status?: "planning" | "designing" | "in_progress" | "completed" | "on_hold";
      search?: string;
    }
  ) => api.get(`/projects/user-projects`, { params }),
  

  getProjectById: (id: string) => api.get(`/projects/${id}`),

  createProject: (data: CreateProjectData | FormData) =>
    api.post("/projects", data, {
      headers:
        data instanceof FormData
          ? {
              "Content-Type": "multipart/form-data",
            }
          : {
              "Content-Type": "application/json",
            },
    }),

  updateProject: (id: string, data: UpdateProjectData | FormData) =>
    api.put(`/projects/${id}`, data, {
      headers:
        data instanceof FormData
          ? {
              "Content-Type": "multipart/form-data",
            }
          : {
              "Content-Type": "application/json",
            },
    }),

  deleteProject: (id: string) => api.delete(`/projects/${id}`),

  addProjectItem: (projectId: string, item: Omit<ProjectItem, "_id">) =>
    api.post(`/projects/${projectId}/items`, item),

  removeProjectItem: (projectId: string, itemId: string) =>
    api.delete(`/projects/${projectId}/items/${itemId}`),

  uploadProjectImages: (projectId: string, images: FormData) =>
    api.post(`/projects/${projectId}/gallery`, images, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteProjectImage: (projectId: string, imageId: string) =>
    api.delete(`/projects/${projectId}/gallery/${imageId}`),
};

export const progressApi = {
  getAllProgress: (params?: { page?: number; limit?: number }) =>
    api.get("/progress", { params }),

  getProjectProgress: (
    projectId: string,
    params?: { page?: number; limit?: number }
  ) => api.get(`/progress/project/${projectId}`, { params }),

  getProgressById: (id: string) => api.get(`/progress/${id}`),

  createProgress: (data: FormData) =>
    api.post("/progress", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateProgress: (id: string, data: FormData) =>
    api.put(`/progress/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteProgress: (id: string) => api.delete(`/progress/${id}`),
};

export const galleryApi = {
  // Admin endpoints only
  createGallery: (data: {
    title: string;
    category: string;
    description: string;
  }) => api.post("/gallery", data),

  updateGallery: (
    galleryId: string,
    data: {
      title?: string;
      category?: string;
      description?: string;
    }
  ) => api.put(`/gallery/${galleryId}`, data),

  deleteGallery: (galleryId: string) => api.delete(`/gallery/${galleryId}`),

  addDesignToGallery: (galleryId: string, data: FormData) =>
    api.post(`/gallery/${galleryId}/designs`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateDesign: (galleryId: string, designId: string, data: FormData) =>
    api.put(`/gallery/${galleryId}/designs/${designId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteDesign: (galleryId: string, designId: string) =>
    api.delete(`/gallery/${galleryId}/designs/${designId}`),
};

export const testimonialApi = {
  getAllTestimonials: (params?: { page?: number; limit?: number }) =>
    api.get("/testimonials", { params }),

  getTestimonialById: (id: string) => api.get(`/testimonials/${id}`),

  createTestimonial: (data: FormData) =>
    api.post("/testimonials", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateTestimonial: (id: string, data: FormData) =>
    api.put(`/testimonials/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteTestimonial: (id: string) => api.delete(`/testimonials/${id}`),
};

// Separate payment schedule and transaction APIs
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

export interface Transaction {
  _id: string;
  method: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  projectId: {
    _id: string;
    title: string;
  };
  amount: number;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  status: string;
  paidAt: string;
}

export const transactionApi = {
  // Get all transactions (admin only)
  getAllTransactions: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentId?: string;
    orderId?: string;
  }) =>
    api.get<{data:{
      transactions: Transaction[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalTransactions: number;
        limit: number;
     } };
    }>("/transactions", { params }),

  // Get user's transactions
  getUserTransactions: (params?: { page?: number; limit?: number }) =>
    api.get<{
      data: {
        transactions: Transaction[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalTransactions: number;
          limit: number;
        };
      };
    }>("/transactions/my-transactions", { params }),

  // Get transaction by ID (admin only)
  getTransactionById: (id: string) =>
    api.get<{data:{ transaction: Transaction }}>(`/transactions/${id}`),

   // Update a manual transaction (admin only)
   updateTransaction: (id: string, amount: number) =>
    api.put<{ data: { transaction: Transaction } }>(
      `/transactions/${id}`,
      { amount }
    ),

  // Get transactions by project ID
  getProjectTransactions: (projectId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) =>
    api.get<{
      data: {
        transactions: Transaction[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalTransactions: number;
          limit: number;
        };
      };
    }>(`/transactions/project/${projectId}`, { params }),
};

// Get transaction by ID

// Add Partner interface
export interface Partner {
  _id: string;
  name: string;
  logo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Add partner API endpoints
export const partnerApi = {
  // Get all active partners (public)
  getAllPartners: () => 
    api.get<{ data: Partner[] }>('/partners'),

  // Get all partners including inactive (admin)
  getAllPartnersAdmin: () => 
    api.get<{ data: Partner[] }>('/partners/admin'),

  // Create new partner (admin)
  createPartner: (formData: FormData) =>
    api.post<{ data: Partner }>('/partners', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // Update partner (admin)
  updatePartner: (id: string, formData: FormData) =>
    api.patch<{ data: Partner }>(`/partners/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // Delete partner (admin)
  deletePartner: (id: string) =>
    api.delete<{ message: string }>(`/partners/${id}`),
};

export const teamApi = {
  // Public: Get the team (leadership and employees)
  getTeam: () => api.get('/team'),

  // Admin: Add a leadership member
  addLeadershipMember: (formData: FormData) =>
    api.post('/team/leadership', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Admin: Add an employee
  addEmployee: (formData: FormData) =>
    api.post('/team/employees', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Admin: Update a leadership member by index
  updateLeadershipMember: (index: number, formData: FormData) =>
    api.put(`/team/leadership/${index}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Admin: Update an employee by index
  updateEmployee: (index: number, formData: FormData) =>
    api.put(`/team/employees/${index}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Admin: Delete a leadership member by index
  deleteLeadershipMember: (index: number) =>
    api.delete(`/team/leadership/${index}`),

  // Admin: Delete an employee by index
  deleteEmployee: (index: number) =>
    api.delete(`/team/employees/${index}`),
};

export default api;
