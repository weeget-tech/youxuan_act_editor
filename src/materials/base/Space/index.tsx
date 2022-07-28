import CompIcon from '@/components/CompIcon';
import EmptyComp from '@/components/EmptyComp';
import { getBackgroundStyle } from '@/utils/act_utils';
import React, { memo } from 'react';

type TSpace = {
  isTpl: boolean;
  data: any;
  style: any;
};

const Space = ({ isTpl, data = {}, style = {} }: TSpace) => {
  if (isTpl) return <CompIcon type="Space" />;
  const { height = 0 } = data || {};
  return height ? (
    <div style={{ height: `${height}px`, ...getBackgroundStyle(style) }} />
  ) : (
    <EmptyComp type="Space" title="辅助分割" />
  );
};

export default memo(Space);
