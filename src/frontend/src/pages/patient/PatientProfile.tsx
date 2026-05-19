import { MOCK_PATIENT_PROFILE } from "@/lib/salesPatientData";
import type { PatientProfile as PatientProfileType } from "@/types/patient";
import { Edit3, Save, User, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PatientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<PatientProfileType>(MOCK_PATIENT_PROFILE);
  const [saved, setSaved] = useState<PatientProfileType>(MOCK_PATIENT_PROFILE);

  const handleChange = (field: keyof PatientProfileType, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaved(form);
    setIsEditing(false);
    toast.success("Profile updated successfully.");
  };

  const handleCancel = () => {
    setForm(saved);
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display text-foreground">
          My Profile
        </h1>
        {!isEditing ? (
          <button
            type="button"
            data-ocid="patient.profile.edit_button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-border bg-background hover:bg-muted transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              data-ocid="patient.profile.cancel_button"
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-border bg-background hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="button"
              data-ocid="patient.profile.save_button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Avatar + ID */}
      <div className="flex items-center gap-5 p-5 rounded-2xl border border-border bg-card">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <User className="w-8 h-8 text-primary" />
        </div>
        <div>
          <div className="font-bold text-xl text-foreground">{saved.name}</div>
          <div className="text-sm text-muted-foreground">
            Patient ID: {saved.patientId}
          </div>
          <div className="text-sm text-muted-foreground">{saved.insurance}</div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-border bg-card p-6 grid sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            data-ocid="patient.profile.name_input"
            type="text"
            value={form.name}
            disabled={!isEditing}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm disabled:opacity-60 disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            data-ocid="patient.profile.email_input"
            type="email"
            value={form.email}
            disabled={!isEditing}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm disabled:opacity-60 disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="phone"
          >
            Phone
          </label>
          <input
            id="phone"
            data-ocid="patient.profile.phone_input"
            type="tel"
            value={form.phone}
            disabled={!isEditing}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm disabled:opacity-60 disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground" htmlFor="dob">
            Date of Birth
          </label>
          <input
            id="dob"
            data-ocid="patient.profile.dob_input"
            type="date"
            value={form.dob}
            disabled={!isEditing}
            onChange={(e) => handleChange("dob", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm disabled:opacity-60 disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Blood Group */}
        <div className="space-y-1.5">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="bloodGroup"
          >
            Blood Group
          </label>
          <select
            id="bloodGroup"
            data-ocid="patient.profile.blood_group_select"
            value={form.bloodGroup}
            disabled={!isEditing}
            onChange={(e) => handleChange("bloodGroup", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm disabled:opacity-60 disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        {/* Emergency Contact Name */}
        <div className="space-y-1.5">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="ecName"
          >
            Emergency Contact Name
          </label>
          <input
            id="ecName"
            data-ocid="patient.profile.emergency_name_input"
            type="text"
            value={form.emergencyContactName}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("emergencyContactName", e.target.value)
            }
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm disabled:opacity-60 disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Emergency Contact Phone */}
        <div className="space-y-1.5">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="ecPhone"
          >
            Emergency Contact Phone
          </label>
          <input
            id="ecPhone"
            data-ocid="patient.profile.emergency_phone_input"
            type="tel"
            value={form.emergencyContactPhone}
            disabled={!isEditing}
            onChange={(e) =>
              handleChange("emergencyContactPhone", e.target.value)
            }
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm disabled:opacity-60 disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Medical History - full width */}
        <div className="sm:col-span-2 space-y-1.5">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor="medicalHistory"
          >
            Medical History
          </label>
          <textarea
            id="medicalHistory"
            data-ocid="patient.profile.medical_history_textarea"
            rows={3}
            value={form.medicalHistory}
            disabled={!isEditing}
            onChange={(e) => handleChange("medicalHistory", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm disabled:opacity-60 disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
