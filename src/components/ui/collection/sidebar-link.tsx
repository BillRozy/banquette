"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren, ReactNode, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { SidebarMenuButton } from "../sidebar";
import { LucideIcon } from "lucide-react";

export default function SidebarLink({
  children,
  href,
  title,
  icon,
}: PropsWithChildren & { href: string; title: string; icon: ReactNode }) {
  const pathname = usePathname();
  const selected = useMemo(() => {
    return pathname.includes(href.toString());
  }, [href, pathname]);
  return (
    <Link href={href}>
      <SidebarMenuButton tooltip={title}>
        {icon}
        <span
          className={`p-4 ${selected ? "underline underline-offset-4" : ""}`}
        >
          {title}
        </span>
      </SidebarMenuButton>
    </Link>
  );
}
