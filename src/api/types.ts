// Common types used across different APIs

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

export interface Project {
  _id: string;
  title: string;
  clientId: { _id: string; name: string };
  status: string;
  startDate: string;
  estimatedEndDate: string;
}

// Testimonial types
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

// Payment types
export interface PaymentMilestone {
  slNo: number;
  timeline: string;
  percentage: number;
  baseAmount: number;
  carriedOverOutstanding: number;
  amount: number;
  actualPaid: number;
  toBePaid: number;
  paymentDate?: Date;
  paymentMethod?: string;
  paymentReference?: string;
  status: "pending" | "partially_paid" | "paid";
}

export interface PaymentSchedule {
  _id: string;
  projectId: Project;
  currentMilestone: number;
  totalProjectValue: number;
  milestones: PaymentMilestone[];
  totalPaid: number;
  totalRemaining: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction types
export interface Transaction {
  _id: string;
  transactionId: string;
  method: "razorpay" | "cash" | "cheque" | "upi" | "bank_transfer" | "other";
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
  status: "success" | "processing" | "failed";
  isVerified: boolean;
  paymentReference?: string;
  paidAt: string;
  notes?: string;
  recordedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateManualTransactionData {
  projectId: string;
  amount: number;
  method: "cash" | "cheque" | "upi" | "bank_transfer" | "other";
  paymentReference?: string;
  notes?: string;
  paidAt?: string;
}

export interface UpdateTransactionData {
  amount: number;
  method?: "cash" | "cheque" | "upi" | "bank_transfer" | "other";
  paymentReference?: string;
  notes?: string;
  paidAt?: string;
}

export interface TransactionSummary {
  summary: Array<{
    _id: string;
    totalAmount: number;
    count: number;
  }>;
  methodSummary: Array<{
    _id: string;
    totalAmount: number;
    count: number;
  }>;
  totalPaid: {
    totalAmount: number;
    count: number;
  };
}

// Kitchen configuration types
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

// Inquiry types
export interface InquiryItem {
  category: string;
  name: string;
  units: number;
  size: string;
}

// Partner types
export interface Partner {
  _id: string;
  name: string;
  logo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
