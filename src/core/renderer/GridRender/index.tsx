import React, { memo } from "react";
import { Droppable } from "react-beautiful-dnd";
import { getBackgroundStyle } from "@/utils/act_utils";
import type { IViewProps } from "../typing";
import NavigationBar from "./component/NavigationBar/index";
import styles from "./index.less";
import Layout from "./component/Layout";

const GridRender = memo((props: IViewProps) => {
  const {
    pointData,
    pageData,
    openSettingCB,
    showTimeoutComp,
    showNotStartComp,
  } = props;

  return (
    <div className={styles.droppable}>
      <NavigationBar navigationData={pageData} openSettingCB={openSettingCB} />
      <Droppable droppableId="Droppable-Middle" type="First" isCombineEnabled>
        {(provided) => (
          <div
            className={styles.droppablePanel}
            id="droppablePanel"
            style={{
              ...getBackgroundStyle(pageData),
            }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <Layout
              pointData={pointData}
              showTimeoutComp={showTimeoutComp}
              showNotStartComp={showNotStartComp}
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
});

export default GridRender;
