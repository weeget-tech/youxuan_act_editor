import React, { memo } from "react";
import { useModel } from "umi";
import EditForm from "./components/EditForm";

const EditCompontentRight = () => {
  const {
    currentCompontent = {},
    setCurrentCompontent,
    delPointData,
    modPointData,
    currentABTest,
    setCurrentABTest,
    componentArray,
  }: any = useModel("editorModal", (model) => ({
    pageData: model.pageData,
    currentCompontent: model.currentCompontent,
    setCurrentCompontent: model.setCurrentCompontent,
    delPointData: model.delPointData,
    modPointData: model.modPointData,
    currentABTest: model.currentABTest,
    setCurrentABTest: model.setCurrentABTest,
    componentArray: model.componentArray,
    abCompList: model.abCompList,
    setAbCompList: model.setAbCompList,
    deleteCurrentABTest: model.deleteCurrentABTest,
  }));
  return (
    <>
      {/* 组件配置表单 */}
      <EditForm
        currentCompontent={currentCompontent}
        setCurrentCompontent={setCurrentCompontent}
        delPointData={delPointData}
        modPointData={modPointData}
        currentABTest={currentABTest}
        setCurrentABTest={setCurrentABTest}
        componentArray={componentArray}
      />
    </>
  );
};

export default memo(EditCompontentRight);
