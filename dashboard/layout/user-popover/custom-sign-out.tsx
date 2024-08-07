'use client';

import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';

import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { toast } from '@/components/core/toaster';

export function CustomSignOut(): React.JSX.Element {
  const { checkSession, signOut } = useUser();

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      signOut();
      checkSession?.();
    } catch (err) {
      logger.error('Sign out error', err);
      toast.error('Something went wrong, unable to sign out');
    }
  }, [checkSession]);

  return (
    <MenuItem component="div" onClick={handleSignOut} sx={{ justifyContent: 'center' }}>
      Sign out
    </MenuItem>
  );
}
