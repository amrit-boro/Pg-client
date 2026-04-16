import { useQuery } from "@tanstack/react-query";

// ====================================================================================
// Rooms
const fetchRooms = async ({ listingId, type = "single", page = 1 }) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/listings/${listingId}/rooms?type=${type}&page=${page}`,
    // { credentials: "include" },
  );
  if (!res.ok) throw new Error("Failed to fetch rooms");
  const json = await res.json();
  return json;
};

export const useRooms = ({ listingId, type, page }) =>
  useQuery({
    queryKey: ["rooms", listingId, type, page],
    queryFn: () => fetchRooms({ listingId, type, page }),
    enabled: !!listingId,
    staleTime: 1000 * 60 * 5,
  });
