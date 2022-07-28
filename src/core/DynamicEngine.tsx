import React, { useMemo, FC, memo } from "react";
import { dynamic } from "umi";

export type componentsType = "base" | "marketing";

type DynamicType = {
  isTpl: boolean;
  data: { [key: string]: any };
  type: string;
  componentsType: componentsType;
  category: string;
};

const DynamicFunc = (type: string, componentsType: string) => {
  return dynamic({
    async loader() {
      const { default: Graph } = await import(
        `@/materials/${componentsType}/${type}`
      );
      const Component = Graph;
      return (props: DynamicType) => {
        const { isTpl } = props;
        return <Component {...props} isTpl={isTpl} />;
      };
    },
    loading: () => (
      <div style={{ paddingTop: 10, textAlign: "center" }}>
        <></>
      </div>
    ),
  });
};

const DynamicEngine = (props: DynamicType) => {
  const { type } = props;

  const category = props.category || "base";

  const Dynamic = useMemo(() => {
    return (DynamicFunc(type, category) as unknown) as FC<DynamicType>;
  }, [category, type]);

  return <Dynamic {...props} />;
};

export default memo(DynamicEngine);
