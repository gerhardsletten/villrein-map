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
  columnHelper.accessor((row) => row.positions.length, {
    id: "position",
    header: "posisjoner",
  }),
  columnHelper.accessor(
    (row) => {
      return row.positions.reduce((sum, item) => {
        return sum + item.dist;
      }, 0);
    },
    {
      id: "dist",
      header: "distanse",
      cell: ({ getValue }) => formatMeter(getValue()),
    }
  ),
  columnHelper.accessor(
    (row) => {
      const items = row.positions.map((item) => item.dist);
      return Math.min(...items);
    },
    {
      id: "min",
      header: "min",
      cell: ({ getValue }) => formatMeter(getValue()),
    }
  ),
  columnHelper.accessor(
    (row) => {
      const items = row.positions
        .map((item) => item.date.split("T")[0])
        .filter((item) => item);
      const days = [...new Set(items)];
      const value = row.positions.reduce((sum, item) => {
        return sum + item.dist;
      }, 0);
      return value / days.length;
    },
    {
      id: "avg",
      header: "snitt / dag",
      cell: ({ getValue }) => formatMeter(getValue()),
    }
  ),
  columnHelper.accessor(
    (row) => {
      const items = row.positions.map((item) => item.dist);
      return Math.max(...items);
    },
    {
      id: "max",
      header: "maks",
      cell: ({ getValue }) => formatMeter(getValue()),
    }
  ),
  columnHelper.accessor(
    (row) => {
      const items = row.positions
        .map((item) => item.date.split("T")[0])
        .filter((item) => item);
      return [...new Set(items)].length;
    },
    {
      id: "days",
      header: "dager",
      cell: ({ getValue }) => getValue(),
    }
  ),
];
