'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { useNavigate } from '@tanstack/react-router';

import { paths } from '@/paths';
import { useSearchParams } from '@/hooks/user-searchparams';
import { FilterButton, FilterPopover, useFilterContext } from '@/components/core/filter-button';
import { Option } from '@/components/core/option';

import { useCoursesSelection } from './courses-selection-context';

// The tabs should be generated using API data.
const tabs = [
  { label: 'All', value: '' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'Inactive', value: 'inactive' },
] as const;

export interface Filters {
  email?: string;
  phone?: string;
  status?: string;
  query?: string;
}

export type SortDir = 'asc' | 'desc';

export interface CoursesFiltersProps {
  filters?: Filters;
  sortDir?: SortDir;
}

export function CoursesFilters({ filters = {}, sortDir = 'desc' }: CoursesFiltersProps): React.JSX.Element {
  const { email, phone, status } = filters;

  const navigate = useNavigate();

  const selection = useCoursesSelection();
  const { searchParams } = useSearchParams();

  const updateSearchParams = React.useCallback(
    (newFilters: Filters, newSortDir: SortDir): void => {
      if (newSortDir === 'asc') {
        searchParams.set('sortDir', newSortDir);
      } else {
        searchParams.delete('sortDir');
      }

      if (newFilters.status) {
        searchParams.set('status', newFilters.status);
      } else {
        searchParams.delete('status');
      }

      if (newFilters.email) {
        searchParams.set('email', newFilters.email);
      } else {
        searchParams.delete('email');
      }

      if (newFilters.phone) {
        searchParams.set('phone', newFilters.phone);
      } else {
        searchParams.delete('phone');
      }
      if (newFilters.query) {
        searchParams.set('query', newFilters.query);
      } else {
        searchParams.delete('query');
      }

      navigate({ to: `${paths.dashboard.courses.list}?${searchParams.toString()}` });
    },
    [navigate]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({}, sortDir);
  }, [updateSearchParams, sortDir]);

  const handleStatusChange = React.useCallback(
    (_: React.SyntheticEvent, value: string) => {
      updateSearchParams({ ...filters, status: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleEmailChange = React.useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, email: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handlePhoneChange = React.useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, phone: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );
  const handleQueryChange = React.useCallback(
    (value?: string) => {
      updateSearchParams({ ...filters, query: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleSortChange = React.useCallback(
    (event: SelectChangeEvent) => {
      updateSearchParams(filters, event.target.value as SortDir);
    },
    [updateSearchParams, filters]
  );

  const hasFilters = status || email || phone;

  return (
    <div>
      <Tabs onChange={handleStatusChange} sx={{ px: 3 }} value={status ?? ''} variant="scrollable">
        {tabs.map((tab) => (
          <Tab
            iconPosition="end"
            key={tab.value}
            label={tab.label}
            sx={{ minHeight: 'auto' }}
            tabIndex={0}
            value={tab.value}
          />
        ))}
      </Tabs>
      {/* <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', px: 3, py: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          <FormControl>
            <OutlinedInput
              fullWidth
              sx={{
                px: 1,
              }}
              onChange={(event) => {
                handleQueryChange(event?.target?.value);
              }}
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                }
              }}
            />
          </FormControl>

          <FilterButton
            displayValue={email}
            label="Email"
            onFilterApply={(value) => {
              handleEmailChange(value as string);
            }}
            onFilterDelete={() => {
              handleEmailChange();
            }}
            popover={<EmailFilterPopover />}
            value={email}
          />
          <FilterButton
            displayValue={phone}
            label="Phone number"
            onFilterApply={(value) => {
              handlePhoneChange(value as string);
            }}
            onFilterDelete={() => {
              handlePhoneChange();
            }}
            popover={<PhoneFilterPopover />}
            value={phone}
          />

          {hasFilters ? <Button onClick={handleClearFilters}>Clear filters</Button> : null}
        </Stack>
        {selection.selectedAny ? (
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              {selection.selected.size} selected
            </Typography>
            <Button color="error" variant="contained">
              Delete
            </Button>
          </Stack>
        ) : null}
        <Select
          name="sort"
          onChange={handleSortChange}
          sx={{ maxWidth: '100%', width: '120px', px: 1 }}
          value={sortDir}
        >
          <Option value="desc">Newest</Option>
          <Option value="asc">Oldest</Option>
        </Select>
      </Stack> */}
    </div>
  );
}

function EmailFilterPopover(): React.JSX.Element {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    setValue((initialValue as string | undefined) ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by email">
      <FormControl>
        <OutlinedInput
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              onApply(value);
            }
          }}
          value={value}
        />
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        Apply
      </Button>
    </FilterPopover>
  );
}

function PhoneFilterPopover(): React.JSX.Element {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState<string>('');

  React.useEffect(() => {
    setValue((initialValue as string | undefined) ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by phone number">
      <FormControl>
        <OutlinedInput
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              onApply(value);
            }
          }}
          value={value}
        />
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        Apply
      </Button>
    </FilterPopover>
  );
}
