import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UnderConstruction from './pages/Underconstruction';
import RootLayout from "./components/RootLayout";
import Dashboard from "./pages/user/Dashboard";
import Orders from "./pages/user/Orders";
import WarrantyClaimPage from "./pages/user/Warranty";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminWarranty from "./pages/admin/AdminWarranty";
import AdminProjects from "./pages/admin/AdminProjects";
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
import PaymentSchedule from "./components/PaymentSchedule";
import GetEstimate from "./pages/GetEstimate";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="*" element={<UnderConstruction />} /> */}
        Temporarily commented routes
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="orders" element={<Orders />} />
            <Route path="warranty" element={<WarrantyClaimPage />} />
            <Route path="refer&earn" element={<ReferEarn />} />
            <Route index element={<Orders />} />
          </Route>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="orders" element={<AdminOrders />} />
            <Route path="warranty" element={<AdminWarranty />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="orders/:orderId" element={<PaymentSchedule/>}/>
            <Route index element={<AdminOrders />} />
          </Route>
          <Route path="modular-kitchen" element={<ModularKitchen/>} />
          <Route path="design-gallary" element={<DesignGallary/>} />
          <Route path="wardrobe" element={<WardrobeInteriorDesign/>} />
          <Route path="bedroom" element={<BedroomInteriorDesign/>} />
          <Route path="living-room" element={<LivingroomInteriorDesign/>} />
          <Route path="bathroom" element={<BathroomInteriorDesign/>} />
          <Route path="space-saving-furniture" element={<SpaceSavingFurniture/>} />
          <Route path="get-estimate" element={<GetEstimate/>}/>
        </Route>
       
      </Routes>
    </Router>
  );
}

export default App;
