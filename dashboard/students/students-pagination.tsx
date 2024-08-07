'use client';

import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from '@tanstack/react-router';

import { paths } from '@/paths';
import { useSearchParams } from '@/hooks/user-searchparams';

function noop(): void {
  return undefined;
}
export interface Filters {
  email?: string;
  phone?: string;
  status?: string;
  query?: string;
  perPage?: number | string;
  page?: number | string;
}

export type SortDir = 'asc' | 'desc';
export interface StudentsPaginationProps {
  count: number;
  page: number | string;
  rows: number;
  filters?: Filters;
  sortDir?: SortDir;
  perPage?: number | string;
}

export function StudentsPagination({
  count,
  page,
  rows,
  filters = {},
  sortDir = 'desc',
}: StudentsPaginationProps): React.JSX.Element {
  const navigate = useNavigate();
  const { searchParams } = useSearchParams();

  const updatePageParams = React.useCallback(
    (page: number): void => {
      searchParams.set('page', page?.toString());
      navigate({ to: `${paths.dashboard.students.list}?${searchParams.toString()}` });
    },
    [navigate]
  );
  const updateRowParams = React.useCallback(
    (page: number): void => {
      searchParams.set('per_page', page?.toString());
      navigate({ to: `${paths.dashboard.students.list}?${searchParams.toString()}` });
    },
    [navigate]
  );

  return (
    <TablePagination
      component="div"
      count={count}
      onPageChange={(e, page) => {
        updatePageParams(page);
      }}
      onRowsPerPageChange={(e) => {
        updateRowParams(parseFloat(e.target.value));
      }}
      page={parseInt(page as string)}
      rowsPerPage={rows}
      rowsPerPageOptions={[5, 10, 25]}
    />
  );
}
