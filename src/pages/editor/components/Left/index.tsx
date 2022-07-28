import React, { useMemo } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import schemaMap from '@/materials/schema';
import basicTemplate from '@/materials/template';
import DynamicEngine from '@/core/DynamicEngine';
import { isCoverEditorMode, isDevMode } from '@/utils/act_utils';
import CompMap from './components/CompMap';
import CompBox from './components/CompBox';
import styles from './index.less';

const EditComponentLeft = () => {
  const coverTemplate = basicTemplate.filter((i: any) => !i.hiddenInPageEdit);

  const CompList = useMemo(
    () => (
      <div className={styles.compContain}>
        <div className={styles.panelTitle}>
          <span>组件列表</span>
          {/* <span className={styles.compCount}>
            {isCoverEditorMode() && !isDevMode() ? coverTemplate.length : basicTemplate.length}
          </span> */}
        </div>
        <div className={styles.penelBox}>
          {/* 覆盖页列表 */}
          {isCoverEditorMode() && !isDevMode() && (
            <Droppable
              droppableId="droppable-left-base"
              isDropDisabled
              direction="horizontal"
              type="second-level"
              isCombineEnabled
            >
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {coverTemplate.map((value, i) => (
                    <CompBox item={value} key={i.toString()} index={i}>
                      <DynamicEngine
                        {...value}
                        data={schemaMap[value.type]?.config}
                        componentsType="base"
                        isTpl
                      />
                    </CompBox>
                  ))}
                </div>
              )}
            </Droppable>
          )}
          {/* 活动页列表 */}
          {(!isCoverEditorMode() || isDevMode()) && (
            <Droppable
              droppableId="Droppable-Left"
              isDropDisabled
              direction="horizontal"
              type="First"
              isCombineEnabled
            >
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {basicTemplate.map((value, i) => (
                    <CompBox item={value} key={i.toString()} index={i}>
                      <DynamicEngine
                        {...value}
                        data={schemaMap[value.type]?.config}
                        componentsType="base"
                        isTpl
                      />
                    </CompBox>
                  ))}
                </div>
              )}
            </Droppable>
          )}
        </div>
      </div>
    ),
    [],
  );

  return (
    <>
      <div
        className={`${styles.editComponentLeft} leftShowAnimation`}
        style={{
          transition: 'all ease-in-out 0.5s',
          position: 'fixed',
          zIndex: 200,
          boxShadow: 'none',
        }}
      >
        <div className={styles.penel}>
          {CompList}
          <CompMap />
        </div>
      </div>
      <div
        style={{
          width: '240px',
          transition: 'all ease-in-out 0.5s',
        }}
      />
    </>
  );
};

export default EditComponentLeft;
