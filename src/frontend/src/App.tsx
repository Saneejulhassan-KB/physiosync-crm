import { Layout } from "@/components/layout/Layout";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import Analytics from "@/pages/admin/Analytics";
import AuditLogs from "@/pages/admin/AuditLogs";
import StaffManagement from "@/pages/admin/StaffManagement";
import DoctorAppointments from "@/pages/doctor/Appointments";
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import DoctorNotifications from "@/pages/doctor/DoctorNotifications";
import PatientDetail from "@/pages/doctor/PatientDetail";
import PatientList from "@/pages/doctor/PatientList";
import AppointmentBooking from "@/pages/receptionist/AppointmentBooking";
import Billing from "@/pages/receptionist/Billing";
import PatientRegistration from "@/pages/receptionist/PatientRegistration";
import Queue from "@/pages/receptionist/Queue";
import ReceptionistDashboard from "@/pages/receptionist/ReceptionistDashboard";
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

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  adminLayoutRoute.addChildren([
    adminIndexRoute,
    adminStaffRoute,
    adminAnalyticsRoute,
    adminAuditLogsRoute,
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
