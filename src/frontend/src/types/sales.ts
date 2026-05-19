export type LeadStage =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "converted"
  | "lost";

export type CallOutcome =
  | "interested"
  | "callback_requested"
  | "not_interested"
  | "no_answer"
  | "left_voicemail"
  | "converted";

export interface SalesLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  stage: LeadStage;
  assignedTo: string;
  createdAt: string;
  followUpDate?: string;
  notes?: string;
  value?: number;
}

export interface VisitRecord {
  id: string;
  locationName: string;
  address: string;
  visitDate: string;
  checkInTime: string;
  checkOutTime?: string;
  duration?: string;
  purpose: string;
  outcome: string;
  contactPerson: string;
  leadsGenerated: number;
  notes?: string;
  photos?: string[];
}

export interface CallLog {
  id: string;
  contactName: string;
  phone: string;
  date: string;
  time: string;
  duration: string;
  outcome: CallOutcome;
  notes?: string;
  linkedLeadId?: string;
}

export interface FollowUpReminder {
  id: string;
  leadId: string;
  leadName: string;
  phone: string;
  dueDate: string;
  dueTime: string;
  type: "call" | "visit" | "email" | "whatsapp";
  priority: "low" | "medium" | "high";
  notes?: string;
  isCompleted: boolean;
}

export interface GymPartnership {
  id: string;
  gymName: string;
  location: string;
  contactPerson: string;
  phone: string;
  partnershipType: "referral" | "session" | "camp" | "promo";
  status: "active" | "pending" | "inactive";
  leadsGenerated: number;
  conversions: number;
  since: string;
  nextEvent?: string;
}

export interface ActivityLog {
  id: string;
  date: string;
  time: string;
  type: "call" | "visit" | "email" | "whatsapp" | "meeting" | "demo";
  description: string;
  outcome?: string;
  linkedTo?: string;
}

export interface SalesDashboardStats {
  leadsThisWeek: number;
  visitsCompleted: number;
  conversionRate: number;
  avgCallDuration: string;
  leadsGrowth: number;
  visitsGrowth: number;
  conversionGrowth: number;
}
