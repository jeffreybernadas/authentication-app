import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ArrowDown, ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUsers, ResponseDataType } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AuthDataType } from "@/hooks/useAuth";
import useApiQueryParams, { FilterOptions } from "@/hooks/useApiQueryParams";
import { useState } from "react";

export type UserDataTypeResponse = {
  service: string;
  appVersion: string;
  method: string;
  status: number;
  timestamp: string;
  responseTime: string;
  url: string;
  data: UserDataType;
};

export type UserDataType = {
  limit: number;
  page: number;
  totalCount: number;
  users: AuthDataType[];
};

// eslint-disable-next-line react-refresh/only-export-components
export const columns: ColumnDef<AuthDataType>[] = [
  {
    accessorKey: "role",
    header: () => <div className="text-center">Account Status</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("role")}</div>
    ),
    meta: { filterKey: "role" },
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: () => {
      return <div className="text-center">Email</div>;
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("email")}</div>
    ),
    meta: { filterKey: "email" },
    enableSorting: true,
  },
  {
    accessorKey: "verified",
    header: () => <div className="text-center">Account Status</div>,
    cell: ({ row }) => {
      const verified = row.getValue("verified");

      return (
        <div className="text-center font-medium">
          {verified ? "Activated" : "Not Activated"}
        </div>
      );
    },
    meta: { filterKey: "verified" },
    enableSorting: false,
  },
  {
    accessorKey: "oAuthStrategy",
    header: () => <div className="text-center">Strategy</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("oAuthStrategy")}</div>
    ),
    meta: { filterKey: "oAuthStrategy" },
    enableSorting: false,
  },
];

const AdminDashboard = () => {
  const { params, setFilter, getQueryString } = useApiQueryParams({
    limit: 10,
    page: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const { data: response } = useQuery<
    unknown,
    ResponseDataType,
    UserDataTypeResponse
  >({
    queryKey: ["users", params],
    queryFn: () => getUsers(getQueryString()),
    placeholderData: keepPreviousData,
  });
  const users = response?.data?.users;

  /**
   * Tanstack React Table uses a different sorting state format than the one we use in the API.
   * This function converts the API sorting state to the Tanstack React Table sorting state.
   * Example: sort: { email: "desc" } => [{ id: "email", desc: true }] - Note that this value we are converting is from the hook.
   * It is not the same as the one we use in the API. The API uses a string format like sort="email desc".
   * @param sort
   * @returns
   */
  const sortToState = (sort: FilterOptions["sort"]) => {
    if (!sort) return [];

    // Convert the object into an array of { id, desc } objects
    return Object?.entries(sort)?.map(([key, value]) => ({
      id: key,
      desc: value === "desc",
    }));
  };
  const sortingState = sortToState(params.sort);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);

    // Clear the previous debounce timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    if (value === "") {
      // If the input is empty, immediately set the filter and don't set a timeout
      setFilter({ email: "" }); // or null based on your API needs
    } else {
      // Set a new debounce timeout for non-empty input
      const timeout = setTimeout(() => {
        setFilter({ email: value });
      }, 700); // Adjust the debounce delay here

      // Store the timeout ID to clear it later
      setDebounceTimeout(timeout);
    }
  };

  const table = useReactTable<AuthDataType>({
    data: users || [],
    columns,
    onSortingChange: (updaterOrValue) => {
      const newSortingState =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sortingState)
          : updaterOrValue;

      if (!newSortingState.length) {
        return setFilter({
          sort: {}, // Reset sorting if no state is present
        });
      }

      return setFilter({
        sort: {
          [newSortingState[0].id ?? "email"]:
            newSortingState[0].desc ?? false ? "desc" : "asc",
        },
      });
    },
    onPaginationChange: () =>
      setFilter({
        limit: params.limit,
        page: params.page,
      }),
    getCoreRowModel: getCoreRowModel(),
    rowCount: response?.data?.totalCount,
    pageCount: Math.ceil(
      (response?.data?.totalCount ?? 0) / (params?.limit ?? 10)
    ),
    state: {
      pagination: {
        pageIndex: params.page ?? 1, //initial page index
        pageSize: params.limit ?? 10, //default page size
      },
      sorting: sortingState,
    },
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
  });
  return (
    <div className="w-1/2 h-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={searchTerm}
          onChange={handleFilterChange}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex justify-center items-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {(header.column.getCanSort() &&
                          {
                            asc: <ArrowUp className="w-4 h-4 ml-3" />,
                            desc: <ArrowDown className="w-4 h-4 ml-3" />,
                            false: "",
                          }[header.column.getIsSorted() as string]) ??
                          null}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Total items: {table.getRowCount()}
        </div>
        <div className="flex-1 text-sm text-muted-foreground">
          Page {(params.page ?? 0) + 1} of {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFilter({
                limit: params.limit,
                page: (params.page ?? 0) - 1,
              })
            }
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setFilter({
                limit: params.limit,
                page: (params.page ?? 0) + 1,
              })
            }
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
