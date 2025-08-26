// // Import Dependencies
// import {
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuItems,
//   Transition,
// } from "@headlessui/react";
// import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
// import clsx from "clsx";
// import { Fragment, useCallback, useState } from "react";
// import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";

// // Local Imports
// import { ConfirmModal } from "components/shared/ConfirmModal";
// import { Button } from "components/ui";

// // ----------------------------------------------------------------------

// const confirmMessages = {
//   pending: {
//     description:
//       "Are you sure you want to delete this product? Once deleted, it cannot be restored.",
//   },
//   success: {
//     title: "Product Deleted",
//   },
// };

// export function RowActions({ row, table }) {
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
//   const [deleteSuccess, setDeleteSuccess] = useState(false);
//   const [deleteError, setDeleteError] = useState(false);
//   const navigate = useNavigate();

//   const closeModal = () => {
//     setDeleteModalOpen(false);
//   };

//   const openModal = () => {
//     setDeleteModalOpen(true);
//     setDeleteError(false);
//     setDeleteSuccess(false);
//   };

//   const handleDeleteRows = useCallback(() => {
//     setConfirmDeleteLoading(true);
//     setTimeout(() => {
//       table.options.meta?.deleteRow(row);
//       setDeleteSuccess(true);
//       setConfirmDeleteLoading(false);
//     }, 1000);
//   }, [row]);

//   const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

//   return (
//     <>
//       <div className="flex justify-start">
//         <Menu as="div" className="relative inline-block text-left">
//           <MenuButton
//             as={Button}
//             color="primary"
//             className="rounded-md px-3 py-1 text-sm font-medium"
//           >
//             Action
//           </MenuButton>

//           <Transition
//             as={Fragment}
//             enter="transition ease-out"
//             enterFrom="opacity-0 translate-y-2"
//             enterTo="opacity-100 translate-y-0"
//             leave="transition ease-in"
//             leaveFrom="opacity-100 translate-y-0"
//             leaveTo="opacity-0 translate-y-2"
//           >
//             <MenuItems className="dark:border-dark-500 dark:bg-dark-750 absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden ltr:right-0 rtl:left-0 dark:shadow-none">
//               <MenuItem>
//                 {({ focus }) => (
//                   <button
//                     onClick={() =>
//                       navigate(`/dashboards/products/View/${row.original._id}`)
//                     }
//                     className={clsx(
//                       "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors",
//                       focus &&
//                         "dark:bg-dark-600 dark:text-dark-100 bg-gray-100 text-gray-800",
//                     )}
//                   >
//                     <EyeIcon className="size-4.5 stroke-1" />
//                     <span>View</span>
//                   </button>
//                 )}
//               </MenuItem>
//               <MenuItem>
//                 {({ focus }) => (
//                   <button
//                     onClick={() => navigate(`/dashboards/products/Edit/${row.original._id}`)}
//                     className={clsx(
//                       "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors",
//                       focus &&
//                         "dark:bg-dark-600 dark:text-dark-100 bg-gray-100 text-gray-800",
//                     )}
//                   >
//                     <PencilIcon className="size-4.5 stroke-1" />
//                     <span>Edit</span>
//                   </button>
//                 )}
//               </MenuItem>
//               <MenuItem>
//                 {({ focus }) => (
//                   <button
//                     onClick={openModal}
//                     className={clsx(
//                       "this:error text-this dark:text-this-light flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors",
//                       focus && "bg-this/10 dark:bg-this-light/10",
//                     )}
//                   >
//                     <TrashIcon className="size-4.5 stroke-1" />
//                     <span>Delete</span>
//                   </button>
//                 )}
//               </MenuItem>
//             </MenuItems>
//           </Transition>
//         </Menu>
//       </div>

//       <ConfirmModal
//         show={deleteModalOpen}
//         onClose={closeModal}
//         messages={confirmMessages}
//         onOk={handleDeleteRows}
//         confirmLoading={confirmDeleteLoading}
//         state={state}
//       />
//     </>
//   );
// }

// RowActions.propTypes = {
//   table: PropTypes.object,
//   row: PropTypes.object,
// };

// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// Local Imports
import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";
import { deleteService } from "utils/API/Authapi";
import { toast } from "react-toastify";
// ----------------------------------------------------------------------

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to delete this service? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Service Deleted",
  },
};

export function RowActions({ row, table }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const navigate = useNavigate();

  const closeModal = () => {
    setDeleteModalOpen(false);
  };

  const openModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const handleDeleteRows = useCallback(async () => {
    try {
      setConfirmDeleteLoading(true);

      await deleteService(row.original._id ?? row.original.product_id);

      table.options.meta?.deleteRow(row);

      setDeleteSuccess(true);
      toast.success("Product deleted successfully");
    } catch (error) {
      setDeleteError(true);
      toast.error(error.message || "Failed to delete product");
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, [row, table]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex justify-start">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton
            as={Button}
            color="primary"
            className="rounded-md px-3 py-1 text-sm font-medium"
          >
            Action
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
            <MenuItems className="dark:border-dark-500 dark:bg-dark-750 absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden ltr:right-0 rtl:left-0 dark:shadow-none">
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() =>
                      navigate(`/dashboards/service/view/${row.original._id}`)
                    }
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors",
                      focus &&
                        "dark:bg-dark-600 dark:text-dark-100 bg-gray-100 text-gray-800",
                    )}
                  >
                    <EyeIcon className="size-4.5 stroke-1" />
                    <span>View</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={() =>
                      navigate(`/dashboards/Service/Edit/${row.original._id}`)
                    }
                    className={clsx(
                      "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors",
                      focus &&
                        "dark:bg-dark-600 dark:text-dark-100 bg-gray-100 text-gray-800",
                    )}
                  >
                    <PencilIcon className="size-4.5 stroke-1" />
                    <span>Edit</span>
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={openModal}
                    className={clsx(
                      "text-error dark:text-error-light flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors",
                      focus && "bg-this/10 dark:bg-this-light/10",
                    )}
                  >
                    <TrashIcon className="size-4.5 stroke-1" />
                    <span>Delete</span>
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>

      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleDeleteRows}
        confirmLoading={confirmDeleteLoading}
        state={state}
      />
    </>
  );
}

RowActions.propTypes = {
  table: PropTypes.object,
  row: PropTypes.object,
};
