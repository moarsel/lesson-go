import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type FieldType = { label: string; value: string | number };
interface DropDownProps<T> {
  value: Array<FieldType>;
  values: Array<FieldType>;
  setValue: (value: T) => void;
}

export default function DropDown<T>({
  value,
  values,
  setValue,
}: DropDownProps<T>) {
  const columnSize = Math.ceil(values.length / 2);
  const [leftColumn, rightColumn] = [
    values.slice(0, columnSize),
    values.slice(columnSize, values.length),
  ];
  return (
    <Listbox multiple onChange={setValue}>
      <div className="relative block w-full text-left">
        <Listbox.Button className="inline-flex items-center justify-between w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black">
          <>
            <span>{value?.map((v) => v.label).join(", ") || " "}</span>
            <ChevronUpIcon
              className="hidden w-5 h-8 ml-2 -mr-1 shrink-0 ui-open:block"
              aria-hidden="true"
            />
            <ChevronDownIcon
              className="w-5 h-8 ml-2 -mr-1 shrink-0 ui-open:hidden"
              aria-hidden="true"
            />
          </>
        </Listbox.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Listbox.Options
          className="absolute left-0 z-10 px-2 pt-1 mt-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          key={`${value}`}
        >
          <div className="flex flex-row max-w-sm gap-3">
            <div className="w-max">
              {leftColumn.map((valueItem) => (
                <Listbox.Option key={`${valueItem.value}`} value={valueItem}>
                  {({ active }) => (
                    <div
                      className={classNames(
                        " hover:bg-gray-200 px-3 py-2 transition-colors my-1 text-sm rounded-lg w-full text-left flex items-center space-x-2 justify-between cursor-pointer",
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        value.some((v) => v.value === valueItem.value)
                          ? "bg-gray-200 font-bold"
                          : ""
                      )}
                    >
                      <span className="flex items-center justify-between w-full px-4 py-1 text-sm text-left">{`${valueItem.label}`}</span>
                      {value.some((v) => v.value === valueItem.value) ? (
                        <CheckIcon className="w-8 h-8" />
                      ) : null}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </div>
            <div className="w-max">
              {rightColumn.map((valueItem) => (
                <Listbox.Option key={`${valueItem.value}`} value={valueItem}>
                  {({ active }) => (
                    <div
                      className={classNames(
                        " hover:bg-gray-200 px-3 py-2 transition-colors my-1 text-sm rounded-md w-full text-left flex items-center space-x-2 justify-between cursor-pointer",
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        value.some((v) => v.value === valueItem.value)
                          ? "bg-gray-200 font-bold"
                          : ""
                      )}
                    >
                      <span className="flex items-center justify-between w-full px-4 py-1 text-sm text-left">{`${valueItem.label}`}</span>
                      {value.some((v) => v.value === valueItem.value) ? (
                        <CheckIcon className="w-8 h-8" />
                      ) : null}
                    </div>
                    // </button>
                  )}
                </Listbox.Option>
              ))}
            </div>
          </div>
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
}
