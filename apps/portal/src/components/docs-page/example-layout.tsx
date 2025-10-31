import type { FC, PropsWithChildren } from "react";

const ExampleLayout: FC<
  PropsWithChildren<React.HTMLAttributes<HTMLElement>>
> = ({ children }) => (
  <div className="border-cn-3 bg-cn-3 rounded-cn-3 px-cn-lg py-cn-xs overflow-hidden border">
    {children}
  </div>
);

export default ExampleLayout;
