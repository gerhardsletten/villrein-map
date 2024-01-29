import { canvas } from "leaflet";

export type Selected = Record<string, boolean>;
export type SetSelected = React.Dispatch<React.SetStateAction<Selected>>;

export const canvasRenderer = canvas({
  tolerance: 10,
});
