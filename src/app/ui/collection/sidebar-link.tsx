"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren, ReactNode, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { SidebarMenuButton } from "../../../components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function SidebarLink({
  href,
  title,
  icon,
  className,
}: PropsWithChildren & {
  href: string;
  title: string;
  icon?: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const selected = useMemo(() => {
    return pathname.includes(href.toString());
  }, [href, pathname]);
  return (
    <Link href={href}>
      <SidebarMenuButton tooltip={title}>
        {icon}
        <span
          className={cn(
            "p-4 uppercase",
            selected && "underline underline-offset-4",
            className
          )}
        >
          {title}
        </span>
      </SidebarMenuButton>
    </Link>
  );
}
