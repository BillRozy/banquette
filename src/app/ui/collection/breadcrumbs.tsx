"use client";
import React, { PropsWithChildren, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import clsx from "clsx";
Link;

function BreadcrumbLocalizedLink({
  href,
  children,
}: { href: string } & PropsWithChildren) {
  return (
    <>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={href}>{children}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
    </>
  );
}

export default function Breadcrumbs() {
  const t = useTranslations("Links");
  const pathname = usePathname();

  const segments = useMemo(() => {
    return pathname.split("/").slice(1);
  }, [pathname]);

  const links = useMemo(() => {
    const _links = [];
    let href = "/";
    for (const segment of segments.slice(undefined, -1)) {
      href += segment;

      _links.push(
        <BreadcrumbLocalizedLink key={segment} href={href}>
          {t.has(segment) ? t(segment) : segment}
        </BreadcrumbLocalizedLink>
      );
    }
    return _links;
  }, [segments]);
  const lastLocalizedSegment = t.has(segments[segments.length - 1])
    ? t(segments[segments.length - 1])
    : segments[segments.length - 1];
  return (
    <Breadcrumb
      className={clsx(segments.length < 2 ? "opacity-0" : "opacity-100")}
    >
      <BreadcrumbList>
        {links}
        <BreadcrumbItem>
          <BreadcrumbPage>{lastLocalizedSegment}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
