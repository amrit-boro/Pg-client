// ==============================
// SAVE ROOM
// ==============================

import { useMutation, useQueryClient } from "@tanstack/react-query";
const saveRoom = async ({ roomId, listingId }) => {
  console.log("hitt");
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/listings/saved-rooms`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room_id: roomId, listing_id: listingId }),
    },
  );
  if (!res.ok) throw new Error("Failed to save room");
  return res.json();
};

const deleteRoom = async ({ roomId, listingId }) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/listings/saved-rooms`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room_id: roomId, listing_id: listingId }),
    },
  );
  if (!res.ok) throw new Error("Failed to delete room");
  return res.json();
};
export function useSaveRoom(pgId, type, currentPage) {
  console.log("=", pgId, "==", type, "==", currentPage);

  const queryClient = useQueryClient();

  const { mutate: saveRoomMutate, isPending: isSavingRoom } = useMutation({
    mutationFn: saveRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getRoomsByPg", pgId, type, currentPage],
      });
    },
  });

  const { mutate: removeRoomMutate, isPending: isRemovingRoom } = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getRoomsByPg", pgId, type, currentPage],
      });
    },
  });

  return {
    saveRoom: saveRoomMutate,
    removeRoom: removeRoomMutate,
    isRoomPending: isSavingRoom || isRemovingRoom,
  };
}
