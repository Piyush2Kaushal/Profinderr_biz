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
  columnHelper.display({
    id: "select",
    header: SelectHeader,
    cell: SelectCell,
  }),
  columnHelper.accessor((row) => `${row.productName} ${row.productCode}`, {
    id: "name",
    header: "Product Name",
    cell: NameCell,
  }),
  columnHelper.accessor((row) => row.category, {
    id: "category",
    header: "Category",
    cell: CategoryCell,
  }),
  columnHelper.accessor((row) => row.brand, {
    id: "brand",
    header: "Brand",
    cell: BrandCell,
  }),
  columnHelper.accessor((row) => row.price, {
    id: "price",
    header: "Price",
    cell: PriceCell,
  }),
  columnHelper.accessor((row) => row.quantity, {
    id: "stock_count",
    header: "Availability",
    cell: StockCell,
  }),
  columnHelper.display({
    id: "actions",
    header: "Action",
    cell: RowActions,
  }),
];
