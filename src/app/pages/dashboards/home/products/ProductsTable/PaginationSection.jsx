// import PropTypes from "prop-types";

// // Local Imports
// import {
//   Pagination,
//   PaginationItems,
//   PaginationNext,
//   PaginationPrevious,
// } from "components/ui";
// import { useBreakpointsContext } from "app/contexts/breakpoint/context";

// // ----------------------------------------------------------------------

// export function PaginationSection({ table }) {
//   const paginationState = table.getState().pagination;
//   const { isXl, is2xl } = useBreakpointsContext();

//   const total = table.getFilteredRowModel().rows.length;
//   const current = table.getRowModel().rows.length;
//   const start = total
//     ? paginationState.pageIndex * paginationState.pageSize + 1
//     : 0;
//   const end = total ? Math.min(start + current - 1, total) : 0;

//   return (
//     <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
//       <div>
//         <Pagination
//           total={table.getPageCount()}
//           value={paginationState.pageIndex + 1}
//           onChange={(page) => table.setPageIndex(page - 1)}
//           siblings={isXl ? 2 : is2xl ? 3 : 1}
//           boundaries={isXl ? 2 : 1}
//         >
//           <PaginationPrevious />
//           <PaginationItems />
//           <PaginationNext />
//         </Pagination>
//       </div>
//       <div className="text-xs-plus truncate">
//         {start} - {end} of {total} entries
//       </div>
//     </div>
//   );
// }

// PaginationSection.propTypes = {
//   table: PropTypes.object,
// };

import PropTypes from "prop-types";

// Local Imports
import {
  Pagination,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
} from "components/ui";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";

// ----------------------------------------------------------------------

export function PaginationSection({ table, page, totalPages, total, limit, onPageChange, onLimitChange }) {
  const { isXl, is2xl } = useBreakpointsContext();

  return (
    <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
      <div className="flex items-center space-x-3">
        <Pagination
          total={totalPages}
          value={page}
          onChange={(p) => onPageChange(p)}
          siblings={isXl ? 2 : is2xl ? 3 : 1}
          boundaries={isXl ? 2 : 1}
        >
          <PaginationPrevious />
          <PaginationItems />
          <PaginationNext />
        </Pagination>

   
        <select
  value={limit}
  onChange={(e) => {
    onLimitChange(Number(e.target.value));
    onPageChange(1);
  }}
  className="ml-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:border-primary-500 focus:border-primary-600 focus:ring-2 focus:ring-primary-500 focus:outline-none dark:border-dark-500 dark:bg-dark-800 dark:text-dark-100"
>
  <option value={25}>25 / page</option>
  <option value={50}>50 / page</option>
  <option value={100}>100 / page</option>
</select>

      </div>

      <div className="text-xs-plus truncate">
        Page {page} of {totalPages} — {total} products
      </div>
    </div>
  );
}

PaginationSection.propTypes = {
  table: PropTypes.object,
  page: PropTypes.number,
  totalPages: PropTypes.number,
  total: PropTypes.number,
  limit: PropTypes.number,
  onPageChange: PropTypes.func,
  onLimitChange: PropTypes.func,
};
