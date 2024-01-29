import classNames from "classnames";
import type { TAnimalTracking } from "../../types/animal-tracking";
import type { Selected, SetSelected } from "../Map/shared";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { dataGridcColumns } from "./columns";

type DataGrid = {
  tracks: TAnimalTracking[];
  year: string;
  selected: Selected;
  setSelected: SetSelected;
};

export const DataGrid = ({ tracks, selected, setSelected }: DataGrid) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: tracks,
    columns: dataGridcColumns,
    state: {
      sorting,
      rowSelection: selected,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setSelected,
    debugTable: false,
  });
  return (
    <div className="p-1 overflow-auto h-full w-full">
      <table className="w-full h-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {!header.isPlaceholder && header.column.getCanSort() && (
                    <button
                      className="cursor-pointer use select-none underline decoration-dashed underline-offset-2 decoration-slate-800 hover:decoration-solid"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </button>
                  )}
                  {!header.isPlaceholder && !header.column.getCanSort() && (
                    <span>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={classNames({
                "bg-red-300": row.getIsSelected(),
              })}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};
