import { useQuery } from "@tanstack/react-query";

const fetchRoomPrice = async (roomId) => {
  const res = await fetch(
    `http://localhost:8000/api/v1/price/roomPrice/${roomId}`,
  );
  if (!res.ok) throw new Error("Failed to fetch price");
  const json = await res.json();
  console.log(json.data);
  return json.data;
};

export const useRoomPrice = (roomId) =>
  useQuery({
    queryKey: ["roomPrice", roomId],
    queryFn: () => fetchRoomPrice(roomId),
    enabled: !!roomId,
    staleTime: 1000 * 60 * 5,
  });
