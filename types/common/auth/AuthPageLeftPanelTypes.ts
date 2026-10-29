import type { ComponentType, ElementType } from 'react';

export interface FeatureSlide {
  key: string;
  title: string;
  description: string;
  /** Mock-UI illustration rendered above the slide copy */
  Illustration: ComponentType;
}

export interface FeatureAppIconProps {
  icon: ElementType;
  /** Positioning classes for the floating icon tile */
  className: string;
}
