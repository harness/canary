import type { FC, PropsWithChildren } from "react";

import css from "./example-layout.module.css";

const ExampleLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className="border border-borders-4 rounded-md overflow-hidden px-5 py-2 bg-background-4">
    {children}
  </div>
);

export default ExampleLayout;
