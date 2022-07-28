import React, { memo } from 'react';
import { INewData } from '@/models/editorModal';
import DynamicEngine from '@/core/DynamicEngine';
import { getTabSliderIndex } from '@/utils/act_utils';
import { IViewProps } from '../typing';
import NavigationBar from './component/NavigationBar';
import styles from './index.less';

const ClientRender = memo((props: IViewProps) => {
  const { pointData, pageData } = props;
  const sliderIndex = getTabSliderIndex(pointData);
  return (
    <>
      <NavigationBar navigationData={pageData} />
      {pointData.map((value: INewData, index: number) => {
        // 是否为侧边栏组件, 自动缩进组件
        const hasSlider = sliderIndex > -1 && index > sliderIndex;
        return (
          <div
            key={value.id}
            className={`${styles.dragItemRender} ${hasSlider ? 'slider-right-content' : ''}`}
          >
            <DynamicEngine {...(value as any)} isTpl={false} />
          </div>
        );
      })}
    </>
  );
});

export default ClientRender;
