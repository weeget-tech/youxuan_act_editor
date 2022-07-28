import React, { memo } from 'react';
import { ConfigProvider } from 'zarm';
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';
import GridRender from './GridRender/index';
import type { IViewProps } from './typing';
import 'zarm/dist/zarm.css';

const ViewRender = memo((props: IViewProps) => {
  return (
    <ConfigProvider locale={zhCN}>
      <GridRender {...props} />
    </ConfigProvider>
  );
});

export default ViewRender;
