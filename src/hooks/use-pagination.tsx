import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";

export type PaginationProps = {
  defaultPage?: number;
  defaultPerPage?: number;
};

export type PaginationReturn = {
  page: number;
  setPage: (page: number) => void;
  perPage: number;
  setPerPage: (page: number) => void;
  resetPagination: () => void;
};

export function usePaginationQuery({
  defaultPage = 1,
  defaultPerPage = 25,
}: PaginationProps = {}): PaginationReturn {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(defaultPage).withOptions({ shallow: false })
  );
  const [perPage, setPerPage] = useQueryState(
    "perPage",
    parseAsInteger.withDefault(defaultPerPage).withOptions({ shallow: false })
  );
  const resetPagination = () => {
    setPage(defaultPage);
  };
  return {
    page,
    setPage,
    perPage,
    setPerPage,
    resetPagination,
  };
}

export const usePaginationLocal = ({
  defaultPage = 1,
  defaultPerPage = 25,
}: PaginationProps = {}): PaginationReturn => {
  const [page, setPage] = useState(defaultPage);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const resetPagination = () => {
    setPage(defaultPage);
  };
  return {
    page,
    setPage,
    perPage,
    setPerPage,
    resetPagination,
  };
};
