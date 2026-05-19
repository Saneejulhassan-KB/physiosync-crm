import { useUIStore } from "@/stores/uiStore";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Sidebar } from "./Sidebar";

export function MobileSidebar() {
  const { mobileOpen, closeMobile } = useUIStore();

  return (
    <Dialog.Root
      open={mobileOpen}
      onOpenChange={(open) => !open && closeMobile()}
    >
      <Dialog.Portal>
        <AnimatePresence>
          {mobileOpen && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden"
                  aria-describedby={undefined}
                >
                  <Dialog.Title className="sr-only">
                    Navigation Menu
                  </Dialog.Title>
                  <Sidebar onClose={closeMobile} />
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      data-ocid="mobile_sidebar.close_button"
                      className="absolute top-4 right-4 p-1 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                      aria-label="Close navigation"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Dialog.Close>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
