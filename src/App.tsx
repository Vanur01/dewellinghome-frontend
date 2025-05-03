import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Dashboard from "./pages/user/Dashboard";
import WarrantyClaimPage from "./pages/user/Warranty";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminWarranty from "./pages/admin/AdminWarranty";
import AdminProjects from "./pages/admin/Projects/AdminProjects";
import AdminUsers from "./pages/admin/AdminUsers";
import ModularKitchen from "./pages/modular-kitchen/Home";
import DesignGallary from "./pages/design-gallary/Home";
import WardrobeInteriorDesign from "./pages/Wardrobe";
import BedroomInteriorDesign from "./pages/Bedroom";
import LivingroomInteriorDesign from "./pages/Livingroom";
import BathroomInteriorDesign from "./pages/Bathroom";
import SpaceSavingFurniture from "./pages/SpaceSavingFurniture";
import Home from "./pages/homepage/Home";
import ReferEarn from "./pages/user/ReferEarn";
import Payment from "./pages/user/Payment/Payment";
import AdminPayment from "./pages/admin/Payment/AdminPayment";
import GetEstimate from "./pages/GetEstimate";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/auth.store";
import AdminReferrals from "./pages/admin/AdminReferrals";
import Inquiries from "./pages/admin/Inquiry/AdminInquiries";
import ProtectedRoute from "./components/ProtectedRoutes";
import ProjectDetails from "./pages/user/Project/ProjectDetails";
import CreateProject from "./pages/admin/Projects/CreateProject";
import ViewProject from "./pages/admin/Projects/ViewProject";
import EditProject from "./pages/admin/Projects/EditProject";
import ProjectProgress from "./pages/admin/Projects/ProjectProgress";
import Projects from "./pages/user/Project/Projects";
import ProgressDetails from "./pages/user/Project/ProgressDetails";
import GalleryList from "./pages/admin/Gallery/GalleryList";
import Designs from "./pages/admin/Gallery/Designs";
import AdminTestimonial from "./pages/admin/AdminTestimonial";
import LoadingScreen from "./components/LoadingScreen";
import Profile from "./pages/user/Profile";
import CreatePayment from "./pages/admin/Payment/CreatePayment";
import KitchenEstimate from "./pages/KitchenEstimate";
import ViewInquiry from "./pages/admin/Inquiry/VeiwInquiry";
import ScrollToTop from "./components/ScrollToTop";
import PaymentDetails from "./pages/admin/Payment/PaymentDetails";
import PaymentScheduleDetails from "./pages/user/Payment/PaymentScheduleDetails";

function App() {
  const { restoreSession, isLoading } = useAuthStore();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const minimumLoadingTime = 2000; // 2 seconds minimum display time
    console.log('isLoading', isLoading);

    restoreSession()
      .catch((error) => {
        console.error('Failed to restore session:', error);
        // You might want to show an error toast or handle the error in some way
      })
      .finally(() => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);
        
        setTimeout(() => {
          setShowLoading(false);
        }, remainingTime);
      });
  }, []);

  if (showLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* <Route path="*" element={<UnderConstruction />} /> */}
        Temporarily commented routes
        <Route element={<RootLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/get-estimate" element={<GetEstimate />} />
          <Route path="/kitchen-estimate" element={<KitchenEstimate />} />

          {/* User-Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="projects" element={<Projects />} />
              <Route path="profile" element={<Profile />} />
              <Route path="projects/:projectId" element={<ProjectDetails />} />
              <Route
                path="projects/:projectId/progress"
                element={<ProgressDetails />}
              />
              <Route path="warranty" element={<WarrantyClaimPage />} />
              <Route path="refer&earn" element={<ReferEarn />} />
              <Route path="payment" element={<Payment />} />
              <Route path="payment/:projectId" element={<PaymentScheduleDetails />} />
            </Route>
          </Route>

          {/* Admin-Protected Routes */}
          <Route element={<ProtectedRoute requireAdmin />}>
            <Route path="/admin" element={<AdminDashboard />}>
              <Route path="warranty" element={<AdminWarranty />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="projects/:id" element={<ViewProject />} />
              <Route path="projects/edit/:id" element={<EditProject />} />
              <Route
                path="projects/:id/progress"
                element={<ProjectProgress />}
              />
              <Route path="users" element={<AdminUsers />} />
              <Route path="referral" element={<AdminReferrals />} />
              <Route path="payments" element={<AdminPayment />} />
              <Route path="payments/new" element={<CreatePayment />} />
              <Route path="payments/:scheduleId" element={<PaymentDetails />} />
              <Route path="inquiries" element={<Inquiries />} />
              <Route path="inquiries/:id" element={<ViewInquiry />} />
              <Route path="projects/create" element={<CreateProject />} />
              <Route path="gallery" element={<GalleryList />} />
              <Route path="/admin/gallery" element={<GalleryList />} />
              <Route
                path="/admin/gallery/:galleryId/designs"
                element={<Designs />}
              />
              <Route path="testimonials" element={<AdminTestimonial />} />
            </Route>
          </Route>

          {/* Still Public */}
          <Route path="modular-kitchen" element={<ModularKitchen />} />
          <Route path="design-gallary" element={<DesignGallary />} />
          <Route path="wardrobe" element={<WardrobeInteriorDesign />} />
          <Route path="bedroom" element={<BedroomInteriorDesign />} />
          <Route path="living-room" element={<LivingroomInteriorDesign />} />
          <Route path="bathroom" element={<BathroomInteriorDesign />} />
          <Route
            path="space-saving-furniture"
            element={<SpaceSavingFurniture />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;