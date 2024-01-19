import { useQuery } from "@tanstack/react-query";
import apiFetch from "../utils/fetch-api";

export function useAnimalYear() {
  return useQuery({
    queryKey: ["animal-year"],
    queryFn: async () => {
      const payload: string[] = await apiFetch(`/api/years.json`, {
        method: "GET",
      });
      return payload;
    },
  });
}
