import { useMemo, useState } from "react";

type SortDirection = "asc" | "desc";
type SortBy = { columnId: string; direction: SortDirection } | null;

export const useSortableTable = (tableData: any[]) => {
  const [sortBy, setSortBy] = useState<SortBy>(null);

  const getNestedValue = (obj: any, path: string) => {
    if (obj.hasOwnProperty(path)) {
      return obj[path];
    }

    return path.split(".").reduce((value, key) => {
      return value?.[key];
    }, obj);
  };

  const sortedData = useMemo(() => {
    if (!sortBy) return tableData;

    return [...tableData].sort((a, b) => {
      const valueA = getNestedValue(a, sortBy.columnId);
      const valueB = getNestedValue(b, sortBy.columnId);

      const isEmpty = (value: any) =>
        value === null || value === undefined || value === "";

      if (isEmpty(valueA) && isEmpty(valueB)) return 0;
      if (isEmpty(valueA)) return sortBy.direction === "asc" ? 1 : -1;
      if (isEmpty(valueB)) return sortBy.direction === "asc" ? -1 : 1;

      const isDate = (value: any) =>
        typeof value === "string" &&
        new Date(value).toString() !== "Invalid Date";

      if (isDate(valueA) && isDate(valueB)) {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return sortBy.direction === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      const strA = String(valueA).toLocaleLowerCase();
      const strB = String(valueB).toLocaleLowerCase();

      return sortBy.direction === "asc"
        ? strA.localeCompare(strB, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        : strB.localeCompare(strA, undefined, {
            numeric: true,
            sensitivity: "base",
          });
    });
  }, [tableData, sortBy]);

  const handleSort = (columnId: string) => {
    if (columnId === "actions" || columnId === "select") return;

    setSortBy((prev) => {
      if (prev?.columnId === columnId) {
        return {
          columnId,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }

      return { columnId, direction: "asc" };
    });
  };

  const clearSorting = () => setSortBy(null);

  return { data: sortedData, sortBy, handleSort, clearSorting };
};
