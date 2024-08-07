'use client';

import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from '@tanstack/react-router';

import { paths } from '@/paths';
import { useSearchParams } from '@/hooks/user-searchparams';

function noop(): void {
  return undefined;
}

interface CoursesPaginationProps {
  count: number;
  page: number;
  rows: number;
}

export function CoursesPagination({ count, page, rows }: CoursesPaginationProps): React.JSX.Element {
  const navigate = useNavigate();
  const { searchParams } = useSearchParams();

  const updatePageParams = React.useCallback(
    (page: number): void => {
      searchParams.set('page', page?.toString());
      navigate({ to: `${paths.dashboard.courses.list}?${searchParams.toString()}` });
    },
    [navigate]
  );
  const updateRowParams = React.useCallback(
    (page: number): void => {
      searchParams.set('per_page', page?.toString());
      navigate({ to: `${paths.dashboard.courses.list}?${searchParams.toString()}` });
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
      page={page}
      rowsPerPage={rows}
      rowsPerPageOptions={[5, 10, 25]}
    />
  );
}
