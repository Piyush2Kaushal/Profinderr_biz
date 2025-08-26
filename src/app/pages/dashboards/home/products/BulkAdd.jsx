import { useState, useCallback } from "react";
import clsx from "clsx";
import { useDropzone } from "react-dropzone";
import {
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Page } from "components/shared/Page";
import { Card, Button, Upload } from "components/ui";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

import {
  uploadShopifyBulkData,
  uploadNormalCSV,
  uploadWordPressBulkData,
} from "utils/API/Authapi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "app/store/features/authSlice";

function bytesToReadable(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function CsvDropzoneCard({ title, helper, uploaderFn, cta = "Upload" }) {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const user = useSelector(selectCurrentUser);
  const newBusinessId = user?._id || "error";

  const onDrop = useCallback((accepted) => {
    if (!accepted?.length) return;
    const f = accepted[0];
    if (!f.name.toLowerCase().endsWith(".csv")) {
      toast.error("Only .csv files are allowed");
      return;
    }
    setFile(f);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "text/csv": [".csv"] },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const removeFile = () => {
    setFile(null);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return toast.warn("Please select a .csv file first.");

    try {
      setUploading(true);
      setProgress(0);
      console.log("Uploading CSV with data:", {
        file: file.name,
        newBusinessId,
      });

      const response = await uploaderFn(file, newBusinessId);

      setProgress(100);
      toast.success(response?.message || "Upload completed successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-5">
      <h3 className="dark:text-dark-50 text-lg font-semibold text-gray-900">
        {title}
      </h3>
      <div className="flex justify-end mt-4">
  <a
    href="/CSV/sample1.csv"
    download="sample_products.csv"
    className="flex items-center gap-2 rounded-md border border-green-200 bg-green-100 px-3 py-1 text-sm text-green-700 hover:bg-green-200 transition"
  >
    {/* Modern Download Icon */}
    <ArrowDownTrayIcon className="h-4 w-4" />

    {/* Text */}
    <span className="font-medium">Download Sample</span>
  </a>
</div>


      <p className="dark:text-dark-200 mt-1 text-xs text-gray-600">{helper}</p>

      <Upload inputProps={{ ...getInputProps() }} {...getRootProps()}>
        {(uploadTriggerProps) => (
          <Button
            {...uploadTriggerProps}
            unstyled
            className={clsx(
              "mt-3 w-full shrink-0 flex-col rounded-lg border-2 border-dashed py-10",
              isDragActive
                ? "border-primary-600 dark:border-primary-500"
                : "dark:border-dark-450 border-gray-300",
            )}
          >
            <CloudArrowUpIcon className="size-12" />
            <span
              className={clsx(
                "pointer-events-none mt-2",
                isDragActive
                  ? "text-primary-600 dark:text-primary-400"
                  : "dark:text-dark-200 text-gray-600",
              )}
            >
              <span className="text-primary-600 dark:text-primary-400">
                Browse
              </span>
              <span> or drop your .csv file here</span>
            </span>
          </Button>
        )}
      </Upload>

      {file && (
        <div className="dark:border-dark-450 mt-4 rounded-lg border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="dark:text-dark-100 text-sm font-medium text-gray-800">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {bytesToReadable(file.size)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {progress >= 100 ? (
                <CheckCircleIcon className="text-success-600 size-5" />
              ) : null}
              <Button
                size="sm"
                color="error"
                onClick={removeFile}
                disabled={uploading}
              >
                Remove
              </Button>
            </div>
          </div>

          {uploading || progress > 0 ? (
            <div className="mt-3">
              <div className="dark:bg-dark-500 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1 text-right text-xs text-gray-600">
                {progress}%
              </div>
            </div>
          ) : null}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <Button
          color="primary"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : cta}
        </Button>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <ExclamationTriangleIcon className="size-4" />
          <span>Accepted format: .csv only</span>
        </div>
      </div>
    </Card>
  );
}

export default function BulkCsvManagerPage() {
  return (
    <Page>
      <div className="p-6">
        <ToastContainer position="top-right" closeOnClick theme="light" />

        <div className="mb-6">
          <h1 className="dark:text-dark-50 text-2xl font-bold text-gray-900">
            Bulk Add Through CSV
          </h1>
          <p className="dark:text-dark-200 mt-1 text-sm text-gray-600">
            Upload your data in CSV format. Use the Shopify import for
            Shopify-formatted exports, or the normal CSV import for your
            standard template.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
          <CsvDropzoneCard
            title="Shopify Bulk Import"
            helper="Drag & drop or browse a .csv file exported from Shopify."
            uploaderFn={uploadShopifyBulkData}
            cta="Upload to Shopify Import"
          />

          <CsvDropzoneCard
            title="Normal CSV Import"
            helper="Use the standard CSV template to add bulk products."
            uploaderFn={uploadNormalCSV}
            cta="Upload to Normal Import"
          />
          <CsvDropzoneCard
            title="Wordpress Bulk Import"
            helper="Drag & drop or browse a .csv file exported from Shopify."
            uploaderFn={uploadWordPressBulkData}
            cta="Upload to wordpress Import"
          />
        </div>
      </div>
    </Page>
  );
}
