'use client';

import * as React from 'react';

import { useSelection } from '@/hooks/use-selection';
import type { Selection } from '@/hooks/use-selection';

import type { Courses } from './courses-table';

function noop(): void {
  return undefined;
}

export interface CoursesSelectionContextValue extends Selection {}

export const CustomersSelectionContext = React.createContext<CoursesSelectionContextValue>({
  deselectAll: noop,
  deselectOne: noop,
  selectAll: noop,
  selectOne: noop,
  selected: new Set(),
  selectedAny: false,
  selectedAll: false,
});

interface CoursesSelectionProviderProps {
  children: React.ReactNode;
  courses: Courses[];
}

export function CoursesSelectionProvider({ children, courses = [] }: CoursesSelectionProviderProps): React.JSX.Element {
  const coursesId = React.useMemo(() => courses.map((course) => course.id), [courses]);
  const selection = useSelection(coursesId);

  return (
    <CustomersSelectionContext.Provider
      //@ts-ignore
      value={{ ...selection }}
    >
      {children}
    </CustomersSelectionContext.Provider>
  );
}

export function useCoursesSelection(): CoursesSelectionContextValue {
  return React.useContext(CustomersSelectionContext);
}
