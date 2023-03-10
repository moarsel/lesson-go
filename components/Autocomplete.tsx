// Headless ui autocomplete
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import React, { Fragment, useState } from "react";
import { MdClear } from "react-icons/md";

type AutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  items: string[];
};

const Autocomplete = ({ value, items, onChange }: AutocompleteProps) => {
  // const [selectedItem, setSelectedItem] = useState(value)
  const [query, setQuery] = useState(value);

  function handleChange(value: string) {
    setQuery(value);
    onChange(value);
  }

  const filteredList =
    query === ""
      ? items
      : items.filter((item) => {
          return item.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox value={query} onChange={handleChange}>
      <div className="relative block w-full">
        <Combobox.Button className="relative flex items-center w-full">
          <Combobox.Input
            className="inline-flex items-center justify-between w-full px-4 py-2 text-gray-700 bg-white border-gray-300 rounded-md shadow-sm form-input focus:border-black focus:ring-black"
            onChange={(event) => handleChange(event.target.value)}
          />
          {query && (
            <button
              aria-label="clear"
              className="absolute p-2 transition rounded-full right-1 bg-neutral-100 hover:bg-neutral-200 focus:bg-neutral-200"
              onClick={() => handleChange("")}
            >
              <MdClear />
            </button>
          )}
        </Combobox.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Combobox.Options className="absolute z-10 px-2 py-1 mt-1 overflow-y-auto bg-white rounded-md shadow-lg w-max max-h-64 ring-1 ring-black ring-opacity-5 focus:outline-none">
            {filteredList.map((item: string) => (
              <Combobox.Option
                key={item}
                value={item}
                className="flex items-center justify-between w-full px-3 py-2 my-1 space-x-2 text-sm text-left transition-colors rounded-lg cursor-pointer hover:bg-gray-200 ui-selected:bg-green-700 ui-active:bg-green-700 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"
              >
                {item}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default Autocomplete;
