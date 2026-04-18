// hooks/useUpdateRoom.js
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, data }) => {
      console.log("data: ", data);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/listings/room/${roomId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data), // Standard JSON stringify
        },
      );
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["rooms"]);
    },
  });
};
