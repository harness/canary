import { Icon, type IconProps } from './icon'

function Root({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[233px] flex-col gap-5 rounded-md border bg-muted/25 px-5 py-3 pb-5 pr-4">{children}</div>
  )
}

function Header({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4">{children}</div>
}

function HeaderTitle({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function HeaderLink({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function Content({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function List({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>
}

function ListItem({ children, iconName }: { children: React.ReactNode; iconName?: IconProps['name'] }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-2">
      <div>{iconName && <Icon name={iconName} size={20} className="text-tertiary-background" />}</div>
      <div className="flex flex-col">{children}</div>
    </div>
  )
}

export { Root, Header, HeaderTitle, HeaderLink, Content, List, ListItem }
