import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { FormRender } from '@/core';
import schemaMap from '@/materials/schema';
import styles from './index.less';

const EditForm = ({
  currentCompontent = {},
  setCurrentCompontent,
  delPointData,
  modPointData,
  setCurrentABTest,
  componentArray,
}: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rightColla, setRightColla] = useState(true);

  useEffect(() => {
    if (currentCompontent.id) {
      setRightColla(false);
    } else {
      setRightColla(true);
    }
  }, [currentCompontent]);

  const handleDel = useMemo(() => {
    return (id: any) => {
      delPointData(id);
    };
  }, [delPointData]);

  const handleFormSave = useMemo(() => {
    return (data: Record<string, any>) => {
      modPointData(currentCompontent, data);
    };
  }, [currentCompontent, modPointData, componentArray]);

  const FormArea = useMemo(() => {
    return (
      <FormRender
        config={schemaMap[currentCompontent.type]?.editData}
        uid={currentCompontent.id}
        defaultValue={currentCompontent}
        onSave={handleFormSave}
        onDel={handleDel}
        rightPannelRef={ref}
        layout="vertical"
        formColCfg={{
          labelCol: { span: 24 },
          wrapperCol: { span: 24 },
        }}
      />
    );
  }, [currentCompontent.id, componentArray]);

  return (
    <>
      <div
        ref={ref}
        className={styles.attrSetting}
        style={{
          transition: 'all ease-in-out 0.4s',
          marginRight: rightColla ? '-400px' : 0,
        }}
      >
        <div className={styles.tit}>
          <div className="left">{currentCompontent.description || ''}设置</div>
          <div
            className={styles.right}
            onClick={() => {
              setRightColla(true);
              setCurrentCompontent({});
            }}
          >
            <span className="iconfont iconf-close" />
          </div>
        </div>
        {!rightColla && FormArea}
      </div>
      <div
        style={{
          width: rightColla ? 0 : '340px',
          transition: 'width ease-in-out 0.4s',
          background: '#fff',
        }}
      />
    </>
  );
};

export default memo(EditForm);
