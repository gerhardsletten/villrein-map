import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Pane, useMapEvents } from "react-leaflet";
import cx from "classnames";
import "leaflet/dist/leaflet.css";
import { center, points } from "@turf/turf";
import { maps } from "../../utils/statkart";
import {
  type IAnimalPositionDetail,
  useAnimalPosition,
} from "../../hooks/use-animal-position";
import { useAnimalYear } from "../../hooks/use-year";
import { useParams, useNavigate } from "react-router-dom";
import type { TAnimalTracking, TTrack } from "../../types/animal-tracking";
import { AnimalTrack } from "./AnimalTrack";
import type { Selected, SetSelected } from "./shared";
import { DataGrid } from "../DataGrid/DataGrid";
import { SlidePanel } from "../../components/Slidepanel";
import { HeatMap } from "./HeatMap";

type TViewMode = "regular" | "heat";

export function AnimalMap() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Selected>({});
  const [predicate, setPredicate] = useState("");
  const [mode, setMode] = useState<TViewMode>("regular");
  const { year: yearSlug } = useParams();
  const [detail, setDetail] = useState<IAnimalPositionDetail>("day");
  const year = yearSlug || "2023";
  const years = useAnimalYear();
  const { data: dataRaw } = useAnimalPosition(year, detail);
  const data = useMemo<TAnimalTracking[] | undefined>(() => {
    if (!dataRaw) {
      return dataRaw;
    }

    const list = predicate
      .split(",")
      .filter(Boolean)
      .map((val) => parseInt(val));
    if (list.length === 0) {
      return dataRaw;
    }
    const fn = (value: TTrack) => {
      const date = new Date(value.date);
      return list.includes(date.getMonth());
    };
    const filtered = dataRaw.map(({ positions, ...track }) => {
      return {
        ...track,
        positions: positions.filter(fn),
      };
    });
    return filtered;
  }, [dataRaw, predicate]);
  if (!dataRaw || !data || !years.data) {
    return "Loading";
  }
  const c = center(points(dataRaw[0].positions.map((pos) => pos.point)));
  return (
    <main className="w-screen h-screen relative overflow-hidden">
      <nav className="grid grid-cols-1 gap-2 items-center justify-end absolute right-0 top-0 bg-white z-10 w-[200px] p-4">
        <label>Velg år</label>
        <select
          className="bg-stone-200 rounded p-1 px-2"
          value={year}
          onChange={(event) => {
            navigate(`/${event.target.value}`);
          }}
        >
          {years.data.map((y, i) => (
            <option key={i} value={y}>
              {y}
            </option>
          ))}
        </select>
        <label>Velg oppløsning</label>
        <select
          className="bg-stone-200 rounded p-1 px-2"
          value={detail}
          onChange={(event) => {
            const { value } = event.target;
            if (value === "full" || value === "day" || value === "week") {
              setDetail(value);
            }
          }}
        >
          {[
            ["Uke", "week"],
            ["Dag", "day"],
            ["Alle punkter", "full"],
          ].map(([label, value], i) => (
            <option key={i} value={value}>
              {label}
            </option>
          ))}
        </select>
        <label>Filtrer mnd</label>
        <select
          className="bg-stone-200 rounded p-1 px-2"
          value={predicate}
          onChange={(event) => {
            const { value } = event.target;
            setPredicate(value);
          }}
        >
          {[
            ["Jan-Des (Hele året)", ""],
            ["Jan-Mar", "0,1,2"],
            ["Apr-Jun", "3,4,5"],
            ["Jul-Sep", "6,7,8"],
            ["Okt-Des", "9,10,11"],
            ["Okt-Mar (vinter)", "9,10,11,0,1,2"],
            ["Apr-Sep (sommer)", "3,4,5,6,7,8"],
          ].map(([label, value], i) => (
            <option key={i} value={value}>
              {label}
            </option>
          ))}
        </select>
        <label>Visning</label>
        <select
          className="bg-stone-200 rounded p-1 px-2"
          value={mode}
          onChange={(event) => {
            const { value } = event.target;
            if (value === "regular" || value === "heat") {
              if (value === "heat") {
                setDetail("full");
              }
              setMode(value);
            }
          }}
        >
          {[
            ["Vanlig", "regular"],
            ["Varmekart", "heat"],
          ].map(([label, value], i) => (
            <option key={i} value={value}>
              {label}
            </option>
          ))}
        </select>
      </nav>
      <MapContainer
        className={cx("z-0 w-screen h-screen")}
        center={[c.geometry.coordinates[1], c.geometry.coordinates[0]]}
        zoom={10}
        scrollWheelZoom={false}
        tapTolerance={5}
      >
        <TileLayer attribution={maps[0].attr} url={maps[0].url} />
        {mode === "regular" && (
          <AnimalListing
            tracks={data}
            year={year}
            selected={selected}
            setSelected={setSelected}
          />
        )}
        {mode === "heat" && <HeatMap tracks={data} />}
      </MapContainer>
      <SlidePanel>
        <DataGrid
          tracks={data}
          selected={selected}
          setSelected={setSelected}
          year={year}
        />
      </SlidePanel>
    </main>
  );
}

type AnimalListing = {
  tracks: TAnimalTracking[];
  year: string;
  selected: Selected;
  setSelected: SetSelected;
};

const AnimalListing = ({
  tracks,
  year,
  selected,
  setSelected,
}: AnimalListing) => {
  useMapEvents({
    click: () => {
      setSelected({});
    },
  });
  useEffect(() => {
    setSelected({});
  }, [year, setSelected]);
  return (
    <>
      <Pane name="popup-pane" style={{ zIndex: 10001 }}></Pane>
      <Pane name="marker-pane" style={{ zIndex: 10000 }}></Pane>
      <Pane name="selected-pane" style={{ zIndex: 9999 }}></Pane>
      {tracks
        .filter((_, i) => i < 200)
        .map((animal, i) => {
          return (
            <AnimalTrack
              num={i}
              key={i}
              animal={animal}
              isSelected={selected[i]}
              setSelected={() => {
                setSelected((prev) => ({ ...prev, [`${i}`]: true }));
              }}
            />
          );
        })}
    </>
  );
};

export default AnimalMap;
