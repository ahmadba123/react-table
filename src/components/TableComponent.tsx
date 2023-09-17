import React, { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  // UsePaginationInstanceProps,
} from "@tanstack/react-table";
import mdata from "../data.json";
import { DateTime } from "luxon";

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
  gender: string;
};

type SortingState = {
  id: string;
  desc: boolean;
}[];

type ColumnFiltersState = {
  filterValue: string;
};

const columnHelper = createColumnHelper<Person>();
const columns = [
  columnHelper.group({
    id: "hello",
    header: () => <span>full Name</span>,
    // footer: props => props.column.id,
    columns: [
      columnHelper.accessor("id", {
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("firstName", {
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: "lastName",
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      }),
    ],
  }),
  columnHelper.group({
    id: "info",
    header: () => <span>info</span>,
    // footer: props => props.column.id,
    columns: [
      columnHelper.accessor("email", {
        header: () => "Email",
        cell: (info) => info.renderValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("dob", {
        header: () => <span>Date of Birth</span>,
        cell: (info) => {
          const formattedDate = DateTime.fromJSDate(
            info.getValue()
          ).toLocaleString(DateTime.DATE_MED);
          return <span>{formattedDate}</span>;
        },
        footer: (info) => info.column.id,
      }),

      columnHelper.accessor("gender", {
        header: "Gender",
        footer: (info) => info.column.id,
      }),
    ],
  }),
];

export function TableComponent() {
  const data = React.useMemo(() => {
    return mdata.map((person) => ({
      ...person,
      dob: new Date(person.dob),
    }));
  }, []);
  const pageSize = 5; // Number of rows per page
  const pageCount = Math.ceil(data.length / pageSize); 
  // const pageSize = 5; // Number of rows per page
  // const [currentPage, setCurrentPage] = useState(0);

  // const pageCount = Math.ceil(data.length / pageSize);
  // const paginatedData = data.slice(
  //   currentPage * pageSize,
  //   currentPage * pageSize + pageSize
  // );
  const [filter, setFilter] = useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>({
  //   filterValue: "",
  // });

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter: filter,
      // columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: (newFilter: string) => {
      setFilter(newFilter);
    },
    // onColumnFiltersChange: setColumnFilters, // Uncomment if needed

    debugTable: true,
  });

  return (
    <div className="p-4">
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border border-gray-300 p-2 rounded-md"
        placeholder="Search..."
      />
      <table className="min-w-full border border-gray-300">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        className="min-w-full border border-gray-300 p-2 cursor-pointer select-none"
                        {...{
                          // className: header.column.getCanSort()
                          //   ? 'cursor-pointer select-none'
                          //   : '',

                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.slice(0, 10)
            .map((row) => (
              <tr
                key={row.id}
                className={
                  row.original.gender === "Male"
                    ? "bg-gray-200"
                    : "bg-green-200"
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-2 px-4 text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      <div className="py-2 flex justify-center space-x-4">
        <button
          onClick={() => table.setPageIndex(0)}
          className={`px-4 py-2 ${
            table.getCanPreviousPage()
              ? "bg-blue-500 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } rounded`}
        >
          First Page
        </button>
        <button
        disabled={!table.getCanNextPage()}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          className={`px-4 py-2 ${
            table.getCanNextPage()
              ? "bg-blue-500 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } rounded`}
        >
          Last Page
        </button>

        <button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.setPageIndex((prevIndex) => prevIndex - 1)}
          className={`px-4 py-2 ${
            table.getCanPreviousPage()
              ? "bg-blue-500 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } rounded`}
        >
          Previous Page
        </button>
        <button
          disabled={!table.getCanNextPage()}
          onClick={() => table.setPageIndex((prevIndex) => prevIndex + 1)}
          className={`px-4 py-2 ${
            table.getCanNextPage()
              ? "bg-blue-500 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } rounded`}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}
