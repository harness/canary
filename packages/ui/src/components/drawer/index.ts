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
import { DrawerFooter } from './DrawerFooter'
import { DrawerHeader, DrawerHeaderProps } from './DrawerHeader'
import { DrawerRoot } from './DrawerRoot'
import { DrawerTitle } from './DrawerTitle'
import { DrawerTrigger } from './DrawerTrigger'

const DrawerClose = DrawerPrimitive.Close

export type {
  DrawerContentVariantsSize,
  DrawerContentVariantsDirection,
  DrawerContentProps,
  DrawerHeaderProps,
  DrawerHeaderV2Props
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
  Tagline: DrawerTagline
}
