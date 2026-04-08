import { useQuery } from "@tanstack/react-query";
import {
  fetchRooms,
  getAllPg,
  getAllRoomsByPgId,
  getdetailById,
  getFilteredListings,
  getPgDetail,
  getPgdetailById,
} from "../services/apiPGs";

export const usePgdetail = () => {
  const { data: pgdetail, isLoading } = useQuery({
    queryKey: ["pgdetail"],
    queryFn: getPgDetail,
  });
  return {
    pgdetail,
    isLoading,
  };
};

export const useRoomdetails = (id) => {
  const { data, isLoading } = useQuery({
    queryKey: ["roomdetail", id],
    queryFn: () => getdetailById(id),
    enabled: !!id,
  });
  return { data, isLoading };
};

export const useGetAllPg = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["pgDetails"],
    queryFn: getAllPg,
  });
  return { data, isLoading, error };
};

export const useFilteredPg = (filters, page) => {
  console.log("page; ", page);
  const { data, isLoading, error } = useQuery({
    queryKey: ["pgListings", filters, page],
    queryFn: getFilteredListings,
  });

  return { data, isLoading, error };
};

export const usePgById = (id) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["getPgDetailById", id],
    queryFn: () => getPgdetailById(id),
  });
  return { data, isLoading, error };
};

export const useRoomsByPg = (pgId, type, page) => {
  console.log("pgid: ", pgId, "type:", type, "page: ", page);
  const { data, isLoading, error } = useQuery({
    queryKey: ["getRoomsByPg", pgId, type, page],
    queryFn: () => getAllRoomsByPgId(pgId, type, page),
  });
  return { data, isLoading, error };
};

export function useRooms(pgId, type) {
  console.log(pgId, type);
  const { data, isLoading, error } = useQuery({
    queryKey: ["rooms", pgId, type],
    queryFn: fetchRooms,
    enabled: Boolean(pgId && type),
    staleTime: 1000 * 60 * 5,
  });

  return { data, isLoading, error };
}
