export type PatientPortalRole = "patient";

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  address: string;
  medicalHistory: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  insurance: string;
  patientId: string;
}

export interface PatientAppointment {
  id: string;
  doctorName: string;
  doctorSpecialization: string;
  department: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled" | "in_progress";
  type: string;
  location: string;
  notes?: string;
}

export interface PatientReport {
  id: string;
  testName: string;
  category: string;
  orderedBy: string;
  date: string;
  status: "pending" | "ready" | "processing";
  fileSize?: string;
  isCritical: boolean;
  summary?: string;
}

export interface PatientPrescription {
  id: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medicines: PatientMedicine[];
  status: "active" | "completed" | "refill_needed";
  validUntil: string;
}

export interface PatientMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  refillsLeft: number;
}

export interface TherapyProgressSession {
  id: string;
  sessionNumber: number;
  totalSessions: number;
  date: string;
  therapistName: string;
  sessionType: string;
  progressPercent: number;
  notes: string;
  exercises: string[];
  feedback?: string;
  painLevel: number;
  mobility: number;
  strength: number;
}

export interface PatientInvoice {
  id: string;
  date: string;
  dueDate: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  invoiceNumber: string;
  items: PatientInvoiceItem[];
}

export interface PatientInvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface PatientNotification {
  id: string;
  type:
    | "appointment"
    | "medicine"
    | "report"
    | "promotion"
    | "billing"
    | "therapy";
  title: string;
  message: string;
  date: string;
  time: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
}

export interface AvailableSlot {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  doctorSpecialization: string;
  department: string;
  isAvailable: boolean;
}
