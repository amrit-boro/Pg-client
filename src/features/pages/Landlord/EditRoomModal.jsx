import { useState, useEffect } from "react";
import { useUpdateRoom } from "../../../hooks/useUpdateRoom";
import { uploadFileDirectly } from "../../../services/signature";

const STEPS = ["General", "Media", "Pricing & Beds", "Specifications"];

export default function EditRoomModal({ isOpen, onClose, room }) {
  const { mutate, isPending } = useUpdateRoom();
  const [currentStep, setCurrentStep] = useState(0);
  const [deletedPhotoIds, setDeletedPhotoIds] = useState([]);
  const [formData, setFormData] = useState({});
  // Track all photos (existing from API + newly added)
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (room) {
      setFormData(room);
      // Assuming room.photos is an array. If it's just room_photo, we wrap it.
      // const initialPhotos =
      //   room.photos || (room.room_photo ? [room.room_photo] : []);
      // setPhotos(initialPhotos);
    }
  }, [room]);

  // Add this inside your component
  useEffect(() => {
    const fetchFullGallery = async () => {
      // Only fetch if we are on the Media step and haven't loaded the full gallery
      if (currentStep === 1 && room?.room_id && photos.length <= 1) {
        console.log(room.roomId);
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/v1/listings/room/${room.room_id}/photos`,
          );
          const result = await response.json();

          // Based on your screenshot, the array is in result.data
          if (result.data) {
            setPhotos(result.data);
          }
        } catch (error) {
          console.error("Failed to load full gallery:", error);
        }
      }
    };

    fetchFullGallery();
  }, [currentStep, room?.room_id]);
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    // Optional: Set a 'loading' state here
    try {
      const uploadPromises = files.map((file) => uploadFileDirectly(file));
      const results = await Promise.all(uploadPromises);

      const newPhotos = results.map((res) => ({
        id: res.public_id,
        url: res.secure_url,
        isNew: true,
      }));

      setPhotos((prev) => [...prev, ...newPhotos]);
    } catch (error) {
      console.error("Upload failed", error);
      // Show a toast or error message
    }
  };

  // 2. Update your removePhoto function
  const removePhoto = (photoId) => {
    // Find the photo we are about to remove
    const photoToRemove = photos.find((p) => p.id === photoId);

    // If it's an existing photo from the DB, track its ID for the backend
    if (photoToRemove && !photoToRemove.isNew) {
      setDeletedPhotoIds((prev) => [...prev, photoToRemove.id]);
    }

    // Remove from UI state
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const setManualValue = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () =>
    setCurrentStep((p) => Math.min(p + 1, STEPS.length - 1));
  const handleBack = () => setCurrentStep((p) => Math.max(p - 1, 0));

  // Submit=========
  const handleSubmit = () => {
    // 1. Get changed text fields only
    const changedFields = Object.entries(formData).reduce(
      (acc, [key, value]) => {
        if (value !== room[key]) {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );

    // 2. Get ONLY the newly uploaded photos
    const newPhotos = photos
      .filter((p) => p.isNew)
      .map((p, index) => ({
        url: p.url,
        public_id: p.id,
        // We still need to tell the backend if a NEW photo is the cover
        is_cover: photos.indexOf(p) === 0,
      }));

    // 3. Construct the Lean Payload
    const payload = {
      ...changedFields,
      deletedPhotoIds, // [ "old_id_1", "old_id_2" ]
      newPhotos, // [ {url: "...", public_id: "...", is_cover: false} ]
    };

    // 4. Mutation
    mutate(
      { roomId: room.room_id, data: payload },
      {
        onSuccess: () => {
          setCurrentStep(0);
          onClose();
        },
      },
    );
  };

  const inputClass =
    "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all";
  const labelClass =
    "text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header & Stepper */}
        <div className="bg-slate-50 border-b border-slate-100 p-6 pb-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Edit Room</h2>
              <p className="text-xs text-slate-400">
                Manage listing details and gallery
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-[15px] left-0 w-full h-0.5 bg-slate-200 z-0"></div>
            {STEPS.map((step, idx) => (
              <div
                key={step}
                className="relative z-10 flex flex-col items-center gap-2"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    idx <= currentStep
                      ? "bg-indigo-600 text-white"
                      : "bg-white border-2 border-slate-200 text-slate-400"
                  }`}
                >
                  {idx < currentStep ? "✓" : idx + 1}
                </div>
                <span
                  className={`text-[9px] font-bold uppercase ${idx <= currentStep ? "text-indigo-600" : "text-slate-400"}`}
                >
                  {step.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 min-h-[400px] overflow-y-auto">
          {/* STEP 0: GENERAL (Same as before) */}
          {currentStep === 0 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <div>
                <label className={labelClass}>Room Number</label>
                <input
                  name="room_number"
                  value={formData.room_number || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Room Type</label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
                  {["single", "double", "triple"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setManualValue("room_type", type)}
                      className={`py-2 text-xs font-bold capitalize rounded-lg transition-all ${
                        formData.room_type === type
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-slate-500"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "available",
                    "fully_occupied",
                    "maintenance",
                    "inactive",
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setManualValue("status", s)}
                      className={`px-2 py-2 text-[10px] font-bold uppercase border rounded-lg transition-all ${
                        formData.status === s
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : "bg-white border-slate-200 text-slate-400"
                      }`}
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: MEDIA (Gallery View) */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-end">
                <label className={labelClass}>
                  Room Gallery ({photos.length})
                </label>
                <p className="text-[10px] text-slate-400 mb-1.5 italic font-medium">
                  First image is cover
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Photo Thumbnails */}
                {photos.map((photo, index) => (
                  <div
                    key={photo.photo_id || photo.id}
                    className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group"
                  >
                    <img
                      src={photo.url}
                      alt="Room"
                      className="w-full h-full object-cover"
                    />
                    {/* Delete Overlay */}
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.photo_id || photo.id)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      ✕
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 inset-x-0 bg-indigo-600/80 text-[8px] text-white text-center py-0.5 font-bold uppercase">
                        Cover
                      </div>
                    )}
                  </div>
                ))}

                {/* Add More Button */}
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all text-slate-400">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <span className="text-lg">+</span>
                  <span className="text-[10px] font-bold uppercase">Add</span>
                </label>
              </div>

              {photos.length === 0 && (
                <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-400 font-medium">
                    No photos uploaded yet
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PRICING (Same as before) */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Price / Month</label>
                  <input
                    type="number"
                    name="price_per_month"
                    value={formData.price_per_month || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Security Deposit</label>
                  <input
                    type="number"
                    name="security_deposit"
                    value={formData.security_deposit || 0}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Total Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Beds</label>
                  <input
                    type="number"
                    name="beds"
                    value={formData.beds || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LOGISTICS (Same as before) */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Floor</label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Area (sqm)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="floor_area"
                    value={formData.floor_area || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Extra Info</label>
                <textarea
                  name="extra_info"
                  rows="3"
                  value={formData.extra_info || ""}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                  placeholder="e.g. No smoking"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  name="furnished"
                  checked={formData.furnished || false}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span className="text-sm font-semibold text-slate-600">
                  This room is furnished
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between gap-3">
          <button
            type="button"
            onClick={currentStep === 0 ? onClose : handleBack}
            className="px-5 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-all"
          >
            {currentStep === 0 ? "Cancel" : "Back"}
          </button>

          {currentStep === STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="px-8 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg disabled:opacity-50 transition-all"
            >
              {isPending ? "Saving..." : "Update Room"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg transition-all"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
