import { Drawer as DrawerPrimitive } from 'vaul'

import { DrawerHeaderV2, DrawerHeaderV2Props } from './drawer-header-v2'
import { DrawerTagline } from './Drawer.Tagline'
import { DrawerBody } from './DrawerBody'
import {
  DrawerContent,
  DrawerContentProps,
  DrawerContentVariantsDirection,
  DrawerContentVariantsSize
} from './DrawerContent'
import { DrawerDescription } from './DrawerDescription'
import { DrawerDualPane, type DrawerDualPaneProps } from './DrawerDualPane'
import { DrawerDualPaneMain } from './DrawerDualPaneMain'
import { DrawerFooter } from './DrawerFooter'
import { DrawerHeader, DrawerHeaderProps } from './DrawerHeader'
import { DrawerRail, type DrawerRailProps } from './DrawerRail'
import { DrawerRoot } from './DrawerRoot'
import { DrawerStep, type DrawerStepProps } from './DrawerStep'
import { DrawerSteps, type DrawerStepsProps } from './DrawerSteps'
import { DrawerSubStep, type DrawerSubStepProps } from './DrawerSubStep'
import { DrawerTitle } from './DrawerTitle'
import { DrawerTrigger } from './DrawerTrigger'

const DrawerClose = DrawerPrimitive.Close

export type {
  DrawerContentVariantsSize,
  DrawerContentVariantsDirection,
  DrawerContentProps,
  DrawerHeaderProps,
  DrawerHeaderV2Props,
  DrawerDualPaneProps,
  DrawerRailProps,
  DrawerStepProps,
  DrawerStepsProps,
  DrawerSubStepProps
}

export const Drawer = {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  HeaderV2: DrawerHeaderV2,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
  Tagline: DrawerTagline,
  DualPane: DrawerDualPane,
  Rail: DrawerRail,
  Steps: DrawerSteps,
  Step: DrawerStep,
  SubStep: DrawerSubStep,
  DualPaneMain: DrawerDualPaneMain
}
