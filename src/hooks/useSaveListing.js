import { useMutation, useQueryClient } from "@tanstack/react-query";

// ===========================
// SAVE LISTING
// ===========================
const saveListing = async (listingId) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/listings/saved-listings`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_id: listingId }),
    },
  );
  if (!res.ok) throw new Error("Failed to save listing");
  return res.json();
};

const deleteListing = async (listingId) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/listings/saved-listings`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listing_id: listingId }),
    },
  );
  if (!res.ok) throw new Error("Failed to delete listing");
  return res.json();
};

export function useSaveListing(pgId) {
  const queryClient = useQueryClient();

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: saveListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pgListings", pgId] });
    },
  });

  const { mutate: remove, isPending: isRemoving } = useMutation({
    mutationFn: deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pgListings", pgId] });
    },
  });

  return {
    save,
    remove,
    isPending: isSaving || isRemoving,
  };
}

// ==============================
// SAVE ROOM
// ==============================
