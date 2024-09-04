import * as DialogPrimitive from '@radix-ui/react-dialog';
import { createContext, useContext } from 'react';
import { twMerge } from 'tailwind-merge';
import { CloseIcon } from './Icons';

const LockedModalContext = createContext({} as { locked: boolean });
const useLockedModal = () => useContext(LockedModalContext);

function Modal(props: DialogPrimitive.DialogProps & { locked?: boolean }) {
  const locked = Boolean(props.locked);
  const onOpenChange = (open: boolean) => {
    if (locked) return;
    props.onOpenChange?.(open);
  };
  return (
    <LockedModalContext.Provider value={{ locked }}>
      <DialogPrimitive.Root {...props} onOpenChange={onOpenChange} open={locked || props.open} />
    </LockedModalContext.Provider>
  );
}

function Content({
  className,
  children,
  title,
  ...props
}: Omit<DialogPrimitive.DialogContentProps, 'title'> & {
  title: React.ReactNode;
}) {
  const { locked } = useLockedModal();

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[2px] data-[state=open]:animate-modal-overlay-show" />
      <DialogPrimitive.Content
        className={twMerge(
          '-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50',
          'w-[min(100%,90vw)] min-w-[min(400px,90vw)] max-w-[500px]',
          'overflow-auto rounded border border-gray-200 bg-white shadow-lg',
          'data-[state=open]:animate-modal-content-show',
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-x-4 border-gray-200 border-b p-5">
          <DialogPrimitive.Title asChild>
            <h2 className="flex-1">{title}</h2>
          </DialogPrimitive.Title>

          {!locked && (
            <DialogPrimitive.Close asChild>
              <button type="button">
                <CloseIcon className="mx-auto size-5 text-gray-800" />
              </button>
            </DialogPrimitive.Close>
          )}
        </div>

        <div className="max-h-[calc(100vh-80px)] overflow-y-auto p-4">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function Trigger(props: DialogPrimitive.DialogTriggerProps) {
  return <DialogPrimitive.Trigger asChild {...props} />;
}

Modal.Content = Content;
Modal.Trigger = Trigger;

export default Modal;
