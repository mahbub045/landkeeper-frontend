import type { ReactNode } from 'react';

export interface AuthPageRightPanelProps {
  children: ReactNode;
  /** Width / layout classes for the form card. Defaults to `max-w-md`. */
  cardClassName?: string;
}
