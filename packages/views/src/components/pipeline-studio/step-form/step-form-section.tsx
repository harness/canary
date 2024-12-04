const StepFormSection = {
  Root: function Root({ children }: { children: React.ReactNode }) {
    return <div className="flex grow flex-col overflow-scroll">{children}</div>
  },

  Header: function Header({ children }: { children: React.ReactNode }) {
    return <div className="p-4">{children}</div>
  },

  Title: function Title({ children }: { children: React.ReactNode }) {
    return <div className="text-accent-foreground my-3 text-lg">{children}</div>
  },

  Description: function Title({ children }: { children: React.ReactNode }) {
    return <div className="text-muted-foreground mt-3">{children}</div>
  },

  Form: function Title({ children }: { children: React.ReactNode }) {
    return <div className="mb-4 p-4">{children}</div>
  }
}

export { StepFormSection }
