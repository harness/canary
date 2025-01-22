import type { FC, PropsWithChildren } from "react";

const ExampleLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="border-borders-4 bg-background-4 overflow-hidden rounded-md border px-5 py-2">
    {children}
  </div>
);

export default ExampleLayout;
