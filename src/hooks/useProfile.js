import { useQuery } from "@tanstack/react-query";

const fetchUserProfile = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/users/details`,
  );
  if (!res.ok) throw new Error("Failed to fetch user details");
  const json = await res.json();
  return json.data;
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfileDetail"],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5,
  });
};
