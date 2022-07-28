import { useModel } from "umi";
import { DynamicEngine } from "@/core";
import type { IConfigData } from "@/models/editorModal";
import { getItemStyle } from "@/utils/utils";
import {
  getTabSliderIndex,
  isNotStartComp,
  isTimeOutComp,
  isNotCutShotComp,
} from "@/utils/act_utils";
import React, { memo } from "react";
import { Draggable } from "react-beautiful-dnd";
import styles from "./index.less";

const Layout = memo(
  ({
    pointData,
    showTimeoutComp,
    showNotStartComp,
    coverCompId = "",
    hideNotCutShotComp,
  }: any) => {
    const { currentCompontent, modCurrPointData, firstRenderPoint } = useModel(
      "editorModal",
      (model) => ({
        currentCompontent: model.currentCompontent,
        modCurrPointData: model.modCurrPointData,
        firstRenderPoint: model.firstRenderPoint,
      })
    );
    const { id }: any = currentCompontent;

    // 侧边栏开始索引值
    const sliderIndex = getTabSliderIndex(pointData);

    return pointData.map((renderItem: IConfigData, index: number) =>
      isTimeOutComp(renderItem.showEndTime, showTimeoutComp) ||
      isNotStartComp(renderItem.showStartTime, showNotStartComp) ||
      isNotCutShotComp(renderItem.type, hideNotCutShotComp) ? (
        <div key={renderItem.id} />
      ) : (
        <Draggable
          key={renderItem.id}
          draggableId={`Middle-${renderItem.id}`}
          index={index}
        >
          {(providedItem, snapshotItem) => {
            // 是否为侧边栏组件, 自动缩进组件
            const hasSlider = sliderIndex > -1 && index > sliderIndex;
            return (
              <div className={styles.wrapper}>
                <div
                  ref={providedItem.innerRef}
                  {...providedItem.draggableProps}
                  {...providedItem.dragHandleProps}
                  style={getItemStyle(
                    snapshotItem.isDragging,
                    providedItem.draggableProps.style
                  )}
                  className={`${styles.dragItem} ${
                    id === renderItem.id ? styles.active : ""
                  } ${hasSlider ? "slider-right-content" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    modCurrPointData(pointData, renderItem.id, coverCompId);
                  }}
                >
                  <DynamicEngine
                    {...(renderItem as any)}
                    isTpl={false}
                    hasSlider={hasSlider}
                    compIndex={firstRenderPoint ? index : null}
                  />
                </div>
              </div>
            );
          }}
        </Draggable>
      )
    );
  }
);

export default Layout;
