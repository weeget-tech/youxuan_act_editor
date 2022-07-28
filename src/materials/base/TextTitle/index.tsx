import CompIcon from '@/components/CompIcon';
import EmptyComp from '@/components/EmptyComp';
import { getBackgroundStyle } from '@/utils/act_utils';
import React, { memo } from 'react';
import './index.less';

type TText = {
  isTpl: boolean;
  data: any;
  style: any;
};

const Text = ({ isTpl, data = {}, style }: TText) => {
  if (isTpl) return <CompIcon type="TextTitle" />;
  const {
    headline = '',
    headlineColor = {
      hex: '#fff',
    },
    subtitle = '',
    subtitleColor = {
      hex: '#fff',
    },
    textAlign = 'center',
    bgColor = '',
  } = data || {};

  const titleColor =
    typeof headlineColor === 'string'
      ? headlineColor
      : headlineColor.hex
      ? headlineColor.hex
      : '#fff';
  const subTitleColor =
    typeof subtitleColor === 'string'
      ? subtitleColor
      : subtitleColor.hex
      ? subtitleColor.hex
      : '#fff';

  return headline ? (
    <div
      className="textComp"
      style={{ textAlign, backgroundColor: bgColor, ...getBackgroundStyle(style) }}
    >
      <div className="title" style={{ color: titleColor }}>
        {headline}
      </div>
      <div className="subTitle" style={{ color: subTitleColor }}>
        {subtitle}
      </div>
    </div>
  ) : (
    <EmptyComp type="TextTitle" title="文字标题" />
  );
};

export default memo(Text);
