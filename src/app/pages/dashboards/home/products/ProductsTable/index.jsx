// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import clsx from "clsx";
// import { useEffect, useRef, useState } from "react";

// // Import Dependencies
// import { CollapsibleSearch } from "components/shared/CollapsibleSearch";
// import { TableSortIcon } from "components/shared/table/TableSortIcon";
// import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
// import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
// import { SelectedRowsActions } from "components/shared/table/SelectedRowsActions";
// import { useBoxSize, useDidUpdate } from "hooks";
// import { useSkipper } from "utils/react-table/useSkipper";
// import { MenuAction } from "./MenuActions";
// import { columns } from "./columns";
// import { PaginationSection } from "./PaginationSection";
// import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
// import { getProducts, getProductsPaginated } from "utils/API/Authapi";

// const isSafari = getUserAgentBrowser() === "Safari";

// export function ProductsTable() {
//   const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
//   const [dataList, setDataList] = useState([]);

//   const theadRef = useRef();
//   const { height: theadHeight } = useBoxSize({ ref: theadRef });

//   const [globalFilter, setGlobalFilter] = useState("");
//   const [sorting, setSorting] = useState([]);

//   const GetAPI = async () => {
//     try {
//       const products = await getProductsPaginated({ allPages: true });

//       console.log("Products fetched:", products);
//       console.table(products);

//       setDataList(
//         Array.isArray(products)
//           ? products
//           : Array.isArray(products?.data)
//             ? products.data
//             : Array.isArray(products?.payload)
//               ? products.payload
//               : [],
//       );
//     } catch (error) {
//       console.error("GetAPI error:", error.message || error);
//     }
//   };

//   useEffect(() => {
//     GetAPI();
//   }, []);

//   const table = useReactTable({
//     data: dataList,
//     columns,
//     state: {
//       globalFilter,
//       sorting,
//     },
//     filterFns: {
//       fuzzy: fuzzyFilter,
//     },

//     getRowId: (row) => row._id ?? row.product_id,
//     meta: {
//       deleteRow: (row) => {
//         skipAutoResetPageIndex();
//         const id = row.original._id ?? row.original.product_id; // unified id check
//         setDataList((old) =>
//           old.filter((oldRow) => (oldRow._id ?? oldRow.product_id) !== id),
//         );
//       },
//       deleteRows: (rows) => {
//         skipAutoResetPageIndex();
//         const ids = rows.map((r) => r.original._id ?? r.original.product_id);
//         setDataList((old) =>
//           old.filter((r) => !ids.includes(r._id ?? r.product_id)),
//         );
//       },
//     },
//     getCoreRowModel: getCoreRowModel(),

//     onGlobalFilterChange: setGlobalFilter,
//     getFilteredRowModel: getFilteredRowModel(),
//     globalFilterFn: fuzzyFilter,

//     onSortingChange: setSorting,
//     getSortedRowModel: getSortedRowModel(),

//     getPaginationRowModel: getPaginationRowModel(),

//     autoResetPageIndex,
//   });

//   useDidUpdate(() => table.resetRowSelection(), [dataList]);

//   return (
//     <div className="col-span-12 flex flex-col lg:col-span-8 xl:col-span-9">
//       <div className="table-toolbar flex items-center justify-between">
//         <h2 className="dark:text-dark-100 truncate text-base font-medium tracking-wide text-gray-800">
//           Products List
//         </h2>
//         <div className="flex">
//           <CollapsibleSearch
//             placeholder="Search here..."
//             value={globalFilter ?? ""}
//             onChange={(e) => setGlobalFilter(e.target.value)}
//           />
//           <MenuAction />
//         </div>
//       </div>
//       <Card className="relative mt-3 flex grow flex-col">
//         <div className="table-wrapper min-w-full grow overflow-x-auto">
//           <Table
//             hoverable
//             className="w-full min-w-[600px] text-left rtl:text-right"
//           >
//             <THead ref={theadRef}>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <Tr key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <Th
//                       key={header.id}
//                       className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold text-gray-800 uppercase first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg"
//                     >
//                       {header.column.getCanSort() ? (
//                         <div
//                           className="flex cursor-pointer items-center space-x-3 select-none"
//                           onClick={header.column.getToggleSortingHandler()}
//                         >
//                           <span className="flex-1">
//                             {header.isPlaceholder
//                               ? null
//                               : flexRender(
//                                   header.column.columnDef.header,
//                                   header.getContext(),
//                                 )}
//                           </span>
//                           <TableSortIcon sorted={header.column.getIsSorted()} />
//                         </div>
//                       ) : header.isPlaceholder ? null : (
//                         flexRender(
//                           header.column.columnDef.header,
//                           header.getContext(),
//                         )
//                       )}
//                     </Th>
//                   ))}
//                 </Tr>
//               ))}
//             </THead>
//             <TBody>
//               {table.getRowModel().rows.map((row) => {
//                 return (
//                   <Tr
//                     key={row.id}
//                     className={clsx(
//                       "dark:border-b-dark-500 relative border-y border-transparent border-b-gray-200",
//                       row.getIsSelected() &&
//                         !isSafari &&
//                         "row-selected after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500 after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent",
//                     )}
//                   >
//                     {row.getVisibleCells().map((cell) => {
//                       return (
//                         <Td key={cell.id}>
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext(),
//                           )}
//                         </Td>
//                       );
//                     })}
//                   </Tr>
//                 );
//               })}
//             </TBody>
//           </Table>
//         </div>
//         {table.getCoreRowModel().rows.length > 0 && (
//           <div className="p-4 sm:p-5">
//             <PaginationSection table={table} />
//           </div>
//         )}
//         <SelectedRowsActions table={table} height={theadHeight} />
//       </Card>
//     </div>
//   );
// }


import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

// Import Dependencies
import { CollapsibleSearch } from "components/shared/CollapsibleSearch";
import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { SelectedRowsActions } from "components/shared/table/SelectedRowsActions";
import { useBoxSize, useDidUpdate } from "hooks";
import { MenuAction } from "./MenuActions";
import { columns } from "./columns";
import { PaginationSection } from "./PaginationSection";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { getProductsPaginated } from "utils/API/Authapi";

const isSafari = getUserAgentBrowser() === "Safari";

export function ProductsTable() {
  const [dataList, setDataList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25); 
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const theadRef = useRef();
  const { height: theadHeight } = useBoxSize({ ref: theadRef });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const GetAPI = async (pageNo = 1, pageLimit = limit) => {
    try {
      const res = await getProductsPaginated({ page: pageNo, limit: pageLimit, allPages: false });

      if (res?.success) {
        setDataList(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotal(res.total || 0);
        setPage(res.currentPage || 1);
      } else {
        setDataList([]);
      }
    } catch (error) {
      console.error("GetAPI error:", error.message || error);
      setDataList([]);
    }
  };

  useEffect(() => {
    GetAPI(page, limit);
  }, [page, limit]);

  const table = useReactTable({
    data: dataList,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getRowId: (row) => row._id ?? row.product_id,
    meta: {
      deleteRow: (row) => {
        const id = row.original._id ?? row.original.product_id;
        setDataList((old) => old.filter((oldRow) => (oldRow._id ?? oldRow.product_id) !== id));
      },
      deleteRows: (rows) => {
        const ids = rows.map((r) => r.original._id ?? r.original.product_id);
        setDataList((old) => old.filter((r) => !ids.includes(r._id ?? r.product_id)));
      },
    },
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true, // ✅ backend pagination
    pageCount: totalPages,
  });

  useDidUpdate(() => table.resetRowSelection(), [dataList]);

  return (
    <div className="col-span-12 flex flex-col lg:col-span-8 xl:col-span-9">
      <div className="table-toolbar flex items-center justify-between">
        <h2 className="dark:text-dark-100 truncate text-base font-medium tracking-wide text-gray-800">
          Products List
        </h2>
        <div className="flex">
          <CollapsibleSearch
            placeholder="Search here..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <MenuAction />
        </div>
      </div>

      <Card className="relative mt-3 flex grow flex-col">
        <div className="table-wrapper min-w-full grow overflow-x-auto">
          <Table
            hoverable
            className="w-full min-w-[600px] text-left rtl:text-right"
          >
            <THead ref={theadRef}>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      className="dark:bg-dark-800 dark:text-dark-100 bg-gray-200 font-semibold text-gray-800 uppercase first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg"
                    >
                      {header.column.getCanSort() ? (
                        <div
                          className="flex cursor-pointer items-center space-x-3 select-none"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className="flex-1">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </span>
                          <TableSortIcon sorted={header.column.getIsSorted()} />
                        </div>
                      ) : header.isPlaceholder ? null : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </THead>
            <TBody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}
                  className={clsx(
                    "dark:border-b-dark-500 relative border-y border-transparent border-b-gray-200",
                    row.getIsSelected() &&
                      !isSafari &&
                      "row-selected after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500 after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>

        {table.getCoreRowModel().rows.length > 0 && (
          <div className="p-4 sm:p-5">
            <PaginationSection
              table={table}
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </div>
        )}

        <SelectedRowsActions table={table} height={theadHeight} />
      </Card>
    </div>
  );
}
