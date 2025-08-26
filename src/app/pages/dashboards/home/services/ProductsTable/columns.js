import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import {
  SelectCell,
  SelectHeader,
} from "components/shared/table/SelectCheckbox";
import { RowActions } from "./RowActions";
import {
  BrandCell,
  NameCell,
  PriceCell,
  StockCell,
  CategoryCell,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();
export const columns = [
  // columnHelper.display({
  //   id: "select",
  //   header: SelectHeader,
  //   cell: SelectCell,
  // }),
  columnHelper.accessor((row) => `${row.serviceName} ${row.product || ""}`, {
    id: "name",
    header: "Service Name",
    cell: NameCell,
  }),
  columnHelper.accessor((row) => row.category, {
    id: "category",
    header: "Category",
    cell: CategoryCell,
  }),
  columnHelper.accessor((row) => row.brandOrManufacturer, {
    id: "brand",
    header: "Brand / Manufacturer",
    cell: BrandCell,
  }),
  columnHelper.accessor((row) => row.servicePrice, {
    id: "price",
    header: "Price",
    cell: PriceCell,
  }),
  columnHelper.accessor((row) => row.availability, {
    id: "availability",
    header: "Availability",
    cell: StockCell,
  }),
  columnHelper.display({
    id: "actions",
    header: "Action",
    cell: RowActions,
  }),
];
