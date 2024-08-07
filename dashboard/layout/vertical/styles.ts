import type { NavColor } from '@/types/settings';
import type { ColorScheme } from '@/styles/theme/types';

export const navColorStyles = {
  dark: {
    blend_in: {
      '--SideNav-background': 'var(--mui-palette-background-default)',
      '--SideNav-color': 'var(--mui-palette-common-white)',
      '--SideNav-border': '1px solid var(--mui-palette-neutral-700)',
      '--NavGroup-title-color': 'var(--mui-palette-neutral-400)',
      '--NavItem-color': 'var(--mui-palette-neutral-300)',
      '--NavItem-hover-background': 'var(--mui-palette-action-hover)',
      '--NavItem-active-background': 'var(--mui-palette-primary-main)',
      '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
      '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
      '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
      '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
      '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
      '--NavItem-expand-color': 'var(--mui-palette-neutral-400)',
      '--NavItem-children-border': 'var(--mui-palette-neutral-700)',
      '--NavItem-children-indicator': 'var(--mui-palette-neutral-400)',
      '--Workspaces-background': 'var(--mui-palette-neutral-950)',
      '--Workspaces-border-color': 'var(--mui-palette-neutral-700)',
      '--Workspaces-title-color': 'var(--mui-palette-neutral-400)',
      '--Workspaces-name-color': 'var(--mui-palette-neutral-300)',
      '--Workspaces-expand-color': 'var(--mui-palette-neutral-400)',
    },
    discrete: {
      '--SideNav-background': 'var(--mui-palette-neutral-900)',
      '--SideNav-color': 'var(--mui-palette-common-white)',
      '--SideNav-border': '1px solid var(--mui-palette-neutral-700)',
      '--NavGroup-title-color': 'var(--mui-palette-neutral-400)',
      '--NavItem-color': 'var(--mui-palette-neutral-300)',
      '--NavItem-hover-background': 'var(--mui-palette-action-hover)',
      '--NavItem-active-background': 'var(--mui-palette-primary-main)',
      '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
      '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
      '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
      '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
      '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
      '--NavItem-expand-color': 'var(--mui-palette-neutral-400)',
      '--NavItem-children-border': 'var(--mui-palette-neutral-700)',
      '--NavItem-children-indicator': 'var(--mui-palette-neutral-400)',
      '--Workspaces-background': 'var(--mui-palette-neutral-950)',
      '--Workspaces-border-color': 'var(--mui-palette-neutral-700)',
      '--Workspaces-title-color': 'var(--mui-palette-neutral-400)',
      '--Workspaces-name-color': 'var(--mui-palette-neutral-300)',
      '--Workspaces-expand-color': 'var(--mui-palette-neutral-400)',
    },
    evident: {
      '--SideNav-background': 'var(--mui-palette-neutral-800)',
      '--SideNav-color': 'var(--mui-palette-common-white)',
      '--SideNav-border': 'none',
      '--NavGroup-title-color': 'var(--mui-palette-neutral-400)',
      '--NavItem-color': 'var(--mui-palette-neutral-300)',
      '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
      '--NavItem-active-background': 'var(--mui-palette-primary-main)',
      '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
      '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
      '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
      '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
      '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
      '--NavItem-expand-color': 'var(--mui-palette-neutral-400)',
      '--NavItem-children-border': 'var(--mui-palette-neutral-700)',
      '--NavItem-children-indicator': 'var(--mui-palette-neutral-400)',
      '--Workspaces-background': 'var(--mui-palette-neutral-950)',
      '--Workspaces-border-color': 'var(--mui-palette-neutral-700)',
      '--Workspaces-title-color': 'var(--mui-palette-neutral-400)',
      '--Workspaces-name-color': 'var(--mui-palette-neutral-300)',
      '--Workspaces-expand-color': 'var(--mui-palette-neutral-400)',
    },
  },
  light: {
    blend_in: {
      '--SideNav-background': 'var(--mui-palette-background-default)',
      '--SideNav-color': 'var(--mui-palette-text-primary)',
      '--SideNav-border': '1px solid var(--mui-palette-divider)',
      '--NavGroup-title-color': 'var(--mui-palette-neutral-600)',
      '--NavItem-color': 'var(--mui-palette-neutral-600)',
      '--NavItem-hover-background': 'var(--mui-palette-action-hover)',
      '--NavItem-active-background': 'var(--mui-palette-primary-main)',
      '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
      '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
      '--NavItem-icon-color': 'var(--mui-palette-neutral-500)',
      '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
      '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-500)',
      '--NavItem-expand-color': 'var(--mui-palette-neutral-500)',
      '--NavItem-children-border': 'var(--mui-palette-neutral-200)',
      '--NavItem-children-indicator': 'var(--mui-palette-neutral-500)',
      '--Workspaces-background': 'var(--mui-palette-neutral-100)',
      '--Workspaces-border-color': 'var(--mui-palette-divider)',
      '--Workspaces-title-color': 'var(--mui-palette-neutra-400)',
      '--Workspaces-name-color': 'var(--mui-palette-neutral-900)',
      '--Workspaces-expand-color': 'var(--mui-palette-neutral-400)',
    },
    discrete: {
      '--SideNav-background': 'var(--mui-palette-neutral-50)',
      '--SideNav-color': 'var(--mui-palette-text-primary)',
      '--SideNav-border': '1px solid var(--mui-palette-divider)',
      '--NavGroup-title-color': 'var(--mui-palette-neutral-600)',
      '--NavItem-color': 'var(--mui-palette-neutral-600)',
      '--NavItem-hover-background': 'var(--mui-palette-action-hover)',
      '--NavItem-active-background': 'var(--mui-palette-primary-main)',
      '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
      '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
      '--NavItem-icon-color': 'var(--mui-palette-neutral-500)',
      '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
      '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-500)',
      '--NavItem-expand-color': 'var(--mui-palette-neutral-500)',
      '--NavItem-children-border': 'var(--mui-palette-neutral-200)',
      '--NavItem-children-indicator': 'var(--mui-palette-neutral-500)',
      '--Workspaces-background': 'var(--mui-palette-neutral-100)',
      '--Workspaces-border-color': 'var(--mui-palette-divider)',
      '--Workspaces-title-color': 'var(--mui-palette-neutra-400)',
      '--Workspaces-name-color': 'var(--mui-palette-neutral-900)',
      '--Workspaces-expand-color': 'var(--mui-palette-neutral-400)',
    },
    evident: {
      '--SideNav-background': 'var(--mui-palette-neutral-950)',
      '--SideNav-color': 'var(--mui-palette-common-white)',
      '--SideNav-border': 'none',
      '--NavGroup-title-color': 'var(--mui-palette-neutral-400)',
      '--NavItem-color': 'var(--mui-palette-neutral-300)',
      '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
      '--NavItem-active-background': 'var(--mui-palette-primary-main)',
      '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
      '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
      '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
      '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
      '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
      '--NavItem-expand-color': 'var(--mui-palette-neutral-400)',
      '--NavItem-children-border': 'var(--mui-palette-neutral-700)',
      '--NavItem-children-indicator': 'var(--mui-palette-neutral-400)',
      '--Workspaces-background': 'var(--mui-palette-neutral-950)',
      '--Workspaces-border-color': 'var(--mui-palette-neutral-700)',
      '--Workspaces-title-color': 'var(--mui-palette-neutral-400)',
      '--Workspaces-name-color': 'var(--mui-palette-neutral-300)',
      '--Workspaces-expand-color': 'var(--mui-palette-neutral-400)',
    },
  },
} satisfies Record<ColorScheme, Record<NavColor, Record<string, string>>>;
