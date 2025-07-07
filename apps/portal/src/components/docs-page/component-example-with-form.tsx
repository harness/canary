import { type FC } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import type { ComponentExampleProps } from "./component-example";
import ComponentExample from "./component-example";

const ComponentExampleWithZodAndForm: FC<ComponentExampleProps> = ({
  code,
}) => {
  return <ComponentExample code={code} scope={{ zodResolver, z, useForm }} />;
};

export default ComponentExampleWithZodAndForm;
