import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_PATIENTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/uiStore";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isBefore,
  isSameDay,
  isToday,
  startOfDay,
  startOfMonth,
} from "date-fns";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Stethoscope,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import { toast } from "sonner";

const APPOINTMENT_TYPES = [
  "Physiotherapy Session",
  "Follow-up Consultation",
  "Initial Assessment",
  "Orthopedic Assessment",
  "General Checkup",
  "Therapy Session",
  "Specialist Consultation",
];

function generateSlots(
  date: Date,
  doctorId: string,
): { time: string; booked: boolean }[] {
  const base = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];
  const bookedTimes = MOCK_APPOINTMENTS.filter(
    (a) => a.doctorId === doctorId && a.date === format(date, "yyyy-MM-dd"),
  ).map((a) => a.time);
  return base.map((t) => ({ time: t, booked: bookedTimes.includes(t) }));
}

function generateRef() {
  return `APT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export default function AppointmentBooking() {
  const { setBreadcrumb } = useUIStore();
  useEffect(
    () =>
      setBreadcrumb([
        { label: "Receptionist", href: "/receptionist" },
        { label: "Book Appointment" },
      ]),
    [setBreadcrumb],
  );

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [department, setDepartment] = useState<"PMR" | "General">("PMR");
  const [apptType, setApptType] = useState(APPOINTMENT_TYPES[0]);
  const [notes, setNotes] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingRef] = useState(generateRef);

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const filteredDoctors = MOCK_DOCTORS.filter(
    (d) => d.department === department,
  );
  const selectedDoctorObj = MOCK_DOCTORS.find((d) => d.id === selectedDoctor);
  const slots = selectedDoctor
    ? generateSlots(selectedDate, selectedDoctor)
    : [];

  const patientResults =
    patientSearch.length > 0
      ? MOCK_PATIENTS.filter(
          (p) =>
            p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
            p.patientId.toLowerCase().includes(patientSearch.toLowerCase()),
        ).slice(0, 5)
      : [];
  const selectedPatientObj = MOCK_PATIENTS.find(
    (p) => p.id === selectedPatient,
  );

  const canBook = selectedPatient && selectedDoctor && selectedTime && apptType;

  const handleBook = () => {
    if (!canBook) {
      toast.error("Please complete all required fields");
      return;
    }
    setShowConfirm(true);
  };

  const startDay = startOfMonth(currentMonth).getDay();

  return (
    <div className="space-y-6" data-ocid="appointment_booking.page">
      <PageHeader
        title="Book Appointment"
        subtitle="Schedule a new patient appointment"
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-elevation-subtle"
          data-ocid="appointment_booking.calendar"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">
              {format(currentMonth, "MMMM yyyy")}
            </h3>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() =>
                  setCurrentMonth((m) => addDays(startOfMonth(m), -1))
                }
                data-ocid="appointment_booking.calendar_prev"
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentMonth((m) => addDays(endOfMonth(m), 1))
                }
                data-ocid="appointment_booking.calendar_next"
                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-muted-foreground py-1"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startDay }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static calendar spacers
              <div key={`empty-${i}`} />
            ))}
            {calendarDays.map((day) => {
              const isPast = isBefore(day, startOfDay(new Date()));
              const isSelected = isSameDay(day, selectedDate);
              const today = isToday(day);
              return (
                <button
                  type="button"
                  key={day.toISOString()}
                  disabled={isPast}
                  onClick={() => {
                    setSelectedDate(day);
                    setSelectedTime(null);
                  }}
                  data-ocid={`appointment_booking.calendar_day.${format(day, "dd")}`}
                  className={cn(
                    "h-9 w-full rounded-lg text-sm font-medium transition-all duration-150",
                    isPast && "text-muted-foreground/40 cursor-not-allowed",
                    !isPast &&
                      !isSelected &&
                      !today &&
                      "hover:bg-muted text-foreground",
                    today && !isSelected && "bg-primary/10 text-primary",
                    isSelected &&
                      "bg-primary text-primary-foreground shadow-sm",
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          {/* Time slots */}
          {selectedDoctor && (
            <div className="mt-5">
              <p className="text-sm font-medium text-foreground mb-3">
                <Clock className="w-4 h-4 inline mr-1 text-muted-foreground" />
                Available Slots — {format(selectedDate, "MMM d")}
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {slots.map((slot) => (
                  <button
                    type="button"
                    key={slot.time}
                    disabled={slot.booked}
                    onClick={() => setSelectedTime(slot.time)}
                    data-ocid={`appointment_booking.slot.${slot.time.replace(":", "")}`}
                    className={cn(
                      "h-9 rounded-lg text-xs font-medium transition-all duration-150",
                      slot.booked &&
                        "bg-muted text-muted-foreground/50 cursor-not-allowed line-through",
                      !slot.booked &&
                        selectedTime !== slot.time &&
                        "bg-muted/50 hover:bg-muted text-foreground border border-border",
                      selectedTime === slot.time &&
                        "bg-secondary text-secondary-foreground shadow-sm",
                    )}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Booking form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 bg-card border border-border rounded-xl p-5 shadow-elevation-subtle"
          data-ocid="appointment_booking.form_panel"
        >
          <h3 className="font-semibold text-foreground mb-5">
            Booking Details
          </h3>
          <div className="space-y-4">
            {/* Patient search */}
            <div className="relative">
              <Label>
                <User className="w-3.5 h-3.5 inline mr-1" />
                Patient *
              </Label>
              {selectedPatientObj ? (
                <div className="mt-1 flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {selectedPatientObj.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedPatientObj.patientId} ·{" "}
                      {selectedPatientObj.phone}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPatient(null)}
                    data-ocid="appointment_booking.clear_patient_button"
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <>
                  <Input
                    placeholder="Search by name or patient ID..."
                    className="mt-1"
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    data-ocid="appointment_booking.patient_search_input"
                  />
                  {patientResults.length > 0 && (
                    <div
                      className="absolute z-10 left-0 right-0 bg-popover border border-border rounded-lg shadow-elevation-medium mt-1 overflow-hidden"
                      data-ocid="appointment_booking.patient_dropdown"
                    >
                      {patientResults.map((p, i) => (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => {
                            setSelectedPatient(p.id);
                            setPatientSearch("");
                          }}
                          data-ocid={`appointment_booking.patient_result.${i + 1}`}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted text-left transition-colors"
                        >
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {p.name[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {p.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {p.patientId}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Department + Doctor */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Department</Label>
                <select
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value as "PMR" | "General");
                    setSelectedDoctor("");
                  }}
                  data-ocid="appointment_booking.department_select"
                  className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="PMR">PMR</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <Label>
                  <Stethoscope className="w-3.5 h-3.5 inline mr-1" />
                  Doctor *
                </Label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => {
                    setSelectedDoctor(e.target.value);
                    setSelectedTime(null);
                  }}
                  data-ocid="appointment_booking.doctor_select"
                  className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select doctor</option>
                  {filteredDoctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Appointment type */}
            <div>
              <Label>Appointment Type *</Label>
              <select
                value={apptType}
                onChange={(e) => setApptType(e.target.value)}
                data-ocid="appointment_booking.type_select"
                className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {APPOINTMENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Selected date/time summary */}
            <div className="bg-muted/40 rounded-lg px-4 py-3 flex items-center gap-3">
              <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-foreground">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedTime ?? "No time slot selected yet"}
                </p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Additional notes or instructions..."
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                data-ocid="appointment_booking.notes_textarea"
                className="mt-1"
              />
            </div>

            <Button
              className="w-full"
              onClick={handleBook}
              disabled={!canBook}
              data-ocid="appointment_booking.submit_button"
            >
              Confirm Booking
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center p-4"
            data-ocid="appointment_booking.dialog"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-elevation-high w-full max-w-sm"
            >
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold font-display text-foreground mb-1">
                  Appointment Confirmed!
                </h3>
                <p className="text-muted-foreground text-sm mb-5">
                  Booking reference generated
                </p>
                <div className="bg-muted/40 rounded-xl p-4 mb-5 text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ref</span>
                    <span className="text-sm font-bold text-primary font-mono">
                      {bookingRef}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Patient
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {selectedPatientObj?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Doctor
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {selectedDoctorObj?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="text-sm font-medium text-foreground">
                      {format(selectedDate, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Time</span>
                    <span className="text-sm font-medium text-foreground">
                      {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="text-sm font-medium text-foreground">
                      {apptType}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowConfirm(false)}
                    data-ocid="appointment_booking.close_button"
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      toast.success(`Appointment ${bookingRef} booked!`);
                      setShowConfirm(false);
                      setSelectedPatient(null);
                      setSelectedTime(null);
                      setNotes("");
                    }}
                    data-ocid="appointment_booking.confirm_button"
                  >
                    Book Another
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
