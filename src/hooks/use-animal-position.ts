import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { TAnimalTracking } from "../types/animal-tracking";
import apiFetch from "../utils/fetch-api";

export type IAnimalPositionDetail = "full" | "week" | "day";

type TAnimalTrackingApi = Omit<TAnimalTracking, "num">;

export function useAnimalPosition(
  year: string,
  details: IAnimalPositionDetail,
  animal?: number
) {
  return useQuery({
    queryKey: ["animal-position", year, details, animal],
    queryFn: async () => {
      const payload: TAnimalTrackingApi[] = await apiFetch(
        `/api/${year}-${details}.json`,
        {
          method: "GET",
          params: {
            animal,
          },
        }
      );
      const data: TAnimalTracking[] = payload.map((item, i) => ({
        ...item,
        num: i,
      }));
      return data;
    },
    placeholderData: keepPreviousData,
  });
}
