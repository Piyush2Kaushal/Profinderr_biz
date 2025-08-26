// Import Dependencies
import { CloudArrowUpIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { forwardRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import PropTypes from "prop-types";

// Local Imports
import { PreviewImg } from "components/shared/PreviewImg";
import { Button, InputErrorMsg, Upload } from "components/ui";

// ----------------------------------------------------------------------

const FILE_MAX_SIZE = 1 * 1024 * 1024; // 1MB

function validateFileSize(file) {
  if (file.size > FILE_MAX_SIZE) {
    return {
      code: "size-too-large",
      message: `File Size Is larger Than ${FILE_MAX_SIZE / 1024 / 1024} MB`,
    };
  }

  return null;
}

function showToast(file, errors) {
  toast(`File ${file.path} rejected`, {
    description: errors.map((error) => error.message).join(", "),
    descriptionClassName: "text-gray-600 dark:text-dark-200 text-xs mt-0.5",
  });
}

const GalleryImageUpload = forwardRef(
  ({ value: files, onChange, label, classNames, error }, ref) => {
    const { getRootProps, getInputProps, isDragReject, isDragAccept } =
      useDropzone({
        onDrop: useCallback(
          (acceptedFiles, fileRejections) => {
            fileRejections.forEach(({ file, errors }) =>
              showToast(file, errors),
            );
            onChange([...files, ...acceptedFiles]);
          },
          [onChange, files],
        ),
        accept: {
          "image/png": [".png"],
          "image/jpeg": [".jpeg"],
          "image/jpg": [".jpg"],
        },
        validator: validateFileSize,
      });

    const onRemove = (indices) =>
      onChange(files.filter((_, index) => indices !== index));

    return (
      <div className="flex flex-col">
        {label && <div className={classNames?.label}>{label}</div>}
        <div
          className={clsx(
            "w-full rounded-lg border-2 border-dashed border-current outline-hidden",
            !isDragAccept &&
              (isDragReject || error) &&
              "text-error dark:text-error-light",
            isDragAccept && "text-primary-600 dark:text-primary-500",
            !isDragReject &&
              !isDragAccept &&
              !error &&
              "dark:text-dark-450 text-gray-300",
            classNames?.box,
          )}
        >
          <Upload
            ref={ref}
            inputProps={{ ...getInputProps() }}
            {...getRootProps()}
          >
            {({ ...props }) => (
              <Button
                unstyled
                component="div"
                className="h-full w-full shrink-0 flex-col space-x-2 p-3"
                {...props}
              >
                <div className="flex flex-wrap gap-2 pb-2 ltr:mr-auto rtl:ml-auto">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      title={file.name}
                      onClick={(event) => event.stopPropagation()}
                      className="group ring-primary-600 dark:border-dark-450 dark:ring-primary-500 dark:ring-offset-dark-700 relative size-24 rounded-lg border border-gray-300 ring-offset-4 ring-offset-white transition-all hover:ring-3"
                    >
                      <div className="h-full w-full overflow-hidden p-1">
                        <PreviewImg
                          className="m-auto h-full object-contain"
                          file={file}
                          alt={file.name}
                        />
                      </div>

                      <div className="dark:bg-dark-700 absolute -top-4 -right-3 flex items-center justify-center rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          onClick={() => onRemove(i)}
                          className="dark:border-dark-450 size-6 shrink-0 rounded-full border p-0"
                        >
                          <XMarkIcon className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <CloudArrowUpIcon className="pointer-events-none size-12" />
                <span className="dark:text-dark-200 pointer-events-none mt-2 text-gray-600">
                  <span className="text-primary-600 dark:text-primary-400">
                    Browse
                  </span>
                  <span> or drop your files here</span>
                </span>
              </Button>
            )}
          </Upload>
        </div>
        <InputErrorMsg
          when={error && typeof error !== "boolean"}
          className={classNames?.error}
        >
          {error}
        </InputErrorMsg>
      </div>
    );
  },
);

GalleryImageUpload.displayName = "GalleryImageUpload";

GalleryImageUpload.propTypes = {
  value: PropTypes.array,
  id: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  classNames: PropTypes.object,
  label: PropTypes.node,
};

export { GalleryImageUpload };
