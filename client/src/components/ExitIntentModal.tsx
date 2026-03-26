import { useState } from "react";
import { X, Calendar, ChevronLeft, ChevronRight, Clock, CheckCircle } from "lucide-react";

interface ExitIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIMES = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function ExitIntentModal({ isOpen, onClose }: ExitIntentModalProps) {
  const today = new Date();
  const [step, setStep] = useState<"calendar" | "time" | "details" | "done">("calendar");
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const isPast = (d: number) => {
    const date = new Date(viewYear, viewMonth, d);
    date.setHours(0, 0, 0, 0);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return date < t;
  };
  const isWeekend = (d: number) => {
    const day = new Date(viewYear, viewMonth, d).getDay();
    return day === 0 || day === 6;
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };
  const canGoPrev = !(viewYear === today.getFullYear() && viewMonth === today.getMonth());

  const handleDayClick = (d: number) => {
    if (isPast(d) || isWeekend(d)) return;
    setSelectedDate(new Date(viewYear, viewMonth, d));
    setStep("time");
  };

  const handleConfirm = () => {
    if (name.trim() && email.trim()) setStep("done");
  };

  const formatDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10" aria-label="Close">
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #00297a 0%, #0041a8 100%)", padding: "1.5rem 1.75rem 1.25rem" }}>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-white" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">Schedule a 15-min Demo</span>
          </div>
          <h2 className="text-xl font-bold text-white leading-snug">Before You Go...</h2>
          <p className="text-white text-sm mt-1 font-medium">See Unkov in action with our team.</p>

          {/* Step breadcrumb */}
          <div className="flex items-center gap-1.5 mt-3">
            {["Pick a date", "Choose time", "Your details"].map((label, i) => {
              const stepIdx = step === "calendar" ? 0 : step === "time" ? 1 : 2;
              const done = i < stepIdx;
              const active = i === stepIdx;
              return (
                <div key={i} className="flex items-center gap-1.5">
                  {i > 0 && <div style={{ width: 20, height: 1, backgroundColor: done ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)" }} />}
                  <span className="text-xs font-medium" style={{ color: active ? "#ffffff" : done ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)" }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5">
          {/* STEP 1: Calendar */}
          {step === "calendar" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} disabled={!canGoPrev} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <span className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{MONTHS[viewMonth]} {viewYear}</span>
                <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: "#6b7280" }}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1;
                  const disabled = isPast(d) || isWeekend(d);
                  const isSelected = selectedDate && selectedDate.getDate() === d && selectedDate.getMonth() === viewMonth && selectedDate.getFullYear() === viewYear;
                  return (
                    <button key={d} onClick={() => handleDayClick(d)} disabled={disabled}
                      className="aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all"
                      style={{
                        backgroundColor: isSelected ? "#00297a" : disabled ? "transparent" : "transparent",
                        color: isSelected ? "#ffffff" : disabled ? "#d1d5db" : "#1a1a2e",
                        cursor: disabled ? "not-allowed" : "pointer",
                      }}
                      onMouseEnter={e => { if (!disabled && !isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = "#e8f0fe"; }}
                      onMouseLeave={e => { if (!disabled && !isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}>
                      {d}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-center mt-3" style={{ color: "#6b7280" }}>Weekends unavailable · All times in ET</p>
            </div>
          )}

          {/* STEP 2: Time */}
          {step === "time" && selectedDate && (
            <div>
              <button onClick={() => setStep("calendar")} className="flex items-center gap-1 text-xs font-medium mb-3 hover:text-blue-700 transition-colors" style={{ color: "#0061d4" }}>
                <ChevronLeft className="w-3.5 h-3.5" /> {formatDate(selectedDate)}
              </button>
              <p className="text-sm font-semibold mb-3" style={{ color: "#1a1a2e" }}>
                <Clock className="w-3.5 h-3.5 inline mr-1.5" style={{ color: "#0061d4" }} />
                Select a time (Eastern Time)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {TIMES.map(t => (
                  <button key={t} onClick={() => { setSelectedTime(t); setStep("details"); }}
                    className="py-2 px-1 rounded-lg text-xs font-medium border transition-all"
                    style={{ borderColor: selectedTime === t ? "#00297a" : "#dcd6ce", backgroundColor: selectedTime === t ? "#00297a" : "#faf9f7", color: selectedTime === t ? "#ffffff" : "#3d4759" }}
                    onMouseEnter={e => { if (selectedTime !== t) { (e.currentTarget as HTMLElement).style.backgroundColor = "#e8f0fe"; (e.currentTarget as HTMLElement).style.borderColor = "#0061d4"; } }}
                    onMouseLeave={e => { if (selectedTime !== t) { (e.currentTarget as HTMLElement).style.backgroundColor = "#faf9f7"; (e.currentTarget as HTMLElement).style.borderColor = "#dcd6ce"; } }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Details */}
          {step === "details" && selectedDate && selectedTime && (
            <div>
              <button onClick={() => setStep("time")} className="flex items-center gap-1 text-xs font-medium mb-4 hover:text-blue-700 transition-colors" style={{ color: "#0061d4" }}>
                <ChevronLeft className="w-3.5 h-3.5" /> {formatDate(selectedDate)} · {selectedTime} ET
              </button>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#3d4759" }}>Your Name</label>
                  <input type="text" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ border: "1px solid #dcd6ce", backgroundColor: "#faf9f7", color: "#1a1a2e" }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "#3d4759" }}>Work Email</label>
                  <input type="email" placeholder="jane@company.com" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ border: "1px solid #dcd6ce", backgroundColor: "#faf9f7", color: "#1a1a2e" }} />
                </div>
                <button onClick={handleConfirm} disabled={!name.trim() || !email.trim()}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#00297a" }}
                  onMouseEnter={e => { if (name.trim() && email.trim()) (e.currentTarget as HTMLElement).style.backgroundColor = "#001f5c"; }}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "#00297a"}>
                  Request this slot — {selectedDate && formatDate(selectedDate)} · {selectedTime}
                </button>
              </div>
              <p className="text-xs text-center mt-3" style={{ color: "#6b7280" }}>We'll confirm your slot by email within one business day.</p>
            </div>
          )}

          {step === "done" && (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#d1fae5" }}>
                <CheckCircle className="w-7 h-7" style={{ color: "#059669" }} />
              </div>
              <h3 className="text-lg font-bold mb-1" style={{ color: "#1a1a2e" }}>Request received!</h3>
              <p className="text-sm mb-2" style={{ color: "#3d4759" }}>
                Your preferred time: {selectedDate && formatDate(selectedDate)} · {selectedTime} ET
              </p>
              <p className="text-xs" style={{ color: "#6b7280" }}>We'll follow up at <strong style={{ color: "#1a1a2e" }}>{email}</strong> to confirm your slot within one business day.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
