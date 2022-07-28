import { TNumberDefaultType } from '@/components/FormComponents/types';

export interface ICommonBaseType {
  baseTop: TNumberDefaultType;
  baseLeft: TNumberDefaultType;
  baseRadius: TNumberDefaultType;
  baseRotate: TNumberDefaultType;
  baseScale: TNumberDefaultType;
  baseHeight: TNumberDefaultType;
  baseWidth: TNumberDefaultType;
  isTpl?: boolean;
}

export const baseConfig: any = [
  {
    key: 'baseTop',
    name: '纵向位移',
    type: 'Number',
  },
  {
    key: 'baseLeft',
    name: '横向位移',
    type: 'Number',
  },
  {
    key: 'baseRadius',
    name: '圆角',
    type: 'Number',
  },
  {
    key: 'baseRotate',
    name: '旋转',
    type: 'Number',
  },
  {
    key: 'baseScale',
    name: '缩放',
    type: 'Number',
  },
  {
    key: 'baseHeight',
    name: '容器高度%',
    type: 'Number',
  },
  {
    key: 'baseWidth',
    name: '容器宽度%',
    type: 'Number',
  },
];

export const baseDefault = {
  baseTop: 0,
  baseLeft: 0,
  baseRadius: 0,
  baseRotate: 0,
  baseScale: 100,
  baseHeight: 100,
  baseWidth: 100,
};

// 基础通用配置
export const baseFormConfig = [
  {
    type: 'Divider',
  },
  {
    key: ['style', 'backgroundColor'],
    label: '组件背景色',
    type: 'Color',
  },
  {
    key: ['style', 'backgroundImage'],
    label: '组件背景图',
    type: 'Upload',
    maxLength: 1,
    format: 'string',
  },
  {
    key: '["showStartTime", "showEndTime"]',
    label: '显示时间',
    type: 'DatePicker',
    showTime: true,
  },
  {
    key: 'userGroup',
    label: '可见人群',
    type: 'userTagId',
    mode: 'multiple', // tags or multiple
  },
];
