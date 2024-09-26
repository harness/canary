import React from 'react'

const StepForm = {
  Root: function Root({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-col h-full overflow-hidden">{children}</div>
  },

  Header: function Header({ children }: { children: React.ReactNode }) {
    return <div className={`border-b p-4`}>{children}</div>
  },

  Title: function Title({ children }: { children: React.ReactNode }) {
    return <div className="capitalize text-lg text-accent-foreground mb-3">{children}</div>
  },

  Description: function Title({ children }: { children: React.ReactNode }) {
    return <div className="text-muted-foreground my-3">{children}</div>
  },

  Actions: function Title({ children }: { children: React.ReactNode }) {
    return <div className="my-3">{children}</div>
  },

  Footer: function Footer({ children }: { children: React.ReactNode }) {
    return <div className={`border-t p-4 flex flex-row justify-between`}>{children}</div>
  }
}

export { StepForm }
