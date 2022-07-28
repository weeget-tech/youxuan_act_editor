import React from 'react';
import { isEditorMode, pxTransform } from '@/utils/act_utils';
import CompIcon from '../CompIcon';
import styles from './index.less';

const EmptyComp = ({ type, title, height = '120', minHeight }: any) => {
  return isEditorMode() ? (
    <div className={styles.emptyComp} style={{ height: `${height}px` }}>
      <CompIcon type={type} />
      <div className={styles.emptyTitle}>{title}</div>
    </div>
  ) : minHeight && !isEditorMode() ? (
    <div style={{ minHeight: pxTransform(minHeight, 375) }} />
  ) : (
    <></>
  );
};

export default EmptyComp;
