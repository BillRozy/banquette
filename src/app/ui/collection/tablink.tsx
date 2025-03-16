"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren, useMemo } from "react";
import { Link } from "@/i18n/routing";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "../../../components/ui/navigation-menu";

export default function MainTabLink({
  children,
  href,
}: PropsWithChildren & { href: string }) {
  const pathname = usePathname();
  const selected = useMemo(() => {
    return pathname.includes(href.toString());
  }, [href, pathname]);
  return (
    <NavigationMenuItem>
      <div className={`p-4 ${selected ? "underline underline-offset-4" : ""}`}>
        <Link href={href} legacyBehavior passHref>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            {children}
          </NavigationMenuLink>
        </Link>
      </div>
    </NavigationMenuItem>
  );
}
