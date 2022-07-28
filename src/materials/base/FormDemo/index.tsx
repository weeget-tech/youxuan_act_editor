import CompIcon from "@/components/CompIcon";
import EmptyComp from "@/components/EmptyComp";
import React, { memo } from "react";
import type { IImageConfig } from "./schema";

const FormDemo = memo((props: IImageConfig) => {
  if (props.isTpl) return <CompIcon type="Demo" />;
  return <EmptyComp type="Space" title="Form Demo" />;
});

export default FormDemo;
