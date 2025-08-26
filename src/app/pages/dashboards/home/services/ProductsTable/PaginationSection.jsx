// // Import Dependencies
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
//         {paginationState.pageIndex * paginationState.pageSize + 1} -{" "}
//         {table.getRowModel().rows.length} of{" "}
//         {table.getCoreRowModel().rows.length} entries
//       </div>
//     </div>
//   );
// }

// PaginationSection.propTypes = {
//   table: PropTypes.object,
// };

// Import Dependencies
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

export function PaginationSection({ table }) {
  const paginationState = table.getState().pagination;
  const { isXl, is2xl } = useBreakpointsContext();

  const total = table.getFilteredRowModel().rows.length;
  const current = table.getRowModel().rows.length;
  const start = total
    ? paginationState.pageIndex * paginationState.pageSize + 1
    : 0;
  const end = total ? Math.min(start + current - 1, total) : 0;

  return (
    <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
      <div>
        <Pagination
          total={table.getPageCount()}
          value={paginationState.pageIndex + 1}
          onChange={(page) => table.setPageIndex(page - 1)}
          siblings={isXl ? 2 : is2xl ? 3 : 1}
          boundaries={isXl ? 2 : 1}
        >
          <PaginationPrevious />
          <PaginationItems />
          <PaginationNext />
        </Pagination>
      </div>
      <div className="text-xs-plus truncate">
        {start} - {end} of {total} entries
      </div>
    </div>
  );
}

PaginationSection.propTypes = {
  table: PropTypes.object,
};
