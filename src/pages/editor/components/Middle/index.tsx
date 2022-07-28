import React, { memo, useState } from 'react';
import { ViewRender } from '@/core';
import 'react-contexify/dist/ReactContexify.min.css';
import { INewData } from '@/models/editorModal';
import PageSettingDrawer from '@/components/PageSettingDrawer';
import CompControl from './components/CompControl';
import styles from './index.less';

interface IEditCompontentMiddle {
  componentArray: INewData[];
  pageData: any;
  showTimeoutComp?: boolean;
  showNotStartComp?: boolean;
}

const EditCompontentMiddle: React.FC<IEditCompontentMiddle> = memo(
  ({ componentArray = [], pageData, showTimeoutComp, showNotStartComp }) => {
    const [pageSettingVisible, setPageSettingVisible] = useState(false);
    return (
      <div className={`${styles.editorPanel} upShowAnimation`}>
        {/* 画板 */}
        <ViewRender
          pointData={componentArray}
          pageData={pageData}
          openSettingCB={() => setPageSettingVisible(false)}
          showTimeoutComp={showTimeoutComp}
          showNotStartComp={showNotStartComp}
        />
        {/* 组件操作按钮 */}
        <CompControl />
        {/* 页面设置弹窗 */}
        <PageSettingDrawer onClose={() => setPageSettingVisible(false)} show={pageSettingVisible} />
      </div>
    );
  },
);

export default EditCompontentMiddle;
