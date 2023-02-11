import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Fragment, ReactNode } from "react";

interface ModalProps {
  /**
   * callback when the dialog is closed
   */
  onClose: () => void;

  /**
   * whether the modal is open
   */
  open: boolean;
  /**
   * any content
   */
  children?: ReactNode;
  /**
   * title of the dialog
   */
  title?: string;
}

/**
 * Primary UI component for user interaction
 */

export default function Modal({
  open,
  title,
  children,
  onClose,
  ...props
}: ModalProps) {
  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 print:hidden"
          onClose={onClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-40"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  {...props}
                  className="w-full max-w-lg mt-4 text-left align-middle transition-all transform bg-white shadow-xl"
                >
                  <div className="overflow-hidden">
                    <div className="relative p-6 rounded">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl leading-6 text-gray-900"
                      >
                        {title}
                      </Dialog.Title>
                      {children}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="close"
                    className="absolute p-2 bg-white rounded-full right-1 top-1 "
                  >
                    <XMarkIcon className="w-8 h-8" />
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
