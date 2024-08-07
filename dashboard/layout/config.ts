import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

// NOTE: We did not use React Components for Icons, because
//  you may one to get the config from the server.

// NOTE: First level elements are groups.

export interface LayoutConfig {
  navItems: NavItemConfig[];
}

export const layoutConfig = {
  navItems: [
    {
      key: 'dashboards',
      // title: 'Dashboards',
      items: [{ key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'house' }],
    },
    {
      key: 'general',
      // title: 'General',
      items: [
        {
          key: 'settings',
          title: 'Settings',
          href: paths.dashboard.settings.account,
          icon: 'gear',
          matcher: { type: 'startsWith', href: '/admin/dashboard/settings' },
        },
        {
          key: 'courses',
          title: 'Courses',
          href: paths.dashboard.courses.list,
          icon: 'courses',
          matcher: { type: 'startsWith', href: '/admin/dashboard/courses' },
        },
        {
          key: 'students',
          title: 'Students',
          href: paths.dashboard.students.list,
          icon: 'users',
          matcher: { type: 'startsWith', href: '/admin/dashboard/students' },
        },
        {
          key: 'payments',
          title: 'Payments',
          href: paths.dashboard.payments.list,
          icon: 'payment',
          matcher: { type: 'startsWith', href: '/admin/dashboard/payments' },
        },
        // {
        //   key: 'customers',
        //   title: 'Customers',
        //   icon: 'users',
        //   items: [
        //     { key: 'customers', title: 'List customers', href: paths.dashboard.customers.list },
        //     { key: 'customers:create', title: 'Create customer', href: paths.dashboard.customers.create },
        //     // { key: 'customers:details', title: 'Customer details', href: paths.dashboard.customers.details('1') },
        //   ],
        // },
      ],
    },
  ],
} satisfies LayoutConfig;
