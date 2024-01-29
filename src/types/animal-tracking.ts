export interface TTrack {
  point: [number, number];
  date: string;
  dist: number;
}

export interface TAnimalTracking {
  num: number;
  id: string;
  name: string;
  ageString: string;
  positions: TTrack[];
}
