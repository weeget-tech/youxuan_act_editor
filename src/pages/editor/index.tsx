/* eslint-disable no-self-compare */
import React, { useEffect } from "react";
import { useModel } from "umi";
import Container from "./Container";
import styles from "./index.less";

const BasicLayout = (props: any) => {
  const { initEditData } = useModel("editorModal", (model) => ({
    initEditData: model.initEditData,
    clearEditor: model.clearEditor,
  }));

  useEffect(() => {
    initEditData();
  }, []);

  return (
    <div className={styles.layout}>
      <Container {...props} />
    </div>
  );
};

export default BasicLayout;
