import { useQuery } from "@tanstack/react-query";

// Saved Listings
const fetchSavedListings = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/listings/saved-listings`,
    {
      method: "GET",
    },
    // when i will be using authentication
    // {    credentials: "include", // 👈 that's it}
  );
  if (!res.ok) throw new Error("Failed to fetch saved listings");
  const json = await res.json();
  return json.data;
};

export const useSavedListings = () =>
  useQuery({
    queryKey: ["saved-listings"],
    queryFn: fetchSavedListings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

const fetchSavedRooms = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/listings/saved-rooms`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch saved rooms");
  const json = await res.json();
  return json.data;
};

export const useSavedRooms = () => {
  return useQuery({
    queryKey: ["saved-rooms"],
    queryFn: fetchSavedRooms,
    staleTime: 1000 * 60 * 5,
  });
};
