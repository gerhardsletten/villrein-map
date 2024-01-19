import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { TAnimalTracking } from "../types/animal-tracking";
import apiFetch from "../utils/fetch-api";

export type IAnimalPositionDetail = "full" | "week" | "day";

export function useAnimalPosition(
  year: string,
  details: IAnimalPositionDetail,
  animal?: number
) {
  return useQuery({
    queryKey: ["animal-position", year, details, animal],
    queryFn: async () => {
      const payload: TAnimalTracking[] = await apiFetch(
        `/api/${year}-${details}.json`,
        {
          method: "GET",
          params: {
            animal,
          },
        }
      );
      return payload;
    },
    placeholderData: keepPreviousData,
  });
}
