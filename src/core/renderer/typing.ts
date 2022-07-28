import type { INewData } from '@/models/editorModal';

export interface IViewProps {
  pointData: INewData[];
  pageData?: any;
  isPreview?: boolean;
  width?: number;
  openSettingCB?: Function;
  mode?: 'droppable' | 'board';
  showTimeoutComp?: boolean;
  showNotStartComp?: boolean;
}
