'use client';

import * as React from 'react';
import { Divider, List, ListItemIcon, MenuItem, Popover, Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { DotsThree } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { Minus as MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { useNavigate } from '@tanstack/react-router';

import { paths } from '@/paths';
import { dayjs } from '@/lib/dayjs';
import { usePopover } from '@/hooks/use-popover';
import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';
import { RouterLink } from '@/components/core/link';

import { useCustomersSelection } from './customers-selection-context';

export interface Customer {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone?: string;
  quota: number;
  status: 'pending' | 'active' | 'blocked';
  createdAt: Date;
}

const MoreOptions = ({ rows }: any): React.JSX.Element => {
  const popover = usePopover<HTMLButtonElement>();
  const navigate = useNavigate();

  return (
    <>
      <Popover
        anchorEl={popover?.anchorRef?.current}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        onClose={popover.handleClose}
        open={popover.open}
        slotProps={{ paper: { sx: { minWidth: '180px' } } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <List sx={{ p: 0.5, width: '100%' }}>
            {[1, 2, 3, 4, 5, 6]?.map((item, index) => (
              <React.Fragment key={item}>
                <MenuItem
                  dense
                  key={item}
                  sx={{ py: 0.8 }}
                  onClick={() => {
                    navigate({ to: paths.dashboard.customers.details('5') });
                  }}
                >
                  <ListItemIcon>
                    <PencilSimpleIcon />
                  </ListItemIcon>
                  Account
                </MenuItem>
                {index == 5 ? '' : <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Stack>
      </Popover>

      <Tooltip title="More options">
        <IconButton onClick={popover.handleOpen} ref={popover.anchorRef}>
          <DotsThree weight="bold" />
        </IconButton>
      </Tooltip>
    </>
  );
};

const columns = [
  {
    formatter: (row): React.JSX.Element => (
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Avatar src={row.avatar} />{' '}
        <div>
          <Link
            color="inherit"
            component={RouterLink}
            href={paths.dashboard.customers.details('1')}
            sx={{ whiteSpace: 'nowrap' }}
            variant="subtitle2"
          >
            {row.name}
          </Link>
          <Typography color="text.secondary" variant="body2">
            {row.email}
          </Typography>
        </div>
      </Stack>
    ),
    name: 'Name',
    width: '250px',
  },
  {
    formatter: (row): React.JSX.Element => (
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <LinearProgress sx={{ flex: '1 1 auto' }} value={row.quota} variant="determinate" />
        <Typography color="text.secondary" variant="body2">
          {new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(row.quota / 100)}
        </Typography>
      </Stack>
    ),
    name: 'Quota',
    width: '250px',
  },
  { field: 'phone', name: 'Phone number', width: '150px' },
  {
    formatter(row) {
      return dayjs(row.createdAt).format('MMM D, YYYY h:mm A');
    },
    name: 'Created at',
    width: '200px',
  },
  {
    formatter: (row): React.JSX.Element => {
      const mapping = {
        active: { label: 'Active', icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" /> },
        blocked: { label: 'Blocked', icon: <MinusIcon color="var(--mui-palette-error-main)" /> },
        pending: { label: 'Pending', icon: <ClockIcon color="var(--mui-palette-warning-main)" weight="fill" /> },
      } as const;
      const { label, icon } = mapping[row.status] ?? { label: 'Unknown', icon: null };

      return <Chip icon={icon} label={label} size="small" variant="outlined" />;
    },
    name: 'Status',
    width: '150px',
  },
  {
    formatter: (row): React.JSX.Element => <MoreOptions rows={row} />,
    name: 'Actions',
    hideName: true,
    width: '100px',
    align: 'right',
  },
] satisfies ColumnDef<Customer>[];

export interface CustomersTableProps {
  rows: Customer[];
}

export function CustomersTable({ rows }: CustomersTableProps): React.JSX.Element {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useCustomersSelection();

  return (
    <React.Fragment>
      <DataTable<Customer>
        columns={columns}
        onDeselectAll={deselectAll}
        onDeselectOne={(_, row) => {
          deselectOne(row.id);
        }}
        onSelectAll={selectAll}
        onSelectOne={(_, row) => {
          selectOne(row.id);
        }}
        rows={rows}
        selectable
        selected={selected}
      />
      {!rows.length ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            No customers found
          </Typography>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
