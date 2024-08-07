'use client';

import * as React from 'react';
import { APISERVICES } from '@/api-services';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Divider,
  FormControl,
  List,
  ListItemIcon,
  MenuItem,
  OutlinedInput,
  Popover,
  TextField,
  Tooltip,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CaretDown as ArrowDown } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { DotsThree } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { Minus as MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { paths } from '@/paths';
import { convertToFormData } from '@/lib/convert-form-data';
import { getCurrency } from '@/lib/currency';
import { dayjs } from '@/lib/dayjs';
import { usePopover } from '@/hooks/use-popover';
import { ConfirmationDialog } from '@/components/core/confirmation-dialog';
import { DataTable } from '@/components/core/data-table';
import type { ColumnDef } from '@/components/core/data-table';
import { RouterLink } from '@/components/core/link';

import { useCoursesSelection } from './courses-selection-context';

interface Unit {
  id: number;
  course_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Courses {
  id: number;
  title: string;
  description: string;
  duration: string;
  passing_criteria: number;
  status: 'draft' | 'published' | 'inactive';
  language: string;
  price: string;
  cover_image: string;
  chapters: string;
  course_endorsement_code: string;
  course_type: string;
  course_instruction: string;
  created_at: string;
  updated_at: string;
  units: Unit[];
}

const courseSchema = z.object({
  price: z.number().positive({ message: 'Price must be a positive number' }),
});

type Values = z.infer<typeof courseSchema>;

const MoreOptions = ({ rows }: any): React.JSX.Element => {
  const popover = usePopover<HTMLButtonElement>();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (id: number) => {
      const res = await APISERVICES.courses.delete(id);
      return res;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({
        queryKey: ['courses_list'],
      });
      popover?.handleClose?.();
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
      console.log('error', error);
    },
  });

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
            <MenuItem
              dense
              sx={{ py: 0.8 }}
              onClick={() => {
                navigate({ to: paths.dashboard.courses.preview(rows?.id) });
              }}
            >
              Preview
            </MenuItem>
            <MenuItem
              dense
              sx={{ py: 0.8 }}
              onClick={() => {
                navigate({ to: paths.dashboard.courses.edit(rows?.id) });
              }}
            >
              Edit
            </MenuItem>
            <ConfirmationDialog
              onCancel={popover.handleClose}
              onConfirm={() => {
                mutate(rows?.id);
              }}
              title="Delete Course"
              desc="Are you sure you want to delete this course ?"
              openButton={
                <MenuItem
                  dense
                  sx={{ py: 0.8, width: '100%' }}
                  // onClick={() => {
                  //   navigate({ to: paths.dashboard.courses.edit(rows?.id) });
                  // }}
                >
                  Delete
                </MenuItem>
              }
            ></ConfirmationDialog>
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
const Price = ({ rows }: any): React.JSX.Element => {
  const popover = usePopover<HTMLButtonElement>();
  const navigate = useNavigate();

  const defaultValues = {
    price: parseFloat(rows?.price),
  } satisfies Values;
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(courseSchema) });

  const queryClient = useQueryClient();

  const { mutate: priceMutate } = useMutation({
    mutationFn: async (values: Values) => {
      const res = await APISERVICES.courses.put(rows?.id, values);
      return res;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      popover.handleClose();
      queryClient.invalidateQueries({
        queryKey: ['courses_list'],
      });
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
      console.log('error', error);
    },
  });

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
        <Controller
          control={control}
          name="price"
          render={({ field, fieldState: { error } }) => (
            <Stack p={2} spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2">Course Price</Typography>
              <FormControl>
                <OutlinedInput
                  sx={{
                    px: 1,
                  }}
                  {...field}
                  value={`${field?.value}`}
                  onChange={(event) => {
                    field?.onChange?.(!isNaN(parseFloat(event?.target.value)) ? parseFloat(event?.target.value) : '');
                  }}
                  //@ts-ignore
                  helperText={error?.message}
                  error={Boolean(error?.message)}
                  onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                      // onApply(value);
                    }
                  }}
                />
              </FormControl>
              <Button
                fullWidth
                //@ts-ignore
                onClick={handleSubmit(priceMutate)}
                variant="contained"
              >
                Apply
              </Button>
            </Stack>
          )}
        />
      </Popover>

      <Typography onClick={popover.handleOpen} ref={popover.anchorRef}>
        {getCurrency(parseFloat(rows?.price))} <ArrowDown />
      </Typography>
    </>
  );
};

const statusSchema = z.object({
  status: z.enum(['draft', 'published', 'inactive'], {
    message: "Status must be either 'draft', 'published', or 'inactive'",
  }),
});

type StatusValues = z.infer<typeof statusSchema>;
const Status = ({ rows, children }: any): React.JSX.Element => {
  const popover = usePopover<HTMLButtonElement>();
  const navigate = useNavigate();

  const defaultValues = {
    status: rows?.status,
  } satisfies StatusValues;
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<StatusValues>({ defaultValues, resolver: zodResolver(statusSchema) });

  const queryClient = useQueryClient();

  const { mutate: priceMutate } = useMutation({
    mutationFn: async (values: StatusValues) => {
      const res = await APISERVICES.courses.put(rows?.id, values);
      return res;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      popover.handleClose();
      queryClient.invalidateQueries({
        queryKey: ['courses_list'],
      });
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong');
      console.log('error', error);
    },
  });

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
        <Controller
          control={control}
          name="status"
          render={({ field, fieldState: { error } }) => (
            <Stack p={2} spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', minWidth: 260 }}>
              <Typography variant="subtitle2">Course Status</Typography>
              <TextField
                {...field}
                helperText={error?.message}
                error={Boolean(error?.message)}
                label="Status"
                select
                fullWidth
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
              <Button
                fullWidth
                //@ts-ignore
                onClick={handleSubmit(priceMutate)}
                variant="contained"
              >
                Apply
              </Button>
            </Stack>
          )}
        />
      </Popover>

      <Typography onClick={popover.handleOpen} ref={popover.anchorRef}>
        {children}
      </Typography>
    </>
  );
};

const columns = [
  {
    formatter: (row): React.JSX.Element => (
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Avatar src={row?.cover_image} />{' '}
        <div>
          <Link
            color="inherit"
            component={RouterLink}
            href={paths.dashboard.courses.edit(row?.id)}
            sx={{ whiteSpace: 'nowrap' }}
            variant="subtitle2"
          >
            {row.title}
          </Link>
          {/* <Typography color="text.secondary" variant="body2">
            {row.duration}
          </Typography> */}
        </div>
      </Stack>
    ),
    name: 'Name',
    width: '250px',
  },

  { field: 'price', name: 'Enrolled Students', width: '180px' },
  { field: 'price', name: 'Active Students', width: '150px' },
  { field: 'price', name: 'Passed Students', width: '150px' },
  {
    formatter: (row): React.JSX.Element => <Price rows={row} />,
    name: 'Price',
    width: '150px',
  },
  {
    formatter: (row): React.JSX.Element => {
      const mapping = {
        published: {
          label: 'Published',
          icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />,
        },
        inactive: { label: 'Inactive', icon: <MinusIcon color="var(--mui-palette-error-main)" /> },
        draft: { label: 'Draft', icon: <ClockIcon color="var(--mui-palette-warning-main)" weight="fill" /> },
      } as const;
      const { label, icon } = mapping[row.status] ?? { label: 'Unknown', icon: null };

      return (
        <Status rows={row}>
          <Chip icon={icon} label={label} size="small" variant="outlined" />
        </Status>
      );
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
] satisfies ColumnDef<Courses>[];

export interface CoursesTableProps {
  rows: Courses[];
}

export function CoursesTable({ rows }: CoursesTableProps): React.JSX.Element {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useCoursesSelection();

  return (
    <React.Fragment>
      <DataTable<Courses>
        columns={columns}
        onDeselectAll={deselectAll}
        onDeselectOne={(_, row) => {
          deselectOne(row.id.toString());
        }}
        onSelectAll={selectAll}
        onSelectOne={(_, row) => {
          selectOne(row.id?.toString());
        }}
        rows={rows}
        // selectable
        selected={selected}
      />
      {!rows.length ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            No Courses found
          </Typography>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
