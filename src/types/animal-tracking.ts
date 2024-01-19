export interface TTrack {
  id: string | number;
  point: [number, number];
  date: string;
}

export interface TAnimalTrackingMeta {
  positions: number;
  distance: string;
  min: string;
  avg: string;
  max: string;
  days: number;
}

export interface TAnimalTracking {
  id: string;
  name: string;
  ageString: string;
  positions: TTrack[];
  meta: TAnimalTrackingMeta;
}
