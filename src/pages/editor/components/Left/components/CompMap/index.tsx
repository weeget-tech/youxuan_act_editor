import React, { memo, useCallback, useMemo, useState } from 'react';
import { Popconfirm, Tooltip, Checkbox, Space, Dropdown, Menu } from 'antd';
import {
  MenuOutlined,
  CopyOutlined,
  DeleteOutlined,
  LockOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import type { IConfigData } from '@/models/editorModal';
import { isCoverEditorMode, isNotStartComp, isTimeOutComp } from '@/utils/act_utils';
import { getItemStyle } from '@/utils/utils';
import { useModel } from 'umi';
import styles from './index.less';

const CompMap = memo(() => {
  const {
    componentArray = [],
    copyPointData,
    delPointData,
    disableCopyComp,
    disableMoveComp,
    setShowTimeoutComp,
    setShowNotStartComp,
    showTimeoutComp,
    showNotStartComp,
    currentCompontent,
    modCurrPointData,
  }: any = useModel('editorModal', (model) => ({
    componentArray: model.componentArray,
    copyPointData: model.copyPointData,
    delPointData: model.delPointData,
    disableCopyComp: model.disableCopyComp,
    disableMoveComp: model.disableMoveComp,
    setShowTimeoutComp: model.setShowTimeoutComp,
    setShowNotStartComp: model.setShowNotStartComp,
    showTimeoutComp: model.showTimeoutComp,
    showNotStartComp: model.showNotStartComp,
    currentCompontent: model.currentCompontent,
    modCurrPointData: model.modCurrPointData,
  }));

  // 按钮功能，复制或删除
  const handleMenuClick = useMemo(() => {
    return (id: any, type: string, compArr: any[]) => {
      if (id !== 0 && !id) return;
      switch (type) {
        case 'copy':
          copyPointData(id);
          break;
        case 'del':
          delPointData(id);
          break;
        case 'mod':
          modCurrPointData(compArr, id);
          break;
        default:
          break;
      }
    };
  }, [componentArray]);

  const ComponentsMapItem = useCallback(
    (compArr: any[]) =>
      compArr.map((item: IConfigData, index: number) => {
        const { type, id, description, showEndTime, showStartTime } = item;
        // 检查是否为禁止复制组件
        const disableCopy = disableCopyComp.includes(type || '');
        const disableMove = disableMoveComp.includes(type || '');
        // const secondMap = secondMapList.includes(type || '');
        return isTimeOutComp(showEndTime, showTimeoutComp) ||
          isNotStartComp(showStartTime, showNotStartComp) ? (
          <div key={id} />
        ) : (
          <React.Fragment key={id}>
            <Draggable
              draggableId={`Map-${id}`}
              index={index}
              isDragDisabled={disableMove}
              key={id}
            >
              {(providedItem, snapshotItem) => (
                <div
                  onClick={() => {
                    handleMenuClick(id, 'mod', compArr);

                    // 滚动到对应的位置
                    const current = document.querySelector(`[data-rbd-draggable-id=Middle-${id}]`);
                    current?.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  className={`${styles.componentsMapItem} ${
                    currentCompontent.id === id ? styles.active : ''
                  }`}
                  ref={providedItem.innerRef}
                  {...providedItem.draggableProps}
                  style={getItemStyle(snapshotItem.isDragging, providedItem.draggableProps.style)}
                >
                  {disableMove ? (
                    <LockOutlined className={styles.dragIcon} />
                  ) : (
                    <MenuOutlined {...providedItem.dragHandleProps} className={styles.dragIcon} />
                  )}
                  <span className={`${styles.compTitle} wg-line-1`} title={id as string}>
                    {index + 1}.{description} - {id}
                  </span>
                  <Tooltip placement="top" title={disableCopy ? '' : '复制组件'}>
                    <div
                      className={styles.compMenuItem}
                      onClick={(e) => {
                        e.stopPropagation();
                        disableCopy || handleMenuClick(id, 'copy', compArr);
                      }}
                      style={{
                        color: disableCopy ? '#ccc' : '#767676',
                      }}
                    >
                      <CopyOutlined className={styles.compIcon} />
                    </div>
                  </Tooltip>
                  <Popconfirm
                    title={`确定删除该${description}组件吗？`}
                    onConfirm={() => handleMenuClick(id, 'del', compArr)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Tooltip placement="top" title="删除组件">
                      <div
                        className={styles.compMenuItem}
                        onClick={(e: any) => e.stopPropagation()}
                      >
                        <DeleteOutlined className={styles.compIcon} />
                      </div>
                    </Tooltip>
                  </Popconfirm>
                </div>
              )}
            </Draggable>
            {/* {secondMap && componentList.length > 0 && (
              <div
                style={{
                  paddingLeft: '20px',
                }}
              >
                <Droppable droppableId="Droppable-Map-Second" type="Map-Second">
                  {(provided) => (
                    <div
                      className={styles.droppablePanel}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {ComponentsMapItem(componentList)}
                    </div>
                  )}
                </Droppable>
              </div>
            )} */}
          </React.Fragment>
        );
      }),
    [componentArray, componentArray.length, showNotStartComp, showTimeoutComp, currentCompontent],
  );

  const ComponentsMapItemCover = useCallback(
    (compArr: any[]) =>
      compArr.map((item: IConfigData, index: number) => {
        const { type, id, componentList = [] } = item;
        if (type === 'DynamicArea' && componentList.length > 0) {
          return (
            <div className={styles.coverCompBox} key={index}>
              <div className={styles.coverCompBoxTitle}>动态配置区</div>
              <Droppable droppableId={`Droppable-Map-Second-${id}`} type="Map-Second">
                {(providedTag) => (
                  <div
                    className={styles.droppablePanel}
                    {...providedTag.droppableProps}
                    ref={providedTag.innerRef}
                  >
                    {ComponentsMapItem(componentList)}
                  </div>
                )}
              </Droppable>
            </div>
          );
        }
        return <></>;
      }),
    [componentArray, componentArray.length, showNotStartComp, showTimeoutComp, currentCompontent],
  );

  const [visible, setVisible] = useState(false);

  const menu = (
    <Menu
      onClick={(e) => {
        if (e.key === '3') {
          setVisible(false);
        }
      }}
    >
      <Menu.Item>
        <Checkbox checked={showTimeoutComp} onChange={(e) => setShowTimeoutComp(e.target.checked)}>
          显示过期组件
        </Checkbox>
      </Menu.Item>
      <Menu.Item>
        <Checkbox
          checked={showNotStartComp}
          onChange={(e) => setShowNotStartComp(e.target.checked)}
        >
          显示未开始组件
        </Checkbox>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.compMapBox}>
      <div className={styles.CompMapTitle}>
        <div className={styles.left}>
          <div className={styles.title}>已加载组件</div>
        </div>
        <div className={styles.right}>
          <Dropdown overlay={menu} onVisibleChange={(flag) => setVisible(flag)} visible={visible}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                组件过滤
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
      <div className={styles.penelBox}>
        <Droppable droppableId="Droppable-Map-First" type="Map-First">
          {(provided) => (
            <div
              className={styles.droppablePanel}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {isCoverEditorMode()
                ? ComponentsMapItemCover(componentArray)
                : ComponentsMapItem(componentArray)}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
});

export default CompMap;
