"use client";
import { Pagination } from "components/pagination";
import { SearchBox } from "components/search-box";
import { TableInterface } from "interfaces";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Skeleton } from "components/skeleton";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import clsx from "clsx";
import { useSortableTable } from "hooks";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";
import { Button } from "components/button";

export const Table = ({
  data: tableData,
  columns: tableColumns,
  title,
  searchable = true,
  searchPlaceholder = "Search",
  handleSearch,
  isLoading = false,
  multiSelect = false,
  multiSelectActions,
  onMultiSelect,
  pagination,
  emptyDataIcon,
  emptyDataRowClassName = "h-[50vh]",
  setPage,
  hasBottomPadding = true,
  footerTitle,
  footerValue,
  showPreTableHeader = true,
  showSerialNumber = false,
  stickyFirstColumn = true,
}: Readonly<TableInterface>) => {
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(() => tableColumns, [tableColumns]);
  const {
    data: sortedData,
    handleSort,
    sortBy,
    clearSorting,
  } = useSortableTable(tableData || []);

  const tableInstance = useReactTable({
    data: sortedData,

    // @ts-ignore
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: multiSelect,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowSelect = useCallback(() => {
    const { flatRows } = tableInstance.getSelectedRowModel();
    const items = flatRows?.map((item: any) => item.original);

    if (onMultiSelect) onMultiSelect(items);
  }, [rowSelection]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    handleRowSelect();
  }, [handleRowSelect]);

  return (
    <div className="flex flex-col ">
      <div
        className={`overflow-auto sm:-mx-6 lg:-mx-6  ${!searchable && "mt-6"}`}
      >
        <div className="align-middle inline-block w-full sm:px-6 lg:px-8">
          {searchable && (
            <div className="py-5">
              <SearchBox
                onChange={(value) => handleSearch?.(value)}
                placeholder={searchPlaceholder}
              />
            </div>
          )}

          <div className="rounded-lg overflow-auto border-[#D4D4D8] border divide-y divide-[#D4D4D8]">
            {showPreTableHeader && (
              <div
                className={`bg-white px-6  py-4 whitespace-nowrap flex flex-col md:flex-row ${
                  title ? "justify-between" : "justify-end"
                }`}
              >
                <div className="flex gap-5 items-center">
                  {title && (
                    <h3 className="text-sm font-semibold" id="table-title">
                      {title}
                    </h3>
                  )}
                </div>

                <div className="flex gap-5 items-center">
                  {multiSelectActions && (
                    <div className="flex gap-4">{multiSelectActions}</div>
                  )}

                  {sortBy && sortBy?.columnId ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => clearSorting()}
                    >
                      Clear sorting
                    </Button>
                  ) : null}

                  {pagination && (
                    <div className="text-xs text-gray-500 flex gap-8 items-center justify-between">
                      {pagination &&
                      pagination?.currentPage &&
                      pagination?.perPage &&
                      pagination?.total ? (
                        <span className="flex items-center gap-1">
                          <div>Showing</div>
                          {(pagination?.currentPage! - 1) *
                            pagination?.perPage! +
                            1}{" "}
                          -{" "}
                          {Math.min(
                            pagination?.currentPage! * pagination?.perPage!,
                            pagination?.total!
                          )}{" "}
                          of {pagination?.total}{" "}
                          {pagination?.total ?? 1 > 1 ? "items" : "item"}
                        </span>
                      ) : null}

                      {pagination &&
                      pagination?.total &&
                      Math.ceil(
                        pagination?.total / (pagination?.perPage || 1)
                      ) > 1 ? (
                        <div>
                          <button
                            className={`${
                              Number(pagination?.currentPage) > 1
                                ? "text-black"
                                : "text-[#9CA3AF]"
                            } `}
                            onClick={() =>
                              setPage?.(Number(pagination?.currentPage) - 1)
                            }
                            disabled={
                              Number(Number(pagination?.currentPage)) === 1
                            }
                          >
                            <TfiAngleLeft />
                          </button>
                          <button
                            className={`ml-4 ${
                              Number(pagination?.total) >
                              Number(pagination?.currentPage)
                                ? "text-black"
                                : "text-[#9CA3AF]"
                            } `}
                            onClick={() =>
                              setPage?.(Number(pagination?.currentPage) + 1)
                            }
                            disabled={
                              Number(pagination?.total) ===
                              Number(pagination?.currentPage)
                            }
                          >
                            <TfiAngleRight />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div
              className={clsx("overflow-auto z-1 w-full relative bg-white", {
                "pb-36": hasBottomPadding,
              })}
            >
              <table
                className="w-full divide-y divide-[#D4D4D8]"
                aria-labelledby="table-title"
              >
                <thead className="bg-disabled-300 divide-y divide-[#D2E1EF] border-t-0">
                  {tableInstance.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {showSerialNumber && (
                        <th className="px-5 py-3 relative text-left font-lato text-[12px] text-[#555555] font-[600] cursor-pointer  whitespace-nowrap">
                          S/N
                        </th>
                      )}
                      {headerGroup.headers.map((header, index) => {
                        return (
                          <th
                            key={header.id}
                            colSpan={header.colSpan}
                            className={clsx(
                              "px-6 py-4 text-left text-xs font-medium text-disabled-200 cursor-pointer",
                              {
                                "sticky left-0 z-1 bg-disabled-100":
                                  index === 0 && stickyFirstColumn,
                              }
                            )}
                            onClick={() => handleSort(header.id)}
                          >
                            {header.isPlaceholder ? null : (
                              <div className="flex items-center">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}

                                {header.id !== "actions" &&
                                  header?.id !== "select" && (
                                    <>
                                      {sortBy?.columnId === header.id && (
                                        <span className="ml-2">
                                          {sortBy.direction === "asc" ? (
                                            <FaSortUp />
                                          ) : (
                                            <FaSortDown />
                                          )}
                                        </span>
                                      )}
                                      {sortBy?.columnId !== header.id && (
                                        <span className="ml-2">
                                          <FaSort />
                                        </span>
                                      )}
                                    </>
                                  )}
                              </div>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-[#D2E1EF]">
                  {/* if isLoading, use skeleton rows  */}
                  {isLoading &&
                    [...Array(10)].map((_, i) => (
                      <tr key={i} className="hover:bg-gray-100">
                        {tableColumns?.map((_, j) => {
                          return (
                            <td key={j} className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center w-full">
                                <div className="text-sm text-gray-900 w-full">
                                  <Skeleton />
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  {/* if not isLoading and page has rows */}
                  {!isLoading &&
                    tableInstance.getRowModel().rows.map((row, rowIndex) => {
                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-gray-100 group relative"
                        >
                          {showSerialNumber && (
                            <td className="px-5 py-3 font-[700] text-left text-[12px] md:text-[14px] whitespace-nowrap border-b text-[#555555] ">
                              {rowIndex + 1}
                            </td>
                          )}
                          {row.getVisibleCells().map((cell, index) => {
                            return (
                              <td
                                key={cell.id}
                                className={clsx(
                                  "px-6 py-4 whitespace-nowrap relative",
                                  {
                                    "sticky left-0 bg-white z-10 group-hover:bg-gray-100":
                                      index === 0 && stickyFirstColumn,
                                  }
                                )}
                              >
                                <div className="flex items-center">
                                  <div className="text-sm text-gray-900">
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  {/* if empty row  */}
                  {!isLoading &&
                    tableInstance.getRowModel().rows?.length === 0 && (
                      <tr className={emptyDataRowClassName}>
                        <td
                          className="px-6 py-4 whitespace-nowrap"
                          colSpan={
                            showSerialNumber
                              ? tableColumns?.length + 1
                              : tableColumns?.length
                          }
                        >
                          <div className="flex justify-center flex-col items-center w-full">
                            <div className="text-4xl bg-secondary-500 text-white rounded-full p-2 shadow">
                              {emptyDataIcon ? (
                                emptyDataIcon
                              ) : (
                                <HiOutlineExclamationTriangle />
                              )}
                            </div>
                            <span className="text-sm text-gray-900">
                              No data is available
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                </tbody>
                {footerTitle && footerValue && (
                  <tfoot>
                    <tr className="hover:bg-gray-100 font-bold">
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        colSpan={tableColumns?.length / 2}
                      >
                        <div className="flex items-center">
                          <div className="text-sm text-gray-900">
                            {footerTitle}
                          </div>
                        </div>
                      </td>

                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        colSpan={tableColumns?.length / 2}
                      >
                        <div className="flex items-center justify-end">
                          <div className="text-sm text-gray-900">
                            {footerValue}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          <div className="mt-10">
            {pagination &&
            pagination?.currentPage &&
            pagination?.total &&
            pagination?.total > 1 ? (
              <Pagination
                pagination={pagination}
                onPaginate={(page: number) => {
                  setPage?.(page);
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
