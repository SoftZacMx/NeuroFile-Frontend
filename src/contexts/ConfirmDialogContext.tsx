import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ConfirmDialogOptions {
  /** Dialog title (e.g. "Confirmar eliminación") */
  title?: string;
  /** Body message (e.g. "¿Eliminar a Juan Pérez?") */
  message: string;
  /** Label for the confirm button (default: "Confirmar") */
  confirmLabel?: string;
  /** Label for the cancel button (default: "Cancelar") */
  cancelLabel?: string;
  /** Use danger variant for confirm button (e.g. delete actions) */
  variant?: "default" | "destructive";
}

type ConfirmDialogContextValue = (options: ConfirmDialogOptions) => Promise<boolean>;

const ConfirmDialogContext = createContext<ConfirmDialogContextValue | null>(null);

const defaultOptions: Required<Omit<ConfirmDialogOptions, "message">> = {
  title: "Confirmar",
  confirmLabel: "Confirmar",
  cancelLabel: "Cancelar",
  variant: "default",
};

type Resolver = (value: boolean) => void;

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions>({ message: "" });
  const resolveRef = useRef<{ resolve: Resolver | null }>({ resolve: null });

  const confirmDialog = useCallback<ConfirmDialogContextValue>((opts) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current.resolve = resolve;
      setOptions(opts);
      setOpen(true);
    });
  }, []);

  const close = useCallback((result: boolean) => {
    setOpen(false);
    resolveRef.current.resolve?.(result);
    resolveRef.current.resolve = null;
  }, []);

  const handleConfirm = useCallback(() => close(true), [close]);
  const handleCancel = useCallback(() => close(false), [close]);

  const merged = { ...defaultOptions, ...options };
  const isDestructive = merged.variant === "destructive";

  return (
    <ConfirmDialogContext.Provider value={confirmDialog}>
      {children}
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
        <DialogPortal>
          <DialogOverlay>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>{merged.title}</DialogTitle>
                <DialogDescription>{merged.message}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  {merged.cancelLabel}
                </Button>
                <Button
                  type="button"
                  variant={isDestructive ? "destructive" : "default"}
                  onClick={handleConfirm}
                >
                  {merged.confirmLabel}
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogOverlay>
        </DialogPortal>
      </Dialog>
    </ConfirmDialogContext.Provider>
  );
}

export function useConfirmDialog(): ConfirmDialogContextValue {
  const ctx = useContext(ConfirmDialogContext);
  if (!ctx) throw new Error("useConfirmDialog must be used within ConfirmDialogProvider");
  return ctx;
}
