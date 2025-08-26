// Import Dependencies
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

// Local Imports
import { Badge, Button, Checkbox, Input } from "components/ui";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { useFuse } from "hooks";
import { ResponsiveFilter } from "./ResponsiveFilter";

// ----------------------------------------------------------------------

export function FilterSelector({ table, options }) {
  const selectedFiltersLength = table?.getState()?.toolbarFilters?.length;

  return (
    <ResponsiveFilter
      buttonContent={
        <>
          <FunnelIcon className="size-4" />
          <span> Filter </span>

          {selectedFiltersLength > 0 && (
            <>
              <div className="dark:bg-dark-450 h-full w-px bg-gray-300" />
              <Badge>{selectedFiltersLength}</Badge>
            </>
          )}
        </>
      }
    >
      <Content
        {...{
          table,
          options,
        }}
      />
    </ResponsiveFilter>
  );
}

function Content({ table, options }) {
  const selectedValues = table?.getState()?.toolbarFilters || [];
  const inputRef = useRef();
  const { smAndUp } = useBreakpointsContext();

  const {
    result: filteredItems,
    query,
    setQuery,
  } = useFuse(options, {
    keys: ["label"],
    threshold: 0.2,
    matchAllOnEmptyQuery: true,
  });

  useEffect(() => {
    smAndUp && inputRef.current.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Combobox
      value={selectedValues.map((value) =>
        options.find((obj) => obj.value === value),
      )}
      onChange={(list) => {
        table?.options?.meta?.setToolbarFilters(list.map((item) => item.value));
      }}
      multiple
      className="sm:w-56"
    >
      <div className="relative">
        <div className="dark:bg-dark-900 relative bg-gray-100 py-1">
          <ComboboxInput
            as={Input}
            className="border-none"
            ref={inputRef}
            autoComplete="new"
            placeholder="Select Filters"
            displayValue={({ name }) => name}
            onChange={(event) => setQuery(event.target.value)}
            prefix={<MagnifyingGlassIcon className="size-4" />}
          />
        </div>

        <ComboboxOptions
          static
          className="max-h-72 w-full overflow-y-auto py-1 outline-hidden"
        >
          {filteredItems.length === 0 && query !== "" ? (
            <div className="dark:text-dark-100 relative cursor-default px-2.5 py-2 text-gray-800 select-none">
              Nothing found for {query}
            </div>
          ) : (
            filteredItems.map(({ item, refIndex }) => (
              <ComboboxOption
                key={refIndex}
                className={({ focus }) =>
                  clsx(
                    "dark:text-dark-100 relative cursor-pointer px-2.5 py-2 text-gray-800 outline-hidden transition-colors select-none",
                    focus && "dark:bg-dark-600 bg-gray-100",
                  )
                }
                value={item}
              >
                {({ selected }) => (
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex min-w-0 items-center space-x-2">
                      <Checkbox checked={selected} readOnly />
                      {item.icon && <item.icon className="size-4.5 stroke-1" />}

                      <span className="text-xs-plus block truncate">
                        {item.label}
                      </span>
                    </div>
                  </div>
                )}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
        {selectedValues?.length > 0 && (
          <Button
            onClick={() => table?.options?.meta?.setToolbarFilters([])}
            className="w-full rounded-none"
          >
            Clear Filter
          </Button>
        )}
      </div>
    </Combobox>
  );
}

FilterSelector.propTypes = {
  table: PropTypes.object,
  options: PropTypes.array,
};

Content.propTypes = {
  table: PropTypes.object,
  options: PropTypes.array,
};
