'use client';

import * as React from 'react';
import { Divider, ListSubheader, MenuItem, MenuList, Tab, Tabs, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { CreditCard as CreditCardIcon } from '@phosphor-icons/react/dist/ssr/CreditCard';
import { LockKey as LockKeyIcon } from '@phosphor-icons/react/dist/ssr/LockKey';
import { Phone } from '@phosphor-icons/react/dist/ssr/Phone';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { UserCircle as UserCircleIcon } from '@phosphor-icons/react/dist/ssr/UserCircle';
import { UsersThree as UsersThreeIcon } from '@phosphor-icons/react/dist/ssr/UsersThree';
import { useNavigate, useRouter } from '@tanstack/react-router';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { usePathname } from '@/hooks/use-pathname';
import { RouterLink } from '@/components/core/link';

// NOTE: First level elements are groups.

const navItems = [
  {
    key: 'personal',
    title: 'Personal',
    items: [
      { key: 'account', title: 'Account', href: paths.dashboard.settings.account, icon: 'user-circle' },
      { key: 'notifications', title: 'Notifications', href: paths.dashboard.settings.notifications, icon: 'bell' },
      { key: 'security', title: 'Security', href: paths.dashboard.settings.security, icon: 'lock-key' },
    ],
  },
  {
    key: 'organization',
    title: 'Organization',
    items: [
      { key: 'roles', title: 'Roles', href: paths.dashboard.settings.roles, icon: 'lock-key' },
      { key: 'billing', title: 'Billing & plans', href: paths.dashboard.settings.billing, icon: 'credit-card' },
      // { key: 'team', title: 'Team', href: paths.dashboard.settings.team, icon: 'users-three' },
      // {
      //   key: 'integrations',
      //   title: 'Integrations',
      //   href: paths.dashboard.settings.integrations,
      //   icon: 'plugs-connected',
      // },
    ],
  },
] satisfies NavItemConfig[];

const icons = {
  'credit-card': CreditCardIcon,
  'lock-key': LockKeyIcon,
  'plugs-connected': PlugsConnectedIcon,
  'user-circle': UserCircleIcon,
  'users-three': UsersThreeIcon,
  bell: BellIcon,
} as Record<string, Icon>;

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();
  const router = useNavigate();

  return (
    <div>
      <Stack
        spacing={3}
        sx={{
          flex: '0 0 auto',
          flexDirection: { xs: 'column-reverse', md: 'column' },
          position: { md: 'sticky' },
          top: '64px',
          width: { xs: '100%', md: '240px' },
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Stack component="ul" spacing={3} sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {navItems.map((group) => (
            <Stack component="li" key={group.key} spacing={2}>
              {group.title ? (
                <div>
                  <Typography color="text.secondary" variant="caption">
                    {group.title}
                  </Typography>
                </div>
              ) : null}
              <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
                {group.items.map((item) => (
                  <NavItem {...item} key={item.key} pathname={pathname} />
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>

        {/* <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar src="/assets/avatar.png">AV</Avatar>
          <div>
            <Typography variant="subtitle1">Sofia Rivers</Typography>
            <Typography color="text.secondary" variant="caption">
              sofia@devias.io
            </Typography>
          </div>
        </Stack> */}
      </Stack>

      <Box
        sx={{
          display: { md: 'none' },
        }}
      >
        <Tabs
          indicatorColor="primary"
          onChange={(e, value) => {
            router({ to: value });
          }}
          textColor="primary"
          value={pathname}
          variant="scrollable"
          scrollButtons
        >
          {[
            { key: 'account', title: 'Account', href: paths.dashboard.settings.account, icon: 'user-circle' },
            {
              key: 'notifications',
              title: 'Notifications',
              href: paths.dashboard.settings.notifications,
              icon: 'bell',
            },
            { key: 'security', title: 'Security', href: paths.dashboard.settings.security, icon: 'lock-key' },
            { key: 'roles', title: 'Roles', href: paths.dashboard.settings.roles, icon: 'lock-key' },
            { key: 'billing', title: 'Billing & plans', href: paths.dashboard.settings.billing, icon: 'credit-card' },
          ].map((tab) => {
            const Icon = tab.icon ? icons[tab?.icon] : null;

            return (
              <Tab
                key={tab.href}
                icon={
                  tab?.icon ? (
                    <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
                      {Icon ? (
                        <Icon
                          fill={
                            pathname == '/admin' + tab?.href
                              ? 'var(--mui-palette-text-primary)'
                              : 'var(--mui-palette-text-secondary)'
                          }
                          fontSize="var(--icon-fontSize-md)"
                          weight={pathname == '/admin' + tab?.href ? 'fill' : undefined}
                        />
                      ) : (
                        ''
                      )}
                    </Box>
                  ) : (
                    ''
                  )
                }
                iconPosition="start"
                label={tab.title}
                sx={{
                  fontSize: 16,
                }}
                value={'/admin' + tab.href}
              />
            );
          })}
        </Tabs>
        <Divider />
      </Box>

      {/* <TextField
        sx={{
          display: { md: 'none' },
        }}
        select
        fullWidth
        value={pathname}
        label="Page"
        // variant="filled"
        onChange={(e) => {
          router({ to: e?.target?.value });
        }}
      >
        {[
          { key: 'account', title: 'Account', href: paths.dashboard.settings.account, icon: 'user-circle' },
          {
            key: 'notifications',
            title: 'Notifications',
            href: paths.dashboard.settings.notifications,
            icon: 'bell',
          },
          { key: 'security', title: 'Security', href: paths.dashboard.settings.security, icon: 'lock-key' },
        ]?.map((item) => (
          <MenuItem value={item?.href} key={item.key}>
            {item?.title}
          </MenuItem>
        ))}
      </TextField> */}
    </div>
  );
}

interface NavItemProps extends NavItemConfig {
  pathname: string;
}

function NavItem({ disabled, external, href, icon, pathname, title }: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, pathname });
  const Icon = icon ? icons[icon] : null;

  return (
    <Box component="li" sx={{ userSelect: 'none' }}>
      <Box
        {...(href
          ? {
              component: external ? 'a' : RouterLink,
              href,
              target: external ? '_blank' : undefined,
              rel: external ? 'noreferrer' : undefined,
            }
          : { role: 'button' })}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--mui-palette-text-secondary)',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: '6px 16px',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          ...(disabled && { color: 'var(--mui-palette-text-disabled)', cursor: 'not-allowed' }),
          ...(active && { bgcolor: 'var(--mui-palette-action-selected)', color: 'var(--mui-palette-text-primary)' }),
          '&:hover': {
            ...(!active &&
              !disabled && { bgcolor: 'var(--mui-palette-action-hover)', color: 'var(---mui-palette-text-primary)' }),
          },
        }}
        tabIndex={0}
      >
        {Icon ? (
          <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
            <Icon
              fill={active ? 'var(--mui-palette-text-primary)' : 'var(--mui-palette-text-secondary)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          </Box>
        ) : null}
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography
            component="span"
            sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}