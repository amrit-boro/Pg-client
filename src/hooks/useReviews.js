import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 4;

const fetchReviews = async ({ listingId, pageParam = 0 }) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/reviews/listing/${listingId}?limit=${LIMIT}&offset=${pageParam}`,
  );
  if (!res.ok) throw new Error("Failed to fetch reviews");
  const json = await res.json();
  return json.data;
};

export const useReviews = (listingId) =>
  useInfiniteQuery({
    queryKey: ["reviews", listingId],
    queryFn: ({ pageParam }) => fetchReviews({ listingId, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // if last page returned fewer than LIMIT, no more pages
      if (lastPage.length < LIMIT) return undefined;
      return allPages.flat().length; // next offset
    },
    enabled: !!listingId,
    staleTime: 1000 * 60 * 5,
  });
