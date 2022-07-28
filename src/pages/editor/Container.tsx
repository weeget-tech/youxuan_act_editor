import React, { memo } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useModel } from "umi";
import EditCompontentMiddle from "./components/Middle";
import HeaderComponent from "./components/Header";
import EditComponentLeft from "./components/Left";
import EditCompontentRight from "./components/Right";
import styles from "./index.less";

type TContainer = {
  location: any;
};

const DragArea = memo(() => {
  const {
    handleDragEnd,
    componentArray = [],
    pageData,
    showTimeoutComp,
    showNotStartComp,
  } = useModel("editorModal", (model) => ({
    componentArray: model.componentArray,
    handleDragEnd: model.handleDragEnd,
    pageData: model.pageData,
    showTimeoutComp: model.showTimeoutComp,
    showNotStartComp: model.showNotStartComp,
  }));

  return (
    <DragDropContext onDragEnd={(result: any) => handleDragEnd(result)}>
      <EditComponentLeft />
      <EditCompontentMiddle
        componentArray={componentArray}
        pageData={pageData}
        showTimeoutComp={showTimeoutComp}
        showNotStartComp={showNotStartComp}
      />
    </DragDropContext>
  );
});

const Container: React.FC<TContainer> = ({ location }) => {
  return (
    <>
      <HeaderComponent location={location} />
      <div className={styles.container}>
        <DragArea />
        <EditCompontentRight />
      </div>
    </>
  );
};

export default memo(Container);
