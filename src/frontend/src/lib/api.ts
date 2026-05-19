import type {
  Appointment,
  Doctor,
  FinancialSummary,
  Invoice,
  LabReport,
  Notification,
  Patient,
  PatientActivity,
  Prescription,
  RevenueData,
  StaffMember,
  TherapySession,
} from "@/types";
import {
  MOCK_APPOINTMENTS,
  MOCK_DOCTORS,
  MOCK_FINANCIAL,
  MOCK_INVOICES,
  MOCK_LAB_REPORTS,
  MOCK_NOTIFICATIONS,
  MOCK_PATIENTS,
  MOCK_PATIENT_ACTIVITIES,
  MOCK_PRESCRIPTIONS,
  MOCK_REVENUE_DATA,
  MOCK_STAFF,
  MOCK_THERAPY_SESSIONS,
} from "./mockData";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const api = {
  // Patients
  getPatients: async (): Promise<Patient[]> => {
    await delay(rand(200, 400));
    return [...MOCK_PATIENTS];
  },
  getPatient: async (id: string): Promise<Patient | undefined> => {
    await delay(rand(150, 300));
    return MOCK_PATIENTS.find((p) => p.id === id);
  },

  // Appointments
  getAppointments: async (): Promise<Appointment[]> => {
    await delay(rand(200, 400));
    return [...MOCK_APPOINTMENTS];
  },
  getTodayAppointments: async (): Promise<Appointment[]> => {
    await delay(rand(150, 300));
    const today = new Date().toISOString().split("T")[0];
    return MOCK_APPOINTMENTS.filter(
      (a) => a.date === today || a.date === "2026-05-19",
    );
  },
  createAppointment: async (
    data: Partial<Appointment>,
  ): Promise<Appointment> => {
    await delay(rand(300, 500));
    return { ...data, id: `a${Date.now()}` } as Appointment;
  },

  // Doctors
  getDoctors: async (): Promise<Doctor[]> => {
    await delay(rand(150, 300));
    return [...MOCK_DOCTORS];
  },

  // Lab Reports
  getLabReports: async (): Promise<LabReport[]> => {
    await delay(rand(200, 400));
    return [...MOCK_LAB_REPORTS];
  },
  getLabReportsByPatient: async (patientId: string): Promise<LabReport[]> => {
    await delay(rand(150, 250));
    return MOCK_LAB_REPORTS.filter((r) => r.patientId === patientId);
  },

  // Prescriptions
  getPrescriptions: async (): Promise<Prescription[]> => {
    await delay(rand(200, 350));
    return [...MOCK_PRESCRIPTIONS];
  },
  getPrescriptionsByPatient: async (
    patientId: string,
  ): Promise<Prescription[]> => {
    await delay(rand(150, 250));
    return MOCK_PRESCRIPTIONS.filter((p) => p.patientId === patientId);
  },

  // Therapy
  getTherapySessions: async (): Promise<TherapySession[]> => {
    await delay(rand(200, 350));
    return [...MOCK_THERAPY_SESSIONS];
  },
  getTherapyByPatient: async (patientId: string): Promise<TherapySession[]> => {
    await delay(rand(150, 250));
    return MOCK_THERAPY_SESSIONS.filter((s) => s.patientId === patientId);
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    await delay(rand(100, 200));
    return [...MOCK_NOTIFICATIONS];
  },
  markNotificationRead: async (id: string): Promise<void> => {
    await delay(rand(100, 200));
    const n = MOCK_NOTIFICATIONS.find((n) => n.id === id);
    if (n) n.isRead = true;
  },

  // Invoices
  getInvoices: async (): Promise<Invoice[]> => {
    await delay(rand(200, 350));
    return [...MOCK_INVOICES];
  },

  // Staff
  getStaff: async (): Promise<StaffMember[]> => {
    await delay(rand(200, 350));
    return [...MOCK_STAFF];
  },

  // Financial
  getFinancialSummary: async (): Promise<FinancialSummary> => {
    await delay(rand(200, 400));
    return { ...MOCK_FINANCIAL };
  },
  getRevenueData: async (): Promise<RevenueData[]> => {
    await delay(rand(200, 350));
    return [...MOCK_REVENUE_DATA];
  },

  // Patient Activities
  getPatientActivities: async (
    patientId: string,
  ): Promise<PatientActivity[]> => {
    await delay(rand(150, 300));
    void patientId;
    return [...MOCK_PATIENT_ACTIVITIES];
  },
};
