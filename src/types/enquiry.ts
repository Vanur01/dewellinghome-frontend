export interface Item {
  category: string;
  name: string;
  units: number;
  size: string;
}

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
  pincode: string;
  countryCode: string;
  message?: string;
}

export interface ProjectDetails {
  items: Item[];
}

export interface EnquiryData {
  userDetails: UserDetails;
  projectDetails: ProjectDetails;
  setUserDetails: (data: Partial<UserDetails>) => void;
  setProjectDetails: (data: Partial<ProjectDetails>) => void;
  resetEnquiryData: () => void;
}
