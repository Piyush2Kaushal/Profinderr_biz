// Import Dependencies
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

// Local Imports
import { Badge, Button, Input, Radio } from "components/ui";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { useFuse } from "hooks";
import { ResponsiveFilter } from "./ResponsiveFilter";
import { compareArrays } from "utils/compareArrays";

// ----------------------------------------------------------------------

export function RadioFilter({ column, options, title, Icon }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => column?.setFilterValue(undefined), []);

  const selectedValue = column?.getFilterValue() || [];
  const selectedItem = options.find(({ value }) =>
    compareArrays(value, selectedValue),
  );

  return (
    <ResponsiveFilter
      buttonContent={
        <>
          {Icon && <Icon className="size-4" />}
          <span> {title} </span>
          {selectedItem && (
            <>
              <div className="dark:bg-dark-450 h-full w-px bg-gray-300" />
              <Badge>{selectedItem.label}</Badge>
            </>
          )}
        </>
      }
    >
      <Content {...{ column, title, options }} />
    </ResponsiveFilter>
  );
}

function Content({ column, title, options }) {
  const inputRef = useRef();
  const { smAndDown } = useBreakpointsContext();

  const {
    result: filteredItems,
    query,
    setQuery,
  } = useFuse(options, {
    keys: ["label"],
    threshold: 0.2,
    matchAllOnEmptyQuery: true,
  });

  const selectedValue = column?.getFilterValue() || [];

  useEffect(() => {
    !smAndDown && inputRef.current.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Combobox
      value={options.find((item) => item.value === selectedValue) || null}
      onChange={(item) => {
        if (item) column.setFilterValue(item?.value);
      }}
    >
      <div className="relative">
        <div className="dark:bg-dark-900 relative bg-gray-100 py-1">
          <ComboboxInput
            as={Input}
            className="border-none"
            ref={inputRef}
            autoComplete="new"
            placeholder={title}
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
                  <div className="flex min-w-0 items-center space-x-2">
                    <Radio checked={selected} readOnly />
                    <span className="text-xs-plus block truncate">
                      {item.label}
                    </span>
                  </div>
                )}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
        {selectedValue?.length > 0 && (
          <Button
            onClick={() => column?.setFilterValue(undefined)}
            className="w-full rounded-none"
          >
            Clear Filter
          </Button>
        )}
      </div>
    </Combobox>
  );
}

RadioFilter.propTypes = {
  column: PropTypes.object,
  options: PropTypes.array,
  title: PropTypes.string,
  Icon: PropTypes.elementType,
};

Content.propTypes = {
  column: PropTypes.object,
  options: PropTypes.array,
  title: PropTypes.string,
  Icon: PropTypes.elementType,
};
