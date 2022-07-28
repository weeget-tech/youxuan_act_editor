import type { ReactNode } from 'react';
import React, { memo, useMemo } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import schema from '@/materials/schema';
import { useModel } from 'umi';
import { uuid } from '@/utils/tool';
import { message } from 'antd';
import { isCoverEditorMode } from '@/utils/act_utils';
import styles from './index.less';

interface ICompBoxProps {
  item: any;
  index: number;
  children: ReactNode;
}

const Container = styled.div`
  display: inline-block;
`;

const Clone = styled(Container)`
  ~ div {
    transform: none !important;
  }
`;

const ItemContent = memo((props: ICompBoxProps) => (
  <div
    className={`${styles.module} ${(props.index + 1) % 3 === 0 ? styles.mr0 : ''}`}
    key={props.index}
  >
    <div
      style={{
        height: '43px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {props.children}
    </div>
    <div
      style={{
        height: '30px',
        textAlign: 'center',
        color: '#3C3C3C',
        fontSize: '12px',
      }}
    >
      {props.item.displayName}
    </div>
  </div>
));

const CompBox = memo((props: ICompBoxProps) => {
  const { item, index } = props;

  const { componentArray, addPointData } = useModel('editorModal', (model) => ({
    componentArray: model.componentArray,
    addPointData: model.addPointData,
  }));
  const commonConfig = {
    ..._.cloneDeep(schema[item.type]?.config.data),
  };

  const addPoint = useMemo(() => {
    return () => {
      if (isCoverEditorMode()) {
        message.error('不支持点击添加,请拖拽组件到对应的配置区域内');
        return;
      }
      const params = {
        ...commonConfig,
        id: uuid(6, 10),
      };
      addPointData(params, componentArray.length ? componentArray.length : 0);
    };
  }, [commonConfig, componentArray]);

  return (
    <Draggable draggableId={`Left-${index.toString()}`} index={index}>
      {(provided, snapshot) => {
        return (
          <>
            <Container
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              onClick={addPoint}
            >
              <ItemContent {...props} />
            </Container>
            {snapshot.isDragging && (
              <Clone>
                <ItemContent {...props} />
              </Clone>
            )}
          </>
        );
      }}
    </Draggable>
  );
});

export default CompBox;
