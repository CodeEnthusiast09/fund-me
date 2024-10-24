"use client";
import { PaginationProps } from "./type";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import clsx from "clsx";
import { useMemo } from "react";

export const Pagination = ({ pagination, onPaginate }: PaginationProps) => {
  const { total = 0, perPage = 1, currentPage = 1, hasMorePages } = pagination;
  const totalPages = useMemo(() => Math.ceil(total / perPage), [total, perPage]);

  const renderPageButtons = useMemo(() => {
    if (totalPages <= 1) return [];

    const pagesToShow: (number | string)[] = [];

    // Show first page
    pagesToShow.push(1);

    // Show second page if there are at least 2 pages
    if (totalPages >= 2) {
      pagesToShow.push(2);
    }

    // Add ellipsis if currentPage is beyond 3
    if (currentPage > 3) {
      pagesToShow.push("ellipsis-1");
    }

    // Add pages around the current one (2 before and 2 after)
    for (let i = Math.max(3, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 2); i++) {
      pagesToShow.push(i);
    }

    // Add ellipsis if the current page is far from the last 2
    if (currentPage < totalPages - 2) {
      pagesToShow.push("ellipsis-2");
    }

    // Show last two pages only if totalPages > 3
    if (totalPages > 3) {
      if (totalPages - 1 > 2) pagesToShow.push(totalPages - 1);
      pagesToShow.push(totalPages);
    }

    return pagesToShow;
  }, [totalPages, currentPage]);

  const handleEllipsisClick = (type: string) => {
    if (type === "ellipsis-1") {
      onPaginate(Math.max(currentPage - 3, 3)); // Expand to earlier pages
    } else if (type === "ellipsis-2") {
      onPaginate(Math.min(currentPage + 3, totalPages - 2)); // Expand to later pages
    }
  };

  if (total <= perPage) return null; // No pagination needed if total is less than or equal to per page

  return (
    <div className="flex gap-3 flex-wrap justify-center items-center bg-white py-2 px-10 text-sm">
      {/* Previous Button */}
      <button
        className={clsx(
          "flex items-center justify-center gap-x-1 px-1 py-2 min-w-10 ease-in-out duration-300 rounded focus:outline-primary-500 border px-3",
          currentPage === 1 ? "text-gray-500" : "hover:bg-primary-500 hover:text-white"
        )}
        onClick={() => onPaginate(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        <IoIosArrowRoundBack className="text-xl" />
        <span>Previous</span>
      </button>

      {/* Page Numbers */}
      {renderPageButtons.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            className={clsx(
              "flex items-center justify-center px-1 py-2 min-w-10 ease-in-out duration-300 rounded focus:outline-primary-500",
              currentPage === page
                ? "bg-primary-500 hover:bg-primary/80 text-white"
                : "border hover:bg-primary-500 hover:text-white"
            )}
            onClick={() => onPaginate(page)}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        ) : (
          <button
            key={index}
            className="px-3 py-2 text-gray-500"
            onClick={() => handleEllipsisClick(page)}
            aria-label="Expand Pages"
          >
            ...
          </button>
        )
      )}

      {/* Next Button */}
      <button
        className={clsx(
          "flex items-center justify-center gap-x-1 px-1 py-2 min-w-10 ease-in-out duration-300 rounded focus:outline-primary-500 border px-3",
          hasMorePages ? "hover:bg-primary-500 hover:text-white" : "text-gray-500"
        )}
        onClick={() => onPaginate(Math.min(currentPage + 1, totalPages))}
        disabled={!hasMorePages}
      >
        <span>Next</span>
        <IoIosArrowRoundForward className="text-xl" />
      </button>
    </div>
  );
};
