import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const LISTING_ID = "dc5c1ef5-6302-4181-83c4-2aa2a9cfd822";

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
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow";

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
      <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3">
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

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

// ── Inner drawer (rendered via portal into document.body) ───────────────────
function DrawerContent({ onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [visible, setVisible] = useState(false);

  // Trigger enter animation on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Escape key to close
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
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
    if (file?.size > 100 * 1024 * 1024) {
      alert("Video must be under 100 MB.");
      return;
    }
    setVideo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        "http://localhost:8000/api/v1/listings/createRoom",
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
            `http://localhost:8000/api/v1/listings/createRoom/${newRoomId}/images`,
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
            `http://localhost:8000/api/v1/listings/createRoom/${newRoomId}/video`,
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

  return (
    <div
      className="fixed inset-0 flex"
      style={{ zIndex: 9999, isolation: "isolate" }}
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-[480px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="material-symbols-outlined text-white text-sm">
                add
              </span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add New Room</h2>
              <p className="text-[11px] text-slate-400">
                Fill in the room details below
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 bg-slate-50">
          <form id="create-room-form" onSubmit={handleSubmit}>
            <div className="space-y-3">
              {/* Basic Info */}
              <Section title="Basic Info">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Room number" required>
                    <input
                      className={inp}
                      value={form.room_number}
                      onChange={set("room_number")}
                      placeholder="e.g. 101"
                      maxLength={20}
                      required
                    />
                  </Field>
                  <Field label="Room type" required>
                    <select
                      className={inp}
                      value={form.room_type}
                      onChange={set("room_type")}
                      required
                    >
                      <option value="">Select type</option>
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="triple">Triple</option>
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
                    className={`${inp} min-h-[76px] resize-y leading-relaxed`}
                    value={form.description}
                    onChange={set("description")}
                    placeholder="Describe the room…"
                  />
                </Field>
              </Section>

              {/* Capacity & Availability */}
              <Section title="Capacity & Availability">
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Capacity" required>
                    <input
                      className={inp}
                      type="number"
                      min={1}
                      value={form.capacity}
                      onChange={set("capacity")}
                      placeholder="2"
                      required
                    />
                  </Field>
                  <Field label="Avail. beds" required>
                    <input
                      className={inp}
                      type="number"
                      min={0}
                      value={form.available_beds}
                      onChange={set("available_beds")}
                      placeholder="1"
                      required
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
                <div className="grid grid-cols-2 gap-3">
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
              </Section>

              {/* Pricing */}
              <Section title="Pricing">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Price / month" required>
                    <input
                      className={inp}
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.price_per_month}
                      onChange={set("price_per_month")}
                      placeholder="0.00"
                      required
                    />
                  </Field>
                  <Field label="Security deposit">
                    <input
                      className={inp}
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.security_deposit}
                      onChange={set("security_deposit")}
                      placeholder="0.00"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-3 gap-3">
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
              </Section>

              {/* Room Details */}
              <Section title="Room Details">
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Floor no.">
                    <input
                      className={inp}
                      type="number"
                      value={form.floor_number}
                      onChange={set("floor_number")}
                      placeholder="2"
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
                    <label className="flex items-center gap-2 h-[42px] cursor-pointer select-none">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={form.is_furnished}
                          onChange={set("is_furnished")}
                        />
                        <div className="w-10 h-[22px] rounded-full bg-slate-200 peer-checked:bg-indigo-600 transition-colors duration-200" />
                        <div className="absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-[18px]" />
                      </div>
                      <span className="text-sm text-slate-600 font-medium">
                        Yes
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
              </Section>

              {/* Media */}
              <Section title="Media">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors cursor-pointer group">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                  <div className="h-9 w-9 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors shrink-0">
                    <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-indigo-500 transition-colors">
                      photo_library
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      {images.length > 0
                        ? `${images.length} photo${images.length > 1 ? "s" : ""} selected`
                        : "Add photos"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Up to 10 · JPEG, PNG, WebP
                    </p>
                  </div>
                  {images.length > 0 && (
                    <span className="ml-auto h-5 min-w-5 px-1.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {images.length}
                    </span>
                  )}
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors cursor-pointer group">
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="sr-only"
                    onChange={handleVideoChange}
                  />
                  <div className="h-9 w-9 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors shrink-0">
                    <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-indigo-500 transition-colors">
                      videocam
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">
                      {video ? video.name : "Add room tour video"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Optional · Max 100 MB · MP4, WebM, MOV
                    </p>
                  </div>
                  {video && (
                    <span className="material-symbols-outlined text-base text-emerald-500 ml-auto shrink-0">
                      check_circle
                    </span>
                  )}
                </label>
              </Section>
            </div>
          </form>
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 bg-white border-t border-slate-100 px-5 py-3 space-y-2.5">
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
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-room-form"
              disabled={submitting}
              className="flex-[2] py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
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
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── exported wrapper – renders nothing when closed, portals when open ────────
export default function CreateRoom({ open, onClose, onSuccess }) {
  if (!open) return null;
  // createPortal renders into document.body, escaping ALL parent stacking
  // contexts (transform, overflow, filter, will-change, etc.)
  return createPortal(
    <DrawerContent onClose={onClose} onSuccess={onSuccess} />,
    document.body,
  );
}
