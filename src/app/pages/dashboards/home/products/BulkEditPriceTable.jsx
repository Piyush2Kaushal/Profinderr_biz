import React, { useEffect, useState } from "react";
import { getProductsPaginated } from "utils/API/Authapi";
import {
  Pagination,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
  Card,
  Button,
} from "components/ui";
import { Page } from "components/shared/Page";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchProducts = async () => {
    try {
      const res = await getProductsPaginated({ page, limit });
      setProducts(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleInputChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", products);
  };

  return (
    <Page title="Bulk Edit Products">
      <div className="transition-content w-full px-(--margin-x) py-8">
        <Card className="w-full overflow-x-auto">
          <table className="min-w-full table-fixed text-sm text-default dark:text-default-dark">
          <thead className="bg-gray-200 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
  <tr>
    {[
      "SL",
      "Product Name",
      "Price",
      "Min Qty",
      "Wholesale Price",
      "Min Qty",
      "Trade Price",
      "Min Qty",
    ].map((col, idx) => (
      <th
        key={idx}
        className="px-2 py-3 text-left text-sm font-bold  uppercase tracking-wider text-gray-700 dark:text-gray-300"
      >
        {col}
      </th>
    ))}
  </tr>
</thead>


            <tbody>
              {products.map((product, idx) => (
                <tr
                  key={product._id}
                  className="border-b last:border-none hover:bg-muted/10"
                >
                  <td className="px-3 py-2">
                    {(page - 1) * limit + idx + 1}
                  </td>

                  {/* Product Name */}
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2 max-w-[300px]">
                      <img
                        src={product.imageUrl || "/placeholder.png"}
                        alt={product.productName}
                        className="h-10 w-10 flex-shrink-0 rounded object-cover"
                      />
                      <span className="truncate font-medium">
                        {product.productName}
                      </span>
                    </div>
                  </td>

                  {/* Retail */}
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      className="w-full rounded border border-primary-600 px-2 py-1 text-sm dark:bg-gray-900 dark:text-white"
                      value={product.price || ""}
                      onChange={(e) =>
                        handleInputChange(product._id, "price", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      className="w-full rounded border border-primary-600 px-2 py-1 text-sm dark:bg-gray-900 dark:text-white"
                      value={product.minimumQuantity || ""}
                      onChange={(e) =>
                        handleInputChange(
                          product._id,
                          "minimumQuantity",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  {/* Wholesale */}
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      className="w-full rounded border border-primary-600 px-2 py-1 text-sm dark:bg-gray-900 dark:text-white"
                      value={product.price2 || ""}
                      onChange={(e) =>
                        handleInputChange(product._id, "price2", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      className="w-full rounded border border-primary-600 px-2 py-1 text-sm dark:bg-gray-900 dark:text-white"
                      value={product.minimumQuantity2 || ""}
                      onChange={(e) =>
                        handleInputChange(
                          product._id,
                          "minimumQuantity2",
                          e.target.value
                        )
                      }
                    />
                  </td>

                  {/* Trade */}
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      className="w-full rounded border border-primary-600 px-2 py-1 text-sm dark:bg-gray-900 dark:text-white"
                      value={product.price3 || ""}
                      onChange={(e) =>
                        handleInputChange(product._id, "price3", e.target.value)
                      }
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="number"
                      className="w-full rounded border border-primary-600 px-2 py-1 text-sm dark:bg-gray-900 dark:text-white"
                      value={product.minimumQuantity3 || ""}
                      onChange={(e) =>
                        handleInputChange(
                          product._id,
                          "minimumQuantity3",
                          e.target.value
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button color="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination total={totalPages} defaultValue={page} onChange={setPage}>
              <PaginationPrevious />
              <PaginationItems />
              <PaginationNext />
            </Pagination>
          </div>
        )}
      </div>
    </Page>
  );
};

export default ProductTable;
