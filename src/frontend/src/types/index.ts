export type UserRole = "super_admin" | "doctor" | "receptionist";
export type Department = "PMR" | "General" | "Admin";
export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";
export type PatientStatus = "active" | "inactive" | "discharged";
export type LabStatus = "pending" | "processing" | "completed" | "critical";
export type NotificationPriority = "low" | "medium" | "high" | "urgent";
export type NotificationType =
  | "appointment"
  | "lab_report"
  | "prescription"
  | "billing"
  | "system"
  | "reminder"
  | "emergency";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department: Department;
  avatar?: string;
  email: string;
  phone?: string;
  specialization?: string;
}

export interface Patient {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  dob: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  department: Department;
  assignedDoctor: string;
  status: PatientStatus;
  registeredDate: string;
  insurance?: string;
  emergencyContact: string;
  avatar?: string;
  medicalHistory: string[];
  allergies: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: Department;
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  type: string;
  notes?: string;
  tokenNumber?: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: Department;
  email: string;
  phone: string;
  avatar?: string;
  patientsCount: number;
  rating: number;
  availability: string[];
  experience: number;
}

export interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  orderedBy: string;
  orderedDate: string;
  resultDate?: string;
  status: LabStatus;
  category: string;
  results?: string;
  pdfUrl?: string;
  isCritical: boolean;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medicines: Medicine[];
  diagnosis: string;
  notes?: string;
  status: "active" | "completed" | "discontinued";
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface TherapySession {
  id: string;
  patientId: string;
  patientName: string;
  therapistId: string;
  therapistName: string;
  date: string;
  time: string;
  sessionNumber: number;
  totalSessions: number;
  type: string;
  progress: number;
  notes?: string;
  exercises: string[];
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  patientId?: string;
  patientName?: string;
  actionUrl?: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  total: number;
  paid: number;
  status: "pending" | "paid" | "overdue" | "partial";
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: Department;
  email: string;
  phone: string;
  joinDate: string;
  status: "active" | "inactive" | "on_leave";
  avatar?: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  expenses: number;
  netProfit: number;
  revenueGrowth: number;
  patientGrowth: number;
  appointmentGrowth: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  patients: number;
}

export interface PatientActivity {
  id: string;
  type:
    | "appointment"
    | "lab"
    | "prescription"
    | "payment"
    | "note"
    | "therapy"
    | "notification"
    | "message";
  title: string;
  description: string;
  date: string;
  time: string;
  by?: string;
  status?: string;
}
