import { Drawer as DrawerPrimitive } from 'vaul'

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

const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerClose = DrawerPrimitive.Close

export type { DrawerContentVariantsSize, DrawerContentVariantsDirection, DrawerContentProps, DrawerHeaderProps }

export const Drawer = {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
  Tagline: DrawerTagline
}
