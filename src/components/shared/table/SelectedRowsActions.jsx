import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import {
  ArrowUpTrayIcon,
  ArrowUturnLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import Select from "react-select";
import { getMyProductCategories } from "utils/API/Authapi";
import { toast } from "react-toastify";

// Local Imports
import { Button, GhostSpinner } from "components/ui";
import { selectCurrentUser } from "app/store/features/authSlice";
import {
  downloadProductsCSV,
  bulkUpdateProducts,
  deleteMultipleProducts,
} from "utils/API/Authapi";

export function SelectedRowsActions({ table, height }) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingCategory, setPendingCategory] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const selectedRows = table.getSelectedRowModel().rows;

  const user = useSelector(selectCurrentUser);
  const businessId = user?._id || "";

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyProductCategories();
        setCategories(
          data.map((cat) => ({
            value: cat._id,
            label: cat.name,
          })),
        );
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    })();
  }, []);

  const handleDeleteRows = () => {
    if (selectedRows.length > 0) {
      setIsDeleteModalOpen(true); // open confirmation modal
    }
  };
  const confirmDelete = async () => {
    setDeleteLoading(true);
    const productIds = selectedRows.map((r) => r.original._id);

    try {
      console.log(productIds);
      await deleteMultipleProducts(productIds);
      table.options.meta?.deleteRows(selectedRows);
      toast.success("All products deleted successfully.");
    } catch (err) {
      console.error(" Bulk delete failed:", err.message);
      toast.error(err?.response?.data?.message || "Failed to delete products.");
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };
  const handleConfirmCategoryChange = async () => {
    if (!pendingCategory) return;
    setConfirmLoading(true);

    const productIds = selectedRows.map((r) => r.original._id);
    const categoryId = pendingCategory.value;
    const category = pendingCategory.label;

    const payload = { categoryId, productIds, category };
    console.log("Payload to send:", payload);

    try {
      const updatedProducts = await bulkUpdateProducts(payload);
      console.log("✅ Bulk update success:", updatedProducts);
      setSelectedCategories(pendingCategory);
      setTimeout(() => window.location.reload(), 200);
      toast.success("Products category updated successfully.");
    } catch (error) {
      console.error("❌ Bulk update failed:", error.message);
      toast.error(error?.response?.data?.message || "Category update failed!");
    } finally {
      setIsModalOpen(false);
      setPendingCategory(null);
      setConfirmLoading(false);
    }
  };
  const handleCategoryChange = (selectedOption) => {
    setPendingCategory(selectedOption);
    setIsModalOpen(true);
  };

  const handleExportCSV = async () => {
    if (selectedRows.length <= 0) return;
    try {
      setExportLoading(true);
      const productIds = selectedRows.map((r) => r.original._id);
      console.log("Export CSV Payload:", {
        businessId,
        productIds,
      });
      await downloadProductsCSV(businessId, productIds);
    } catch (error) {
      console.error("Export CSV failed:", error.message);
    } finally {
      setExportLoading(false);
    }
  };

  if (!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()) {
    return null;
  }

  return (
    <div
      className="dark:bg-dark-100 dark:text-dark-900 absolute top-0 w-full rounded-t-lg bg-gray-800 text-gray-100"
      style={{ height }}
    >
      <div className="flex h-full items-center justify-between rounded-t-lg px-4 sm:px-5">
        <p className="font-medium">
          <span>{selectedRows.length} Selected</span>
          <span className="max-sm:hidden">
            {" "}
            from {table.getCoreRowModel().rows.length}
          </span>
        </p>
        <div className="flex space-x-1.5">
          <Button
            onClick={() => table.resetRowSelection()}
            className="text-xs-plus w-7 space-x-1.5 rounded-full px-3 py-1.5 sm:w-auto sm:rounded-sm"
          >
            <ArrowUturnLeftIcon className="size-3.5 shrink-0" />
            <span className="max-sm:hidden">Cancel</span>
          </Button>
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              minWidth: "180px",
              boxSizing: "border-box",
            }}
          >
            <Select
              className="text-dark-900"
              options={categories}
              value={selectedCategories}
              onChange={handleCategoryChange}
              placeholder="Select Category"
              styles={{
                container: (base) => ({
                  ...base,
                  width: "100%",
                }),
              }}
            />
          </div>
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton
              as={Button}
              className="text-xs-plus w-7 space-x-1.5 rounded-full px-3 py-1.5 sm:w-auto sm:rounded-sm"
            >
              <EllipsisHorizontalIcon className="size-4 shrink-0" />
              <span className="p-1 max-sm:hidden">MORE</span>
            </MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
            >
              <MenuItems className="text-xs-plus shadow-soft dark:border-dark-500 dark:bg-dark-750 dark:text-dark-200 absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 text-gray-600 outline-hidden focus-visible:outline-hidden ltr:right-0 rtl:left-0 dark:shadow-none">
                <MenuItem>
                  {({ focus }) => (
                    <>
                      <button
                        onClick={handleExportCSV}
                        disabled={exportLoading}
                        className={clsx(
                          "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors",
                          focus &&
                            "dark:bg-dark-600 dark:text-dark-100 bg-gray-100 text-gray-800",
                        )}
                      >
                        {exportLoading ? (
                          <GhostSpinner
                            className="size-4 shrink-0 border-2"
                            variant="soft"
                          />
                        ) : (
                          <ArrowUpTrayIcon className="size-4.5" />
                        )}
                        <span>Export CSV</span>
                      </button>
                      <button
                        onClick={handleDeleteRows}
                        disabled={deleteLoading || selectedRows.length <= 0}
                        className={clsx(
                          "flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-red-600 outline-hidden transition-colors",
                          "hover:bg-red-50 hover:text-red-700",
                          deleteLoading && "cursor-not-allowed opacity-60",
                        )}
                      >
                        {deleteLoading ? (
                          <GhostSpinner
                            className="size-4 shrink-0 border-2"
                            variant="soft"
                          />
                        ) : (
                          <TrashIcon className="size-4 shrink-0" />
                        )}
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </div>
      {isModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px]">
          <div className="dark:bg-dark-800 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Are you sure you want to change product category to:
            </h2>

            <p className="mb-4 text-gray-800 dark:text-gray-200">
              {pendingCategory?.label}
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                color="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setPendingCategory(null);
                }}
              >
                Cancel
              </Button>
              +{" "}
              <Button
                color="primary"
                onClick={handleConfirmCategoryChange}
                disabled={confirmLoading}
              >
                {confirmLoading ? "Working..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px]">
          <div className="dark:bg-dark-800 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Are you sure you want to delete the selected products?
            </h2>
            <div className="flex justify-end space-x-3">
              <Button
                color="secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                color="error"
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

SelectedRowsActions.propTypes = {
  table: PropTypes.object,
  height: PropTypes.number,
};
