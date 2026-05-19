import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  FileText,
  Heart,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Medical Info", icon: Heart },
  { id: 3, title: "Insurance", icon: FileText },
  { id: 4, title: "Review", icon: Eye },
];

type Step1 = {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  bloodType: string;
  phone: string;
  email: string;
  address: string;
};
type Step2 = {
  department: string;
  primaryComplaint: string;
  allergies: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
};
type Step3 = {
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
  notes: string;
};

function generatePatientId() {
  return `PSY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`;
}

export default function PatientRegistration() {
  const { setBreadcrumb } = useUIStore();
  useEffect(
    () =>
      setBreadcrumb([
        { label: "Receptionist", href: "/receptionist" },
        { label: "Patient Registration" },
      ]),
    [setBreadcrumb],
  );

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [patientId] = useState(generatePatientId);
  const [step1Data, setStep1Data] = useState<Step1 | null>(null);
  const [step2Data, setStep2Data] = useState<Step2 | null>(null);
  const [step3Data, setStep3Data] = useState<Step3 | null>(null);

  const form1 = useForm<Step1>({
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      phone: "",
      email: "",
      address: "",
      gender: "male",
      bloodType: "A+",
    },
  });
  const form2 = useForm<Step2>({
    defaultValues: {
      department: "PMR",
      primaryComplaint: "",
      allergies: "",
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelation: "",
    },
  });
  const form3 = useForm<Step3>({
    defaultValues: {
      insuranceProvider: "",
      policyNumber: "",
      groupNumber: "",
      notes: "",
    },
  });

  const handleStep1 = form1.handleSubmit((data) => {
    setStep1Data(data as Step1);
    setStep(2);
  });
  const handleStep2 = form2.handleSubmit((data) => {
    setStep2Data(data as Step2);
    setStep(3);
  });
  const handleStep3 = form3.handleSubmit((data) => {
    setStep3Data(data as Step3);
    setStep(4);
  });
  const handleSkipInsurance = () => {
    setStep3Data({
      insuranceProvider: "",
      policyNumber: "",
      groupNumber: "",
      notes: "",
    });
    setStep(4);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    toast.success(
      `Patient ${step1Data?.firstName} ${step1Data?.lastName} registered successfully!`,
    );
  };

  const copyId = () => {
    navigator.clipboard.writeText(patientId);
    toast.success("Patient ID copied!");
  };

  if (submitted) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="registration.success_state"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </motion.div>
          <h2 className="text-2xl font-bold font-display text-foreground mb-2">
            Registration Successful!
          </h2>
          <p className="text-muted-foreground mb-6">
            Patient has been registered in the system.
          </p>
          <div className="bg-card border border-border rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Patient ID</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold font-mono text-primary">
                {patientId}
              </span>
              <button
                type="button"
                onClick={copyId}
                data-ocid="registration.copy_id_button"
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">
              {step1Data?.firstName} {step1Data?.lastName}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                form1.reset();
                form2.reset();
                form3.reset();
                setStep1Data(null);
                setStep2Data(null);
                setStep3Data(null);
              }}
              data-ocid="registration.register_another_button"
            >
              Register Another
            </Button>
            <Button data-ocid="registration.book_appointment_button">
              Book Appointment
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto" data-ocid="registration.page">
      <PageHeader
        title="Patient Registration"
        subtitle="Multi-step new patient onboarding"
      />

      {/* Step indicator */}
      <div className="flex items-center gap-2" data-ocid="registration.steps">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                step === s.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : step > s.id
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground",
              )}
            >
              <s.icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{s.title}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-1 rounded transition-colors",
                  step > s.id ? "bg-emerald-500/40" : "bg-border",
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Forms */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card border border-border rounded-xl p-6 shadow-elevation-subtle"
            data-ocid="registration.step1_panel"
          >
            <h3 className="text-lg font-semibold text-foreground mb-5">
              Personal Information
            </h3>
            <form onSubmit={handleStep1} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    data-ocid="registration.first_name_input"
                    {...form1.register("firstName", { required: true })}
                    className="mt-1"
                  />
                  {form1.formState.errors.firstName && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="registration.first_name_input.field_error"
                    >
                      Required
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    data-ocid="registration.last_name_input"
                    {...form1.register("lastName", { required: true })}
                    className="mt-1"
                  />
                  {form1.formState.errors.lastName && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="registration.last_name_input.field_error"
                    >
                      Required
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    data-ocid="registration.dob_input"
                    {...form1.register("dob", { required: true })}
                    className="mt-1"
                  />
                  {form1.formState.errors.dob && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="registration.dob_input.field_error"
                    >
                      Required
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <select
                    id="gender"
                    data-ocid="registration.gender_select"
                    {...form1.register("gender")}
                    className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <select
                    id="bloodType"
                    data-ocid="registration.blood_type_select"
                    {...form1.register("bloodType")}
                    className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (g) => (
                        <option key={g}>{g}</option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    placeholder="+1-555-0000"
                    data-ocid="registration.phone_input"
                    {...form1.register("phone", { required: true })}
                    className="mt-1"
                  />
                  {form1.formState.errors.phone && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="registration.phone_input.field_error"
                    >
                      Required
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="patient@email.com"
                    data-ocid="registration.email_input"
                    {...form1.register("email")}
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State ZIP"
                    data-ocid="registration.address_input"
                    {...form1.register("address")}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  data-ocid="registration.step1_next_button"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card border border-border rounded-xl p-6 shadow-elevation-subtle"
            data-ocid="registration.step2_panel"
          >
            <h3 className="text-lg font-semibold text-foreground mb-5">
              Medical Information
            </h3>
            <form onSubmit={handleStep2} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Department *</Label>
                  <select
                    data-ocid="registration.department_select"
                    {...form2.register("department")}
                    className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option>PMR</option>
                    <option>General</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Label>Primary Complaint *</Label>
                  <Textarea
                    placeholder="Describe the main reason for visit..."
                    data-ocid="registration.complaint_textarea"
                    {...form2.register("primaryComplaint", { required: true })}
                    className="mt-1"
                    rows={3}
                  />
                  {form2.formState.errors.primaryComplaint && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="registration.complaint_textarea.field_error"
                    >
                      Required
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label>Known Allergies</Label>
                  <Input
                    placeholder="e.g. Penicillin, Aspirin (comma separated)"
                    data-ocid="registration.allergies_input"
                    {...form2.register("allergies")}
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-semibold text-foreground pt-2">
                    Emergency Contact
                  </p>
                </div>
                <div>
                  <Label>Contact Name *</Label>
                  <Input
                    placeholder="Full name"
                    data-ocid="registration.emergency_name_input"
                    {...form2.register("emergencyName", { required: true })}
                    className="mt-1"
                  />
                  {form2.formState.errors.emergencyName && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="registration.emergency_name_input.field_error"
                    >
                      Required
                    </p>
                  )}
                </div>
                <div>
                  <Label>Contact Phone *</Label>
                  <Input
                    placeholder="+1-555-0000"
                    data-ocid="registration.emergency_phone_input"
                    {...form2.register("emergencyPhone", { required: true })}
                    className="mt-1"
                  />
                  {form2.formState.errors.emergencyPhone && (
                    <p
                      className="text-xs text-destructive mt-1"
                      data-ocid="registration.emergency_phone_input.field_error"
                    >
                      Required
                    </p>
                  )}
                </div>
                <div>
                  <Label>Relationship</Label>
                  <Input
                    placeholder="Spouse, Parent, Sibling..."
                    data-ocid="registration.emergency_relation_input"
                    {...form2.register("emergencyRelation")}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  data-ocid="registration.step2_back_button"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  type="submit"
                  data-ocid="registration.step2_next_button"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card border border-border rounded-xl p-6 shadow-elevation-subtle"
            data-ocid="registration.step3_panel"
          >
            <div className="flex items-start justify-between mb-5">
              <h3 className="text-lg font-semibold text-foreground">
                Insurance &amp; Billing
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSkipInsurance}
                data-ocid="registration.skip_insurance_button"
              >
                Skip (optional)
              </Button>
            </div>
            <form onSubmit={handleStep3} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Insurance Provider</Label>
                  <Input
                    placeholder="BlueCross, Aetna, Medicare..."
                    data-ocid="registration.insurance_provider_input"
                    {...form3.register("insuranceProvider")}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Policy Number</Label>
                  <Input
                    placeholder="Policy number"
                    data-ocid="registration.policy_number_input"
                    {...form3.register("policyNumber")}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Group Number</Label>
                  <Input
                    placeholder="Group/plan number"
                    data-ocid="registration.group_number_input"
                    {...form3.register("groupNumber")}
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    placeholder="Any billing notes or instructions..."
                    data-ocid="registration.billing_notes_textarea"
                    {...form3.register("notes")}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  data-ocid="registration.step3_back_button"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  type="submit"
                  data-ocid="registration.step3_next_button"
                >
                  Review <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 4 && step1Data && step2Data && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
            data-ocid="registration.step4_panel"
          >
            <div className="bg-card border border-border rounded-xl p-6 shadow-elevation-subtle">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Review &amp; Confirm
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Personal Info
                  </p>
                  {[
                    ["Name", `${step1Data.firstName} ${step1Data.lastName}`],
                    ["DOB", step1Data.dob],
                    ["Gender", step1Data.gender],
                    ["Blood Type", step1Data.bloodType],
                    ["Phone", step1Data.phone],
                    ["Email", step1Data.email || "—"],
                    ["Address", step1Data.address || "—"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between py-1.5 border-b border-border last:border-0"
                    >
                      <span className="text-sm text-muted-foreground">{k}</span>
                      <span className="text-sm font-medium text-foreground text-right max-w-[60%] break-words">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Medical Info
                  </p>
                  {[
                    ["Department", step2Data.department],
                    ["Complaint", step2Data.primaryComplaint],
                    ["Allergies", step2Data.allergies || "None"],
                    [
                      "Emergency",
                      `${step2Data.emergencyName} (${step2Data.emergencyPhone})`,
                    ],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between py-1.5 border-b border-border last:border-0"
                    >
                      <span className="text-sm text-muted-foreground">{k}</span>
                      <span className="text-sm font-medium text-foreground text-right max-w-[60%] break-words">
                        {v}
                      </span>
                    </div>
                  ))}
                  {step3Data?.insuranceProvider && (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 mt-4">
                        Insurance
                      </p>
                      <div className="flex justify-between py-1.5 border-b border-border">
                        <span className="text-sm text-muted-foreground">
                          Provider
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {step3Data.insuranceProvider}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(3)}
                data-ocid="registration.step4_back_button"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button
                onClick={handleSubmit}
                data-ocid="registration.submit_button"
                className="px-8"
              >
                Register Patient
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
