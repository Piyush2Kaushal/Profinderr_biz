// Import Dependencies
import { ArrowUpIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { formatNumber } from "utils/formatNumber";

export function PriceCell({ getValue }) {
  return <span className="font-semibold">{getValue()}</span>;
}

export function NameCell({ row }) {
  return (
    <div className="flex min-w-[150px] flex-wrap items-center gap-3">
      <div className="size-9 flex-shrink-0">
        <img
          className="h-full w-full rounded-lg object-cover object-center"
          src={row.original.image}
          alt={row.original.serviceName}
        />
      </div>
      <div className="min-w-0">
        <p className="dark:text-dark-100 max-w-[140px] truncate font-medium text-gray-800 sm:max-w-[200px]">
          {row.original.serviceName}
        </p>
      </div>
    </div>
  );
}

export function CategoryCell({ row }) {
  return (
    <div className="min-w-0">
      <p className="dark:text-dark-100 max-w-[140px] truncate font-medium text-gray-800 sm:max-w-[200px]">
        {row.original.category}
      </p>
    </div>
  );
}
export function BrandCell({ row }) {
  return (
    <div className="flex size-9 min-w-[80px] items-center justify-center whitespace-normal">
      {row.original.brandOrManufacturer}
    </div>
  );
}

export function StockCell({ row }) {
  return (
    <>
      <span className="font-medium">
        {row.original.availability || "Unknown"}
      </span>
      {row.original.serviceTime && (
        <p className="dark:text-dark-300 text-xs text-gray-400">
          {row.original.serviceTime} service time
        </p>
      )}
    </>
  );
}

export function ViewCell({ row, getValue }) {
  return (
    <>
      <p className="font-semibold">{formatNumber(getValue())}</p>
      <div
        className={clsx(
          "flex items-center space-x-0.5 text-xs leading-normal",
          row.original.viewCount > 0
            ? "text-success dark:text-success-lighter"
            : "text-error dark:text-error-light",
        )}
      >
        <ArrowUpIcon
          className={clsx(
            "size-3.5",
            row.original.viewCount < 0 && "rotate-180",
          )}
        />
        <span>{(Math.abs(row.original.viewCount) * 100).toFixed(2)}%</span>
      </div>
    </>
  );
}

NameCell.propTypes = {
  row: PropTypes.object,
};

BrandCell.propTypes = {
  row: PropTypes.object,
};

PriceCell.propTypes = {
  getValue: PropTypes.func,
};

StockCell.propTypes = {
  row: PropTypes.object,
};

ViewCell.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
};
CategoryCell.propTypes = {
  row: PropTypes.object,
};
