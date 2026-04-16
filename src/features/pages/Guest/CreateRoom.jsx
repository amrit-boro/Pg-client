import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const LISTING_ID = "dc5c1ef5-6302-4181-83c4-2aa2a9cfd822";

// ── tiny field wrapper ──────────────────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
        {label}
        {required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inp =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

// ── default state ───────────────────────────────────────────────────────────
const EMPTY = {
  room_number: "",
  room_type: "",
  title: "",
  description: "",
  capacity: "",
  available_beds: "",
  status: "available",
  available_from: "",
  available_to: "",
  price_per_month: "",
  price_per_week: "",
  price_per_day: "",
  security_deposit: "",
  currency: "USD",
  floor_number: "",
  floor_area_sqm: "",
  is_furnished: false,
  extra_info: "",
};

// ── step config ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Basic Info", icon: "info" },
  { id: 2, label: "Availability", icon: "event_available" },
  { id: 3, label: "Pricing", icon: "payments" },
  { id: 4, label: "Details", icon: "tune" },
  { id: 5, label: "Media", icon: "photo_library" },
];

// ── inner modal content ─────────────────────────────────────────────────────
function ModalContent({ onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const set = (key) => (e) =>
    setForm((p) => ({
      ...p,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      alert("Max 10 images.");
      return;
    }
    setImages(files);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file?.size > 150 * 1024 * 1024) {
      alert("Video must be under 100 MB.");
      return;
    }
    setVideo(file);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setStatus("Creating room…");

    const payload = {
      listing_id: LISTING_ID,
      room_number: form.room_number,
      room_type: form.room_type,
      title: form.title || null,
      description: form.description || null,
      capacity: parseInt(form.capacity),
      available_beds: parseInt(form.available_beds),
      price_per_month: parseFloat(form.price_per_month),
      price_per_week: form.price_per_week
        ? parseFloat(form.price_per_week)
        : null,
      price_per_day: form.price_per_day ? parseFloat(form.price_per_day) : null,
      security_deposit: form.security_deposit
        ? parseFloat(form.security_deposit)
        : 0,
      currency: form.currency,
      floor_number: form.floor_number ? parseInt(form.floor_number) : null,
      floor_area_sqm: form.floor_area_sqm
        ? parseFloat(form.floor_area_sqm)
        : null,
      is_furnished: form.is_furnished,
      status: form.status,
      available_from: form.available_from || null,
      available_to: form.available_to || null,
      extra_info: form.extra_info || null,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/listings/createRoom`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const d = await res.json();
          msg = d.message || d.error || d.detail || JSON.stringify(d);
        } catch {
          msg = await res.text();
        }
        throw new Error(msg);
      }
      const { data } = await res.json();
      const newRoomId = data?.id;

      setStatus("Uploading media…");
      const uploads = [];
      if (images.length) {
        const fd = new FormData();
        images.forEach((img) => fd.append("images", img));
        uploads.push(
          fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/listings/createRoom/${newRoomId}/images`,
            { method: "POST", body: fd },
          ).then((r) => {
            if (!r.ok) throw new Error("Image upload failed.");
          }),
        );
      }
      if (video) {
        const fd = new FormData();
        fd.append("video", video);
        uploads.push(
          fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/listings/createRoom/${newRoomId}/video`,
            { method: "POST", body: fd },
          ).then((r) => {
            if (!r.ok) throw new Error("Video upload failed.");
          }),
        );
      }
      await Promise.all(uploads);

      setStatus("✅ Room created!");
      setForm(EMPTY);
      setImages([]);
      setVideo(null);
      setTimeout(() => {
        setStatus("");
        onSuccess?.();
        handleClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatus(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const canNext = () => {
    if (step === 1) return form.room_number && form.room_type;
    if (step === 3) return form.price_per_month;
    if (step === 2) return form.capacity && form.available_beds;
    return true;
  };

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 9999, isolation: "isolate" }}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-250 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Modal card */}
      <div
        className={`relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-250 ${
          visible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
        style={{ maxHeight: "90vh" }}
      >
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Add a New Room
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Step {step} of {STEPS.length} — {STEPS[step - 1].label}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* ── Step indicators ── */}
        <div className="px-6 pb-4 shrink-0">
          {/* Progress bar */}
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {/* Step pills */}
          <div className="flex items-center justify-between">
            {STEPS.map((s) => {
              const done = s.id < step;
              const current = s.id === step;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => done && setStep(s.id)}
                  className={`flex flex-col items-center gap-1 group transition-opacity ${
                    done
                      ? "cursor-pointer"
                      : current
                        ? "cursor-default"
                        : "cursor-default opacity-40"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all ${
                      done
                        ? "bg-indigo-100 text-indigo-600"
                        : current
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {done ? (
                      <span className="material-symbols-outlined text-sm">
                        check
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-sm">
                        {s.icon}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold hidden sm:block ${
                      current
                        ? "text-indigo-600"
                        : done
                          ? "text-slate-500"
                          : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-slate-100 shrink-0" />

        {/* ── Step content (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* STEP 1 – Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Room number" required>
                  <input
                    className={inp}
                    value={form.room_number}
                    onChange={set("room_number")}
                    placeholder="e.g. 101"
                    maxLength={20}
                  />
                </Field>
                <Field label="Room type" required>
                  <select
                    className={inp}
                    value={form.room_type}
                    onChange={set("room_type")}
                  >
                    <option value="">Select type</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                    <option value="dorm">Dorm</option>
                  </select>
                </Field>
              </div>
              <Field label="Title">
                <input
                  className={inp}
                  value={form.title}
                  onChange={set("title")}
                  placeholder="e.g. Cozy single room with AC"
                  maxLength={150}
                />
              </Field>
              <Field label="Description">
                <textarea
                  className={`${inp} min-h-[110px] resize-y leading-relaxed`}
                  value={form.description}
                  onChange={set("description")}
                  placeholder="Describe the room — amenities, vibe, house rules…"
                />
              </Field>
            </div>
          )}

          {/* STEP 2 – Availability */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Field label="Capacity" required>
                  <input
                    className={inp}
                    type="number"
                    min={1}
                    value={form.capacity}
                    onChange={set("capacity")}
                    placeholder="2"
                  />
                </Field>
                <Field label="Available beds" required>
                  <input
                    className={inp}
                    type="number"
                    min={0}
                    value={form.available_beds}
                    onChange={set("available_beds")}
                    placeholder="1"
                  />
                </Field>
                <Field label="Status">
                  <select
                    className={inp}
                    value={form.status}
                    onChange={set("status")}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Available from">
                  <input
                    className={inp}
                    type="date"
                    value={form.available_from}
                    onChange={set("available_from")}
                  />
                </Field>
                <Field label="Available to">
                  <input
                    className={inp}
                    type="date"
                    value={form.available_to}
                    onChange={set("available_to")}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* STEP 3 – Pricing */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price / month" required>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                      {form.currency === "INR"
                        ? "₹"
                        : form.currency === "EUR"
                          ? "€"
                          : form.currency === "GBP"
                            ? "£"
                            : "$"}
                    </span>
                    <input
                      className={`${inp} pl-7`}
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.price_per_month}
                      onChange={set("price_per_month")}
                      placeholder="0.00"
                    />
                  </div>
                </Field>
                <Field label="Security deposit">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                      {form.currency === "INR"
                        ? "₹"
                        : form.currency === "EUR"
                          ? "€"
                          : form.currency === "GBP"
                            ? "£"
                            : "$"}
                    </span>
                    <input
                      className={`${inp} pl-7`}
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.security_deposit}
                      onChange={set("security_deposit")}
                      placeholder="0.00"
                    />
                  </div>
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Price / week">
                  <input
                    className={inp}
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.price_per_week}
                    onChange={set("price_per_week")}
                    placeholder="—"
                  />
                </Field>
                <Field label="Price / day">
                  <input
                    className={inp}
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.price_per_day}
                    onChange={set("price_per_day")}
                    placeholder="—"
                  />
                </Field>
                <Field label="Currency">
                  <select
                    className={inp}
                    value={form.currency}
                    onChange={set("currency")}
                  >
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="AED">AED</option>
                  </select>
                </Field>
              </div>
            </div>
          )}

          {/* STEP 4 – Room Details */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Field label="Floor number">
                  <input
                    className={inp}
                    type="number"
                    value={form.floor_number}
                    onChange={set("floor_number")}
                    placeholder="e.g. 2"
                  />
                </Field>
                <Field label="Area (sqm)">
                  <input
                    className={inp}
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.floor_area_sqm}
                    onChange={set("floor_area_sqm")}
                    placeholder="18.5"
                  />
                </Field>
                <Field label="Furnished">
                  <label className="flex items-center gap-2.5 h-[42px] cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={form.is_furnished}
                        onChange={set("is_furnished")}
                      />
                      <div className="w-11 h-6 rounded-full bg-slate-200 peer-checked:bg-indigo-600 transition-colors duration-200" />
                      <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
                    </div>
                    <span className="text-sm text-slate-700 font-medium">
                      {form.is_furnished ? "Furnished" : "Unfurnished"}
                    </span>
                  </label>
                </Field>
              </div>
              <Field label="Extra info">
                <input
                  className={inp}
                  value={form.extra_info}
                  onChange={set("extra_info")}
                  placeholder="e.g. No smoking, pets allowed"
                  maxLength={250}
                />
              </Field>
            </div>
          )}

          {/* STEP 5 – Media */}
          {step === 5 && (
            <div className="space-y-3">
              {/* Photos */}
              <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all cursor-pointer group">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={handleImageChange}
                />
                <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all shrink-0">
                  <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-indigo-500 transition-colors">
                    photo_library
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700">
                    {images.length > 0
                      ? `${images.length} photo${images.length > 1 ? "s" : ""} ready`
                      : "Upload room photos"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Up to 10 images · JPEG, PNG, WebP
                  </p>
                  {images.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {images.slice(0, 6).map((img, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-indigo-100 text-indigo-700 font-medium px-2 py-0.5 rounded-lg truncate max-w-[120px]"
                        >
                          {img.name}
                        </span>
                      ))}
                      {images.length > 6 && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded-lg">
                          +{images.length - 6} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {images.length > 0 ? (
                  <span className="material-symbols-outlined text-emerald-500 shrink-0">
                    check_circle
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-indigo-400 shrink-0 transition-colors">
                    upload
                  </span>
                )}
              </label>

              {/* Video */}
              <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all cursor-pointer group">
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  className="sr-only"
                  onChange={handleVideoChange}
                />
                <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all shrink-0">
                  <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-indigo-500 transition-colors">
                    videocam
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700">
                    {video ? video.name : "Upload room tour video"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Optional · Max 100 MB · MP4, WebM, MOV
                  </p>
                </div>
                {video ? (
                  <span className="material-symbols-outlined text-emerald-500 shrink-0">
                    check_circle
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-indigo-400 shrink-0 transition-colors">
                    upload
                  </span>
                )}
              </label>

              {/* Summary card */}
              <div className="mt-2 rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
                <p className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wide">
                  Room Summary
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-600">
                  <span className="text-slate-400">Room</span>
                  <span className="font-medium">
                    {form.room_number || "—"} · {form.room_type || "—"}
                  </span>
                  <span className="text-slate-400">Title</span>
                  <span className="font-medium truncate">
                    {form.title || "—"}
                  </span>
                  <span className="text-slate-400">Capacity</span>
                  <span className="font-medium">
                    {form.capacity || "—"} ({form.available_beds || "—"} beds
                    avail.)
                  </span>
                  <span className="text-slate-400">Price / month</span>
                  <span className="font-medium">
                    {form.price_per_month
                      ? `${form.currency} ${form.price_per_month}`
                      : "—"}
                  </span>
                  <span className="text-slate-400">Status</span>
                  <span className="font-medium capitalize">{form.status}</span>
                  <span className="text-slate-400">Furnished</span>
                  <span className="font-medium">
                    {form.is_furnished ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 border-t border-slate-100 px-6 py-4 bg-white rounded-b-2xl space-y-2.5">
          {status && (
            <div
              className={`text-xs px-3 py-2 rounded-xl font-medium ${
                status.startsWith("✅")
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : status.startsWith("❌")
                    ? "bg-rose-50 text-rose-600 border border-rose-100"
                    : "bg-indigo-50 text-indigo-600 border border-indigo-100"
              }`}
            >
              {status}
            </div>
          )}
          <div className="flex items-center gap-2">
            {/* Back */}
            <button
              type="button"
              onClick={() => (step > 1 ? setStep((s) => s - 1) : handleClose())}
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-base">
                arrow_back
              </span>
              {step === 1 ? "Cancel" : "Back"}
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Next / Create */}
            {step < STEPS.length ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Continue
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting && (
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a8 8 0 00-8 8H0a12 12 0 0112-12z"
                    />
                  </svg>
                )}
                {submitting ? "Creating…" : "Create Room"}
                {!submitting && (
                  <span className="material-symbols-outlined text-base">
                    check
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── exported wrapper ─────────────────────────────────────────────────────────
export default function CreateRoom({ open, onClose, onSuccess }) {
  if (!open) return null;
  return createPortal(
    <ModalContent onClose={onClose} onSuccess={onSuccess} />,
    document.body,
  );
}
