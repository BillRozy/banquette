"use client";
import React, { PropsWithChildren, ReactNode, useEffect, useRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import CloseDrawerButton from "./close-drawer-button";
import { usePathname, useRouter } from "@/i18n/routing";
import { X } from "lucide-react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
export default function BottomDrawer({
  header,
  buttonsSlot = [],
  children,
  description,
}: {
  header: string;
  buttonsSlot?: ReactNode;
  description?: string;
} & PropsWithChildren) {
  const { back } = useRouter();
  const pathname = usePathname();
  const initialRender = useRef(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [open, setOpen] = React.useState(true);
  const closeAndRedirect = () => {
    setOpen(false);
    setTimeout(back, 250);
  };
  // development only hack?? to prevent closing on initial render
  useEffect(() => {
    if (initialRender.current < 2) {
      initialRender.current += 1;
    } else {
      setOpen(false);
    }
  }, [pathname]);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={closeAndRedirect}>
        <DialogContent className="max-w-4xl overflow-hidden">
          <DialogHeader className="flex justify-center items-center">
            <DialogTitle>{header}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="p-4 max-w-4xl mx-auto w-full overflow-auto max-h-[75vh]">
            {children}
          </div>
          <DialogFooter>
            <div className="flex gap-4 justify-center">{buttonsSlot}</div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={closeAndRedirect}>
      <DrawerContent>
        <DrawerDescription>{description}</DrawerDescription>
        <div className="max-h-[80vh] overflow-auto">
          <DrawerHeader className="flex justify-center items-center mt-4 relative">
            <DrawerTitle className="text-center">{header}</DrawerTitle>
            <div className="absolute right-4">
              <CloseDrawerButton drawerOpenControl={setOpen}>
                <X size={64}></X>
              </CloseDrawerButton>
            </div>
          </DrawerHeader>
          <div className="p-4 max-w-4xl mx-auto w-full">{children}</div>
        </div>
        <DrawerFooter className="border-t-2">
          <div className="flex gap-4 justify-center">{buttonsSlot}</div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
