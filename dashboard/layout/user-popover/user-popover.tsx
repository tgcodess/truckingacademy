'use client';

import * as React from 'react';
import { Link } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { CreditCard as CreditCardIcon } from '@phosphor-icons/react/dist/ssr/CreditCard';
import { LockKey as LockKeyIcon } from '@phosphor-icons/react/dist/ssr/LockKey';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { useNavigate } from '@tanstack/react-router';

import type { User } from '@/types/user';
import { config } from '@/config';
import { paths } from '@/paths';
import { RouterLink } from '@/components/core/link';
import { SettingsButton } from '@/components/core/settings/settings-button';

import { CustomSignOut } from './custom-sign-out';

const user = {
  id: 'USR-000',
  name: 'Sofia Rivers',
  avatar: '/assets/avatar.png',
  email: 'sofia@devias.io',
} satisfies User;

export interface UserPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const navigate = useNavigate();
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={Boolean(open)}
      slotProps={{ paper: { sx: { width: '280px' } } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <Box sx={{ p: 2 }}>
        <Typography>{user.name}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user.email}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ p: 1 }}>
        <MenuItem
          onClick={() => {
            navigate({ to: paths.dashboard.settings.account });
            onClose?.();
          }}
        >
          <ListItemIcon>
            <UserIcon />
          </ListItemIcon>
          Account
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate({ to: paths.dashboard.settings.security });
            onClose?.();
          }}
        >
          <ListItemIcon>
            <LockKeyIcon />
          </ListItemIcon>
          Security
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate({ to: paths.dashboard.settings.billing });
            onClose?.();
          }}
        >
          <ListItemIcon>
            <CreditCardIcon />
          </ListItemIcon>
          Billing
        </MenuItem>
        <SettingsButton />
      </List>
      <Divider />
      <Box sx={{ p: 1 }}>
        <CustomSignOut />
      </Box>
    </Popover>
  );
}
