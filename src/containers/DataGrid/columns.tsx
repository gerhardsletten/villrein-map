import type { TAnimalTracking } from "../../types/animal-tracking";

import { createColumnHelper } from "@tanstack/react-table";
import { formatMeter } from "../../utils/format";

const columnHelper = createColumnHelper<TAnimalTracking>();

export const dataGridcColumns = [
  columnHelper.accessor((row) => row.id, {
    id: "select",
    header: "#",
    enableSorting: false,
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }),
  columnHelper.accessor("name", {
    header: "navn",
    cell: (info) => (
      <i>
        {info.row.original.ageString} {info.getValue()}
      </i>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("positions", {
    id: "positions",
    header: "posisjoner",
    cell: ({ getValue }) => {
      return getValue().length;
    },
  }),
  columnHelper.accessor("positions", {
    id: "dist",
    header: "distanse",
    cell: ({ getValue }) => {
      const positions = getValue();
      const value = positions.reduce((sum, item) => {
        return sum + item.dist;
      }, 0);
      return formatMeter(value);
    },
  }),
  columnHelper.accessor("positions", {
    id: "min",
    header: "min",
    cell: ({ getValue }) => {
      const positions = getValue();
      const items = positions.map((item) => item.dist);
      const value = Math.min(...items);
      return formatMeter(value);
    },
  }),
  columnHelper.accessor("positions", {
    id: "avg",
    header: "snitt / dag",
    cell: ({ getValue }) => {
      const positions = getValue();
      const items = positions
        .map((item) => item.date.split("T")[0])
        .filter((item) => item);
      const days = [...new Set(items)];

      const value = positions.reduce((sum, item) => {
        return sum + item.dist;
      }, 0);
      return formatMeter(value / days.length);
    },
  }),
  columnHelper.accessor("positions", {
    id: "max",
    header: "maks",
    cell: ({ getValue }) => {
      const positions = getValue();
      const items = positions.map((item) => item.dist);
      const value = Math.max(...items);
      return formatMeter(value);
    },
  }),
  columnHelper.accessor("positions", {
    id: "days",
    header: "dager",
    cell: ({ getValue }) => {
      const positions = getValue();
      const items = positions
        .map((item) => item.date.split("T")[0])
        .filter((item) => item);
      const uniq = [...new Set(items)];
      return uniq.length;
    },
  }),
];
