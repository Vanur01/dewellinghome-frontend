import RootLayout from './components/RootLayout';
import Home from './pages/homepage/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import GetEstimate from './pages/GetEstimate';
import KitchenEstimate from './pages/KitchenEstimate';
import Dashboard from './pages/user/Dashboard';
import Projects from './pages/user/Project/Projects';
import Profile from './pages/user/Profile';
import ProjectDetails from './pages/user/Project/ProjectDetails';
import ProgressDetails from './pages/user/Project/ProgressDetails';
import WarrantyClaimPage from './pages/user/Warranty';
import ReferEarn from './pages/user/ReferEarn';
import Payment from './pages/user/Payment/Payment';
import PaymentScheduleDetails from './pages/user/Payment/PaymentScheduleDetails';
import Transactions from './pages/user/Transactions/Transactions';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import AdminWarranty from './pages/admin/Warranty/AdminWarranty';
import AdminProjects from './pages/admin/Projects/AdminProjects';
import ViewProject from './pages/admin/Projects/ViewProject';
import EditProject from './pages/admin/Projects/EditProject';
import ProjectProgress from './pages/admin/Projects/ProjectProgress';
import ProjectTransactions from './pages/ProjectTransations';
import AdminUsers from './pages/admin/Users/AdminUsers';
import AdminReferrals from './pages/admin/AdminReferrals';
import AdminPayment from './pages/admin/Payment/AdminPayment';
import CreatePayment from './pages/admin/Payment/CreatePayment';
import PaymentDetails from './pages/admin/Payment/PaymentDetails';
import Inquiries from './pages/admin/Inquiry/AdminInquiries';
import ViewInquiry from './pages/admin/Inquiry/VeiwInquiry';
import CreateProject from './pages/admin/Projects/CreateProject';
import GalleryList from './pages/admin/Gallery/GalleryList';
import Designs from './pages/admin/Gallery/Designs';
import AdminTransactionsTable from './pages/admin/Transactions/AdminTransactions';
import CreateTransaction from './pages/admin/Transactions/CreateTransaction';
import AdminTestimonial from './pages/admin/AdminTestimonial';
import ModularKitchen from './pages/modular-kitchen/Home';
import DesignGallary from './pages/design-gallary/Home';
import WardrobeInteriorDesign from './pages/Wardrobe';
import BedroomInteriorDesign from './pages/Bedroom';
import LivingroomInteriorDesign from './pages/Livingroom';
import BathroomInteriorDesign from './pages/Bathroom';
import SpaceSavingFurniture from './pages/SpaceSavingFurniture';
import TeamPage from './pages/TeamPage';
import ContactUsPage from './pages/ContactUsPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsandConditions';
import RefundCancellation from './pages/RefundCancellation';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoutes';
import UserInfo from './pages/admin/Users/UserInfo';
import AdminPartners from './pages/admin/AdminPartners';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminTeam from './pages/admin/Team/AdminTeam';
import EditTransaction from './pages/admin/Transactions/EditTransaction';

export const routes = [
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
        meta: {
          title: 'Home | Dewelling',
          description: 'Transform your living space with Dewelling - Your premier interior design partner.',
        },
      },
      {
        path: '/login',
        element: <Login />,
        meta: {
          title: 'Login | Dewelling',
          description: 'Access your Dewelling account to manage your interior design projects.',
        },
      },
      {
        path: '/signup',
        element: <Signup />,
        meta: {
          title: 'Sign Up | Dewelling',
          description: 'Create your Dewelling account to start your interior design journey.',
        },
      },
      {
        path: '/get-estimate',
        element: <GetEstimate />,
        meta: {
          title: 'Get Estimate | Dewelling',
          description: 'Get a free estimate for your interior design project.',
        },
      },
      {
        path: '/kitchen-estimate',
        element: <KitchenEstimate />,
        meta: {
          title: 'Kitchen Estimate | Dewelling',
          description: 'Get a detailed estimate for your kitchen renovation project.',
        },
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
        meta: {
          title: 'Forgot Password | Dewelling',
          description: 'Reset your Dewelling account password.',
        },
      },
      {
        path: '/reset-password/:token',
        element: <ResetPassword />,
        meta: {
          title: 'Reset Password | Dewelling',
          description: 'Set your new Dewelling account password.',
        },
      },
      {
        element: <ProtectedRoute allowedRoles={['client']} />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
            meta: {
              title: 'Dashboard | Dewelling',
              description: 'Manage your interior design projects and account settings.',
            },
            children: [
              {
                path: 'projects',
                element: <Projects />,
                meta: {
                  title: 'My Projects | Dewelling',
                  description: 'View and manage your ongoing interior design projects.',
                },
              },
              {
                path: 'profile',
                element: <Profile />,
                meta: {
                  title: 'My Profile | Dewelling',
                  description: 'Manage your personal information and preferences.',
                },
              },
              {
                path: 'projects/:projectId',
                element: <ProjectDetails />,
                meta: {
                  title: 'Project Details | Dewelling',
                  description: 'View detailed information about your interior design project.',
                },
              },
              {
                path: 'projects/:projectId/progress',
                element: <ProgressDetails />,
                meta: {
                  title: 'Project Progress | Dewelling',
                  description: 'Track the progress of your interior design project.',
                },
              },
              {
                path: 'warranty',
                element: <WarrantyClaimPage />,
                meta: {
                  title: 'Warranty Claims | Dewelling',
                  description: 'Submit and manage your warranty claims.',
                },
              },
              {
                path: 'refer&earn',
                element: <ReferEarn />,
                meta: {
                  title: 'Refer & Earn | Dewelling',
                  description: 'Refer friends and earn rewards with Dewelling.',
                },
              },
              {
                path: 'payment',
                element: <Payment />,
                meta: {
                  title: 'Payments | Dewelling',
                  description: 'Manage your payments and view payment history.',
                },
              },
              {
                path: 'payment/:projectId',
                element: <PaymentScheduleDetails />,
                meta: {
                  title: 'Payment Schedule | Dewelling',
                  description: 'View and manage your project payment schedule.',
                },
              },
              {
                path: 'transactions',
                element: <Transactions />,
                meta: {
                  title: 'Transactions | Dewelling',
                  description: 'View your transaction history with Dewelling.',
                },
              },
              {
                path: 'projects/:id/transactions',
                element: <ProjectTransactions />,
                meta: {
                  title: 'Project Transactions | Dewelling',
                  description: 'View transaction history for a specific project.',
                },
              },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
                  {
          path: '/admin',
          element: <AdminLayout />,
          children: [
            {
              path:"dashboard",
              element: <AdminDashboard />,
              meta: {
                title: 'Admin Dashboard | Dewelling',
                description: 'Dewelling admin portal for managing projects and users.',
              },
            },
              {
                path: 'warranty',
                element: <AdminWarranty />,
                meta: {
                  title: 'Warranty Management | Admin',
                  description: 'Manage warranty claims and requests.',
                },
              },
              {
                path: 'partners',
                element: <AdminPartners />,
                meta: {
                  title: 'Trusted Partners | Admin',
                  description: 'Manage Trusted Partners and logos.',
                },
              },
              {
                path: 'projects',
                element: <AdminProjects />,
                meta: {
                  title: 'Projects Management | Admin',
                  description: 'Manage all interior design projects.',
                },
              },
              {
                path: 'projects/:id',
                element: <ViewProject />,
                meta: {
                  title: 'View Project | Admin',
                  description: 'View detailed project information.',
                },
              },
              {
                path: 'projects/edit/:id',
                element: <EditProject />,
                meta: {
                  title: 'Edit Project | Admin',
                  description: 'Edit project details and information.',
                },
              },
              {
                path: 'projects/:id/progress',
                element: <ProjectProgress />,
                meta: {
                  title: 'Project Progress | Admin',
                  description: 'Update and manage project progress.',
                },
              },
              {
                path: 'users',
                element: <AdminUsers />,
                meta: {
                  title: 'User Management | Admin',
                  description: 'Manage user accounts and permissions.',
                },
              },
              {
                path: 'users/:userId',
                element: <UserInfo />,
                meta: {
                  title: 'User Page | Admin',
                  description: 'View detailed user information. ',
                },
              },
              {
                path: 'referral',
                element: <AdminReferrals />,
                meta: {
                  title: 'Referral Management | Admin',
                  description: 'Manage referral program and rewards.',
                },
              },
              {
                path: 'payments',
                element: <AdminPayment />,
                meta: {
                  title: 'Payment Management | Admin',
                  description: 'Manage payments and financial transactions.',
                },
              },
              {
                path: 'payments/new',
                element: <CreatePayment />,
                meta: {
                  title: 'Create Payment | Admin',
                  description: 'Create new payment schedules and transactions.',
                },
              },
              {
                path: 'payments/:projectId',
                element: <PaymentDetails />,
                meta: {
                  title: 'Payment Details | Admin',
                  description: 'View detailed payment information.',
                },
              },
              {
                path: 'inquiries',
                element: <Inquiries />,
                meta: {
                  title: 'Inquiries | Admin',
                  description: 'Manage customer inquiries and requests.',
                },
              },
              {
                path: 'inquiries/:id',
                element: <ViewInquiry />,
                meta: {
                  title: 'View Inquiry | Admin',
                  description: 'View detailed inquiry information.',
                },
              },
              {
                path: 'projects/create',
                element: <CreateProject />,
                meta: {
                  title: 'Create Project | Admin',
                  description: 'Create new interior design projects.',
                },
              },
              {
                path: 'gallery',
                element: <GalleryList />,
                meta: {
                  title: 'Gallery Management | Admin',
                  description: 'Manage design gallery and portfolios.',
                },
              },
              {
                path: 'gallery/:galleryId/designs',
                element: <Designs />,
                meta: {
                  title: 'Design Management | Admin',
                  description: 'Manage design collections and categories.',
                },
              },
              {
                path: 'transactions',
                element: <AdminTransactionsTable />,
                meta: {
                  title: 'Transactions | Admin',
                  description: 'View and manage all financial transactions.',
                },
              },
              {
                path: 'transactions/create/:projectId?',
                element: <CreateTransaction />,
                meta: {
                  title: 'Create Transaction | Admin',
                  description: 'Create a new manual transaction.',
                },
              },
              {
                path: 'transactions/edit/:transactionId',
                element: <EditTransaction />,
                meta: {
                  title: 'Edit Transaction | Admin',
                  description: 'Edit an existing transaction.',
                },
              },
              {
                path: 'testimonials',
                element: <AdminTestimonial />,
                meta: {
                  title: 'Testimonials | Admin',
                  description: 'Manage customer testimonials and reviews.',
                },
              },
              {
                path: 'team',
                element: <AdminTeam />,
                meta: {
                  title: 'Team Management | Admin',
                  description: 'Manage leadership and employees for Dewelling.',
                },
              },
              {
                path: 'projects/:id/transactions',
                element: <ProjectTransactions />,
                meta: {
                  title: 'Project Transactions | Admin',
                  description: 'View and manage project-specific transactions.',
                },
              },
            ],
          },
        ],
      },
      {
        path: '/modular-kitchen',
        element: <ModularKitchen />,
        meta: {
          title: 'Modular Kitchen Design | Dewelling',
          description: 'Explore our modern modular kitchen designs and solutions.',
        },
      },
      {
        path: '/design-gallery',
        element: <DesignGallary />,
        meta: {
          title: 'Design Gallery | Dewelling',
          description: 'Browse our collection of interior design projects and inspirations.',
        },
      },
      {
        path: '/wardrobe',
        element: <WardrobeInteriorDesign />,
        meta: {
          title: 'Wardrobe Design | Dewelling',
          description: 'Custom wardrobe solutions for your home.',
        },
      },
      {
        path: '/bedroom',
        element: <BedroomInteriorDesign />,
        meta: {
          title: 'Bedroom Design | Dewelling',
          description: 'Create your perfect bedroom with our interior design services.',
        },
      },
      {
        path: '/living-room',
        element: <LivingroomInteriorDesign />,
        meta: {
          title: 'Living Room Design | Dewelling',
          description: 'Transform your living room with our expert design solutions.',
        },
      },
      {
        path: '/bathroom',
        element: <BathroomInteriorDesign />,
        meta: {
          title: 'Bathroom Design | Dewelling',
          description: 'Modern bathroom design solutions for your home.',
        },
      },
      {
        path: '/space-saving-furniture',
        element: <SpaceSavingFurniture />,
        meta: {
          title: 'Space Saving Furniture | Dewelling',
          description: 'Innovative space-saving furniture solutions for your home.',
        },
      },
      {
        path: '/team',
        element: <TeamPage />,
        meta: {
          title: 'Our Team | Dewelling',
          description: 'Meet our team of expert interior designers and professionals.',
        },
      },
      {
        path: '/contact-us',
        element: <ContactUsPage />,
        meta: {
          title: 'Contact Us | Dewelling',
          description: 'Get in touch with our team for your interior design needs.',
        },
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy />,
        meta: {
          title: 'Privacy Policy | Dewelling',
          description: 'Read our privacy policy and data protection guidelines.',
        },
      },
      {
        path: '/terms-and-conditions',
        element: <TermsAndConditions />,
        meta: {
          title: 'Terms and Conditions | Dewelling',
          description: 'Our terms of service and conditions of use.',
        },
      },
      {
        path: '/refund-cancellation',
        element: <RefundCancellation />,
        meta: {
          title: 'Refund & Cancellation Policy | Dewelling',
          description: 'Our refund and cancellation policy for interior design services.',
        },
      },
      {
        path: '/unauthorized',
        element: <Unauthorized />,
        meta: {
          title: 'Unauthorized Access | Dewelling',
          description: 'You do not have permission to access this page.',
        },
      },
    ],
  },
];
