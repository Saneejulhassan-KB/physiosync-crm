import { Layout } from "@/components/layout/Layout";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminLabPharmacy from "@/pages/admin/AdminLabPharmacy";
import AdminLeads from "@/pages/admin/AdminLeads";
import AdminPatients from "@/pages/admin/AdminPatients";
import AdminPermissions from "@/pages/admin/AdminPermissions";
import AdminReception from "@/pages/admin/AdminReception";
import AdminSalesManagement from "@/pages/admin/AdminSalesManagement";
import AdminSettings from "@/pages/admin/AdminSettings";
import Analytics from "@/pages/admin/Analytics";
import AuditLogs from "@/pages/admin/AuditLogs";
import StaffManagement from "@/pages/admin/StaffManagement";
import DoctorAppointments from "@/pages/doctor/Appointments";
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import DoctorNotifications from "@/pages/doctor/DoctorNotifications";
import PatientDetail from "@/pages/doctor/PatientDetail";
import PatientList from "@/pages/doctor/PatientList";
import PatientAppointments from "@/pages/patient/PatientAppointments";
import PatientBilling from "@/pages/patient/PatientBilling";
import PatientDashboard from "@/pages/patient/PatientDashboard";
import PatientNotifications from "@/pages/patient/PatientNotifications";
import PatientPrescriptions from "@/pages/patient/PatientPrescriptions";
import PatientProfile from "@/pages/patient/PatientProfile";
import PatientProgress from "@/pages/patient/PatientProgress";
import PatientReports from "@/pages/patient/PatientReports";
import AppointmentBooking from "@/pages/receptionist/AppointmentBooking";
import Billing from "@/pages/receptionist/Billing";
import PatientRegistration from "@/pages/receptionist/PatientRegistration";
import Queue from "@/pages/receptionist/Queue";
import ReceptionistDashboard from "@/pages/receptionist/ReceptionistDashboard";
import GymFitnessTab from "@/pages/sales/GymFitnessTab";
import HospitalVisitTab from "@/pages/sales/HospitalVisitTab";
import SalesDashboard from "@/pages/sales/SalesDashboard";
import { useAuthStore } from "@/stores/authStore";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

// Root route
const rootRoute = createRootRoute();

// / → redirect to /login
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});

// /login
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

// Auth guard helper — throws redirect to /login when not authenticated
function requireAuth() {
  const { isAuthenticated } = useAuthStore.getState();
  if (!isAuthenticated) {
    throw redirect({ to: "/login" });
  }
}

// /admin — Layout wrapper
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: requireAuth,
  component: Layout,
});

const adminIndexRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/",
  component: AdminDashboard,
});

const adminStaffRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/staff",
  component: StaffManagement,
});

const adminAnalyticsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/analytics",
  component: Analytics,
});

const adminAuditLogsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/audit-logs",
  component: AuditLogs,
});

const adminPatientsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/patients",
  component: AdminPatients,
});

const adminLeadsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/leads",
  component: AdminLeads,
});

const adminPermissionsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/permissions",
  component: AdminPermissions,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/settings",
  component: AdminSettings,
});

const adminReceptionRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/reception",
  component: AdminReception,
});

const adminSalesMgmtRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/sales-mgmt",
  component: AdminSalesManagement,
});

const adminLabPharmacyRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/lab-pharmacy",
  component: AdminLabPharmacy,
});

// /doctor — Layout wrapper
const doctorLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/doctor",
  beforeLoad: requireAuth,
  component: Layout,
});

const doctorIndexRoute = createRoute({
  getParentRoute: () => doctorLayoutRoute,
  path: "/",
  component: DoctorDashboard,
});

const doctorPatientsRoute = createRoute({
  getParentRoute: () => doctorLayoutRoute,
  path: "/patients",
  component: PatientList,
});

const doctorPatientDetailRoute = createRoute({
  getParentRoute: () => doctorLayoutRoute,
  path: "/patients/$patientId",
  component: PatientDetail,
});

const doctorAppointmentsRoute = createRoute({
  getParentRoute: () => doctorLayoutRoute,
  path: "/appointments",
  component: DoctorAppointments,
});

const doctorNotificationsRoute = createRoute({
  getParentRoute: () => doctorLayoutRoute,
  path: "/notifications",
  component: DoctorNotifications,
});

// /receptionist — Layout wrapper
const receptionistLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/receptionist",
  beforeLoad: requireAuth,
  component: Layout,
});

const receptionistIndexRoute = createRoute({
  getParentRoute: () => receptionistLayoutRoute,
  path: "/",
  component: ReceptionistDashboard,
});

const receptionistRegistrationRoute = createRoute({
  getParentRoute: () => receptionistLayoutRoute,
  path: "/registration",
  component: PatientRegistration,
});

const receptionistAppointmentsRoute = createRoute({
  getParentRoute: () => receptionistLayoutRoute,
  path: "/appointments",
  component: AppointmentBooking,
});

const receptionistQueueRoute = createRoute({
  getParentRoute: () => receptionistLayoutRoute,
  path: "/queue",
  component: Queue,
});

const receptionistBillingRoute = createRoute({
  getParentRoute: () => receptionistLayoutRoute,
  path: "/billing",
  component: Billing,
});

// /sales — Layout wrapper
const salesLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sales",
  beforeLoad: requireAuth,
  component: Layout,
});

const salesIndexRoute = createRoute({
  getParentRoute: () => salesLayoutRoute,
  path: "/",
  component: SalesDashboard,
});

const salesHospitalVisitRoute = createRoute({
  getParentRoute: () => salesLayoutRoute,
  path: "/hospital-visit",
  component: HospitalVisitTab,
});

const salesGymOutreachRoute = createRoute({
  getParentRoute: () => salesLayoutRoute,
  path: "/gym-outreach",
  component: GymFitnessTab,
});

// /patient — Layout wrapper
const patientLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/patient",
  beforeLoad: requireAuth,
  component: Layout,
});

const patientIndexRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: "/",
  component: PatientDashboard,
});

const patientAppointmentsRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: "/appointments",
  component: PatientAppointments,
});

const patientReportsRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: "/reports",
  component: PatientReports,
});

const patientPrescriptionsRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: "/prescriptions",
  component: PatientPrescriptions,
});

const patientNotificationsRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: "/notifications",
  component: PatientNotifications,
});

const patientProgressRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: "/progress",
  component: PatientProgress,
});

const patientBillingRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: "/billing",
  component: PatientBilling,
});

const patientProfileRoute = createRoute({
  getParentRoute: () => patientLayoutRoute,
  path: "/profile",
  component: PatientProfile,
});

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminLayoutRoute.addChildren([
    adminIndexRoute,
    adminStaffRoute,
    adminAnalyticsRoute,
    adminAuditLogsRoute,
    adminPatientsRoute,
    adminLeadsRoute,
    adminPermissionsRoute,
    adminSettingsRoute,
    adminReceptionRoute,
    adminSalesMgmtRoute,
    adminLabPharmacyRoute,
  ]),
  doctorLayoutRoute.addChildren([
    doctorIndexRoute,
    doctorPatientsRoute,
    doctorPatientDetailRoute,
    doctorAppointmentsRoute,
    doctorNotificationsRoute,
  ]),
  receptionistLayoutRoute.addChildren([
    receptionistIndexRoute,
    receptionistRegistrationRoute,
    receptionistAppointmentsRoute,
    receptionistQueueRoute,
    receptionistBillingRoute,
  ]),
  salesLayoutRoute.addChildren([
    salesIndexRoute,
    salesHospitalVisitRoute,
    salesGymOutreachRoute,
  ]),
  patientLayoutRoute.addChildren([
    patientIndexRoute,
    patientAppointmentsRoute,
    patientReportsRoute,
    patientPrescriptionsRoute,
    patientNotificationsRoute,
    patientProgressRoute,
    patientBillingRoute,
    patientProfileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 5000,
          classNames: {
            toast: "font-body",
          },
        }}
      />
    </ThemeProvider>
  );
}
