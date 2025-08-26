// Local Imports
import { Page } from "components/shared/Page";
import { ProductsTable } from "./ProductsTable";

// ----------------------------------------------------------------------

export default function list() {
  return (
    <Page title="Product List">
      <div className="transition-content overflow-hidden px-3 pb-8">
        {" "}
        {/* Removed px-(--margin-x) */}
        <div className="mt-4 w-full">
          {" "}
          {/* Removed grid structure and just made full width */}
          <ProductsTable />
        </div>
      </div>
    </Page>
  );
}
