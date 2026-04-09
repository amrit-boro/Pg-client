import { useState } from "react";

const FIELD = ({ label, required, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <label style={{ fontSize: 13, color: "var(--color-text-secondary, #666)" }}>
      {label}
      {required && <span style={{ color: "#e24b4a", marginLeft: 3 }}>*</span>}
    </label>
    {children}
  </div>
);

const input = {
  fontSize: 14,
  padding: "8px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  background: "#fafafa",
  color: "inherit",
  width: "100%",
  outline: "none",
  boxSizing: "border-box",
};

const Section = ({ title, children }) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: "1.25rem",
      marginBottom: "1rem",
    }}
  >
    <p
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: "#9ca3af",
        marginBottom: "1rem",
      }}
    >
      {title}
    </p>
    {children}
  </div>
);

const grid2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
const grid3 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 12,
};

export default function CreateRoom() {
  const [form, setForm] = useState({
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
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const set = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      alert("You can only upload a maximum of 10 images.");
      return;
    }
    setImages(files);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 100 * 1024 * 1024) {
      alert("Video must be under 100MB.");
      return;
    }
    setVideo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("Step 1: Creating room details...");

    const payload = {
      listing_id: "a4ee5638-e362-4216-a9c8-6c5eb8a62f9c",
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
      // STEP 1: Create room (text data)
      const roomRes = await fetch(
        "http://localhost:8000/api/v1/listings/createRoom",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      console.log(roomRes);
      if (!roomRes.ok) {
        let errMsg = `HTTP ${roomRes.status}`;
        try {
          const errData = await roomRes.json();
          errMsg =
            errData.message ||
            errData.error ||
            errData.detail ||
            JSON.stringify(errData);
        } catch {
          errMsg = await roomRes.text();
        }
        throw new Error(errMsg);
      }
      const roomData = await roomRes.json();
      console.log("roomData: ", roomData);
      const newRoomId = roomData?.data?.id;

      setStatusMessage("Step 2: Uploading media in parallel...");

      // STEP 2: Upload media in parallel
      const uploadPromises = [];

      if (images.length > 0) {
        console.log("Uploading images...");
        images.forEach((img, i) => {
          console.log(`Image ${i}:`, img.name, img.type, img.size);
        });

        const fd = new FormData();
        images.forEach((img) => fd.append("images", img));

        uploadPromises.push(
          fetch(
            `http://localhost:8000/api/v1/listings/createRoom/${newRoomId}/images`,
            { method: "POST", body: fd },
          ).then((r) => {
            console.log("Image response status:", r.status);
            if (!r.ok) throw new Error("Image upload failed.");
          }),
        );
      } else {
        console.log("No images found");
      }

      if (video) {
        console.log("Uploading video...");
        console.log("Video details:", video.name, video.type, video.size);

        const fd = new FormData();
        fd.append("video", video);

        uploadPromises.push(
          fetch(
            `http://localhost:8000/api/v1/listings/createRoom/${newRoomId}/video`,
            { method: "POST", body: fd },
          ).then((r) => {
            console.log("Video response status:", r.status);
            if (!r.ok) throw new Error("Video upload failed.");
          }),
        );
      } else {
        console.log("No video found");
      }

      await Promise.all(uploadPromises);

      setStatusMessage("✅ Room created successfully!");
      setForm({
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
      });
      setImages([]);
      setVideo(null);
    } catch (err) {
      console.error(err);
      setStatusMessage(`❌ Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 640,
        margin: "40px auto",
        padding: "0 16px",
        fontFamily: "sans-serif",
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: "1.5rem" }}>
        Add a new room
      </h2>

      <form onSubmit={handleSubmit}>
        {/* ── Basic Info ── */}
        <Section title="Basic info">
          <div style={{ ...grid2, marginBottom: 12 }}>
            <FIELD label="Room number" required>
              <input
                style={input}
                value={form.room_number}
                onChange={set("room_number")}
                placeholder="e.g. 101"
                maxLength={20}
                required
              />
            </FIELD>
            <FIELD label="Room type" required>
              <select
                style={input}
                value={form.room_type}
                onChange={set("room_type")}
                required
              >
                <option value="">Select type</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="triple">Triple</option>
                <option value="dorm">Dorm</option>
              </select>
            </FIELD>
          </div>

          <FIELD label="Title" style={{ marginBottom: 12 }}>
            <input
              style={{ ...input, marginBottom: 12 }}
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. Cozy single room with AC"
              maxLength={150}
            />
          </FIELD>

          <FIELD label="Description">
            <textarea
              style={{
                ...input,
                minHeight: 80,
                resize: "vertical",
                lineHeight: 1.5,
              }}
              value={form.description}
              onChange={set("description")}
              placeholder="Describe the room..."
            />
          </FIELD>
        </Section>

        {/* ── Capacity & Availability ── */}
        <Section title="Capacity & availability">
          <div style={{ ...grid3, marginBottom: 12 }}>
            <FIELD label="Capacity" required>
              <input
                style={input}
                type="number"
                min={1}
                value={form.capacity}
                onChange={set("capacity")}
                placeholder="2"
                required
              />
            </FIELD>
            <FIELD label="Available beds" required>
              <input
                style={input}
                type="number"
                min={0}
                value={form.available_beds}
                onChange={set("available_beds")}
                placeholder="1"
                required
              />
            </FIELD>
            <FIELD label="Status">
              <select
                style={input}
                value={form.status}
                onChange={set("status")}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </FIELD>
          </div>

          <div style={grid2}>
            <FIELD label="Available from">
              <input
                style={input}
                type="date"
                value={form.available_from}
                onChange={set("available_from")}
              />
            </FIELD>
            <FIELD label="Available to">
              <input
                style={input}
                type="date"
                value={form.available_to}
                onChange={set("available_to")}
              />
            </FIELD>
          </div>
        </Section>

        {/* ── Pricing ── */}
        <Section title="Pricing">
          <div style={{ ...grid2, marginBottom: 12 }}>
            <FIELD label="Price / month" required>
              <input
                style={input}
                type="number"
                min={0}
                step="0.01"
                value={form.price_per_month}
                onChange={set("price_per_month")}
                placeholder="0.00"
                required
              />
            </FIELD>
            <FIELD label="Security deposit">
              <input
                style={input}
                type="number"
                min={0}
                step="0.01"
                value={form.security_deposit}
                onChange={set("security_deposit")}
                placeholder="0.00"
              />
            </FIELD>
          </div>

          <div style={grid3}>
            <FIELD label="Price / week">
              <input
                style={input}
                type="number"
                min={0}
                step="0.01"
                value={form.price_per_week}
                onChange={set("price_per_week")}
                placeholder="—"
              />
            </FIELD>
            <FIELD label="Price / day">
              <input
                style={input}
                type="number"
                min={0}
                step="0.01"
                value={form.price_per_day}
                onChange={set("price_per_day")}
                placeholder="—"
              />
            </FIELD>
            <FIELD label="Currency">
              <select
                style={input}
                value={form.currency}
                onChange={set("currency")}
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="AED">AED</option>
              </select>
            </FIELD>
          </div>
        </Section>

        {/* ── Room Details ── */}
        <Section title="Room details">
          <div style={{ ...grid3, marginBottom: 12 }}>
            <FIELD label="Floor number">
              <input
                style={input}
                type="number"
                value={form.floor_number}
                onChange={set("floor_number")}
                placeholder="e.g. 2"
              />
            </FIELD>
            <FIELD label="Area (sqm)">
              <input
                style={input}
                type="number"
                min={0}
                step="0.01"
                value={form.floor_area_sqm}
                onChange={set("floor_area_sqm")}
                placeholder="e.g. 18.5"
              />
            </FIELD>
            <FIELD label="Furnished">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  height: 36,
                }}
              >
                <input
                  type="checkbox"
                  id="is_furnished"
                  checked={form.is_furnished}
                  onChange={set("is_furnished")}
                  style={{ width: 16, height: 16, cursor: "pointer" }}
                />
                <label
                  htmlFor="is_furnished"
                  style={{ fontSize: 14, cursor: "pointer" }}
                >
                  Yes
                </label>
              </div>
            </FIELD>
          </div>

          <FIELD label="Extra info">
            <input
              style={input}
              value={form.extra_info}
              onChange={set("extra_info")}
              placeholder="e.g. No smoking, pets allowed"
              maxLength={250}
            />
          </FIELD>
        </Section>

        {/* ── Media ── */}
        <Section title="Media">
          <div
            style={{
              border: "1px dashed #d1d5db",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
              Photos{" "}
              <span style={{ color: "#9ca3af", fontWeight: 400 }}>
                (max 10)
              </span>
            </p>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              style={{ fontSize: 13 }}
            />
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
              {images.length > 0
                ? `${images.length} photo${images.length > 1 ? "s" : ""} selected`
                : "No photos selected"}
            </p>
          </div>

          <div
            style={{
              border: "1px dashed #d1d5db",
              borderRadius: 8,
              padding: 12,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
              Room tour video{" "}
              <span style={{ color: "#9ca3af", fontWeight: 400 }}>
                (optional, max 100MB)
              </span>
            </p>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoChange}
              style={{ fontSize: 13 }}
            />
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
              {video ? video.name : "No video selected"}
            </p>
          </div>
        </Section>

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "11px",
            background: isSubmitting ? "#d1d5db" : "#111827",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            transition: "background 0.15s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {isSubmitting && (
            <span
              style={{
                width: 16,
                height: 16,
                border: "2px solid rgba(255,255,255,0.35)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 0.7s linear infinite",
              }}
            />
          )}
          {isSubmitting ? "Uploading..." : "Create room"}
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        {statusMessage && (
          <div
            style={{
              marginTop: 10,
              padding: "10px 12px",
              background: "#f3f4f6",
              borderRadius: 8,
              fontSize: 13,
              color: "#374151",
            }}
          >
            {statusMessage}
          </div>
        )}
      </form>
    </div>
  );
}
