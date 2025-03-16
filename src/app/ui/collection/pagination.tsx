"use client";
import React, { useEffect } from "react";
import {
  Pagination as PaginationShacn,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  PaginationProps,
  PaginationReturn,
  usePaginationLocal,
  usePaginationQuery,
} from "@/hooks/use-pagination";

type PaginationComponentProps = {
  totalElements: number;
  paginationOptions?: PaginationProps;
  minimal?: boolean;
};

function PurePagination({
  page,
  perPage,
  totalElements,
  setPage,
  minimal = false,
}: Omit<PaginationComponentProps, "paginationOptions"> & PaginationReturn) {
  const t = useTranslations("Components.Pagination");
  const pagesCount = Math.ceil(totalElements / perPage);
  const prevPage = page > 1 ? page - 1 : 1;
  const nextPage = page < pagesCount ? page + 1 : pagesCount;
  let numberedLinks = Array.from(
    { length: pagesCount },
    (_, i) => i + 1
  ).reduce((result, currentPage, index) => {
    if (
      Math.abs(page - currentPage) < (minimal ? 2 : 3) ||
      currentPage === 1 ||
      currentPage === pagesCount
    ) {
      result.push(currentPage);
    } else if (result[index - 1] !== "ellipsis" && result[index - 1] !== null) {
      result.push("ellipsis");
    } else {
      result.push(null);
    }
    return result;
  }, [] as Array<number | "ellipsis" | null>);
  const links = numberedLinks.map((link, index) => {
    if (link === "ellipsis") {
      return (
        <PaginationItem key={index}>
          <PaginationEllipsis>{t("more")}</PaginationEllipsis>
        </PaginationItem>
      );
    } else if (link == null) {
      return <div key={index} className="hidden"></div>;
    } else {
      return (
        <PaginationItem key={index}>
          <PaginationLink
            onClick={() => setPage(link)}
            isActive={link === page}
          >
            {link}
          </PaginationLink>
        </PaginationItem>
      );
    }
  });
  return (
    <div
      className={cn(
        "flex flex-col gap-2 items-center",
        perPage > totalElements && "hidden"
      )}
    >
      <PaginationShacn>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={cn(
                "cursor-pointer",
                page < 2 && "pointer-events-none opacity-60"
              )}
              onClick={() => setPage(prevPage)}
            >
              {!minimal && t("previous")}
            </PaginationPrevious>
          </PaginationItem>
          {links}
          <PaginationItem>
            <PaginationNext
              className={cn(
                "cursor-pointer",
                (page === pagesCount || pagesCount === 0) &&
                  "pointer-events-none opacity-60"
              )}
              onClick={() => setPage(nextPage)}
            >
              {!minimal && t("next")}
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </PaginationShacn>
      {!minimal && (
        <span className="text-muted-foreground text-sm">
          {(page - 1) * perPage + 1}-{Math.min(page * perPage, totalElements)}{" "}
          из {totalElements}
        </span>
      )}
    </div>
  );
}

export function PaginationWithQuery({
  totalElements,
  paginationOptions,
  minimal,
}: PaginationComponentProps) {
  const pagination = usePaginationQuery(paginationOptions);
  return (
    <PurePagination
      {...pagination}
      minimal={minimal}
      totalElements={totalElements}
    ></PurePagination>
  );
}

export function PaginationLocal({
  totalElements,
  paginationOptions,
  minimal,
  onPageChange,
}: PaginationComponentProps & { onPageChange: (page: number) => void }) {
  const pagination = usePaginationLocal(paginationOptions);
  useEffect(() => {
    onPageChange(pagination.page);
  }, [pagination.page]);
  return (
    <PurePagination
      {...pagination}
      minimal={minimal}
      totalElements={totalElements}
    ></PurePagination>
  );
}
