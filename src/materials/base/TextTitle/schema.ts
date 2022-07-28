import { baseFormConfig } from '@/materials/common';
import { uuid } from '@/utils/tool';
import tmp from './template';

const Text = {
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
      data: {
        headline: '',
        headlineColor: {
          hex: '#000',
        },
        textAlign: 'center',
        subtitle: '',
        subtitleColor: '#3c3c3c',
        bgColor: '',
        // theme: '1',
      },
    },
  },
  editData: [
    {
      key: ['data', 'headline'],
      label: '标题',
      type: 'Text',
      maxLength: 20,
    },
    {
      key: ['data', 'headlineColor', 'hex'],
      label: '标题颜色',
      type: 'Color',
    },
    {
      key: ['data', 'subtitle'],
      label: '子标题',
      type: 'Text',
      maxLength: 20,
    },
    {
      key: ['data', 'subtitleColor', 'hex'],
      label: '子标题颜色',
      type: 'Color',
      path: 'style',
    },
    {
      key: ['data', 'textAlign'],
      label: '对齐方式',
      type: 'Select',
      labelKey: 'value',
      rangeLabel: 'text',
      range: [
        {
          value: 'left',
          text: '左对齐',
        },
        {
          value: 'center',
          text: '居中对齐',
        },
        {
          value: 'right',
          text: '右对齐',
        },
      ],
    },
    ...baseFormConfig,
  ],
};

export default Text;
