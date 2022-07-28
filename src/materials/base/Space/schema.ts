import { baseFormConfig } from '@/materials/common';
import { uuid } from '@/utils/tool';
import tmp from './template';

const Space = {
  config: {
    ...tmp,
    data: {
      // 组件的初始化参数
      id: uuid(6, 10),
      type: tmp.type,
      description: tmp.displayName,
      action: '',
      showStartTime: '',
      style: {},
      showEndTime: '',
      // 组件类型， 1、普通对象或者带子组件(componentList)的  2、组件带子内容列表(contentList)， 如商品组件
      componentType: 1,
      userGroup: [],
      data: {
        height: 8,
      },
    },
  },
  editData: [
    {
      key: ['data', 'height'],
      label: '空白高度',
      type: 'Number',
      placeholder: '单位Px',
      range: [0],
    },
    ...baseFormConfig.filter((i) => i.label !== '组件背景图'),
  ],
};

export default Space;
