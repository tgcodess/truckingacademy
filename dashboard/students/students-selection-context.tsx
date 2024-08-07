'use client';

import * as React from 'react';

import { useSelection } from '@/hooks/use-selection';
import type { Selection } from '@/hooks/use-selection';

import type { Student } from './students-table';

function noop(): void {
  return undefined;
}

export interface StudentsSelectionContextValue extends Selection {}

export const StudentsSelectionContext = React.createContext<StudentsSelectionContextValue>({
  deselectAll: noop,
  deselectOne: noop,
  selectAll: noop,
  selectOne: noop,
  selected: new Set(),
  selectedAny: false,
  selectedAll: false,
});

interface StudentsSelectionProviderProps {
  children: React.ReactNode;
  students: Student[];
}

export function StudentsSelectionProvider({
  children,
  students = [],
}: StudentsSelectionProviderProps): React.JSX.Element {
  const customerIds = React.useMemo(() => students.map((customer) => customer.id), [students]);
  const selection = useSelection(customerIds);

  return <StudentsSelectionContext.Provider value={{ ...selection }}>{children}</StudentsSelectionContext.Provider>;
}

export function useStudentsSelection(): StudentsSelectionContextValue {
  return React.useContext(StudentsSelectionContext);
}
